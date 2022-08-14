import { gql } from '@apollo/client/core';
import { apolloClient } from '../apollo-client';
import { login } from '../authentication/login';
import { signedTypeData, splitSignature } from '../ethers.service';
import { pollUntilIndexed } from '../indexer/has-transaction-been-indexed';
import { lensPeriphery } from '../lens-hub';
import { store } from '@/store/store'

const CREATE_TOGGLE_FOLLOW_TYPED_DATA = `
  mutation($request: CreateToggleFollowRequest!) { 
    createToggleFollowTypedData(request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          ToggleFollowWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          profileIds
          enables
        }
      }
    }
 }
`;

// TODO sort typed!
const createToggleFollowTypedData = (profileIds: string[], enables: boolean[]) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_TOGGLE_FOLLOW_TYPED_DATA),
    variables: {
      request: {
        profileIds,
        enables,
      },
    },
  });
};

export const toggleFollow = async (profileId: string = '0x032f1a') => {
  await login();
  // yoginth - 0x0f
  const profileIds: string[] = ['0x0f']; // Ensure you follow this profileID
  const enables: boolean[] = [false];

  const result = await createToggleFollowTypedData(profileIds, enables);
  console.log('follow: result', result);

  const typedData = result.data.createToggleFollowTypedData.typedData;
  console.log('follow: typedData', typedData);

  const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
  console.log('follow: signature', signature);

  const { v, r, s } = splitSignature(signature);

  //   return tx.hash;

  const tx = await lensPeriphery.toggleFollowWithSig({
    follower: store.address,
    profileIds: profileIds,
    enables: enables,
    sig: {
      v,
      r,
      s,
      deadline: typedData.value.deadline,
    },
  });
  console.log('follow: tx hash', tx.hash);

  console.log('follow: poll until indexed');
  const indexedResult = await pollUntilIndexed(tx.hash);

  console.log('follow: profile has been indexed', result);

  const logs = indexedResult.txReceipt.logs;

  console.log('follow: logs', logs);
};

(async () => {
  await toggleFollow();
})();

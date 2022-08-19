import { gql } from '@apollo/client/core';
import { apolloClient } from '../apollo-client';
import { login } from '../authentication/login';
import { getAddressFromSigner, signedTypeData, splitSignature } from '../ethers.service';
import { pollUntilIndexed } from '../indexer/has-transaction-been-indexed';
import { lensHub } from '../lens-hub';
import { store } from '@/store/store'

const CREATE_SET_DEFAULT_PROFILE_TYPED_DATA = `
  mutation($request: CreateSetDefaultProfileRequest!) { 
    createSetDefaultProfileTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetDefaultProfileWithSig {
            name
            type
          }
        }
      domain {
        name
        chainId
        version
        verifyingContract
      }
      value {
        nonce
        deadline
        wallet
        profileId
      }
    }
  }
}
`;

const createSetDefaultProfileTypedData = (profileId: string) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_SET_DEFAULT_PROFILE_TYPED_DATA),
    variables: {
      request: {
        profileId,
      },
    },
  });
};

export const setDefaultProfile = async (profileId:string) => {

  const address = store.address;
  console.log('set default profile: address', address);

  await login();

  const result = await createSetDefaultProfileTypedData(profileId);
  console.log('set default profile: createSetDefaultProfileTypedData', result);

  const typedData = result.data.createSetDefaultProfileTypedData.typedData;
  console.log('set default profile: typedData', typedData);

  const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
  console.log('set default profile: signature', signature);

  const { v, r, s } = splitSignature(signature);

  const tx = await lensHub.setDefaultProfileWithSig({
    profileId: typedData.value.profileId,
    wallet: typedData.value.wallet,
    sig: {
      v,
      r,
      s,
      deadline: typedData.value.deadline,
    },
  });
  console.log('set default profile: tx hash', tx.hash);

  console.log('set default profile: poll until indexed');
  const indexedResult = await pollUntilIndexed(tx.hash);

  console.log('set default profile: action has been indexed', indexedResult);

  return result.data;
};
import { gql } from '@apollo/client/core';
import { apolloClient } from '../apollo-client';
import { login } from '../authentication/login';
import { signedTypeData, splitSignature } from '../ethers.service';
import { lensHub } from '../lens-hub';
import { store } from '@/store/store'

const CREATE_SET_FOLLOW_MODULE_TYPED_DATA = `
  mutation($request: CreateSetFollowModuleRequest!) { 
    createSetFollowModuleTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetFollowModuleWithSig {
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
        profileId
        followModule
        followModuleInitData
      }
     }
   }
 }
`;

// TODO: sort typed
const createSetFollowModuleTypedData = (setFollowModuleRequest: any) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_SET_FOLLOW_MODULE_TYPED_DATA),
    variables: {
      request: setFollowModuleRequest,
    },
  });
};

export const setFollowModule = async () => {
  const profileId = store.defaultProfile.id;
  if (!profileId) {
    throw new Error('Must define PROFILE_ID in the .env to run this');
  }

  await login();

  // hard coded to make the code example clear
  const setFollowModuleRequest = {
    profileId,
    followModule: {
      // freeFollowModule: true,
      // feeFollowModule: {
      //   amount: {
      //     currency: '0x3C68CE8504087f89c640D02d133646d98e64ddd9',
      //     value: '0.01',
      //   },
      //   recipient: address,
      // },
      // revertFollowModule: true,
      profileFollowModule: true,
    },
  };

  const result = await createSetFollowModuleTypedData(setFollowModuleRequest);
  console.log('set follow module: result', result);

  const typedData = result.data.createSetFollowModuleTypedData.typedData;
  console.log('set follow module: typedData', typedData);

  const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
  console.log('set follow module: signature', signature);

  const { v, r, s } = splitSignature(signature);

  const tx = await lensHub.setFollowModuleWithSig({
    profileId: typedData.value.profileId,
    followModule: typedData.value.followModule,
    followModuleInitData: typedData.value.followModuleInitData,
    sig: {
      v,
      r,
      s,
      deadline: typedData.value.deadline,
    },
  });
  console.log('follow: tx hash', tx.hash);
};

(async () => {
  await setFollowModule();
})();

import { gql } from '@apollo/client/core';
import { apolloClient } from '../apollo-client';
import { login } from '../authentication/login';
import { getAddressFromSigner, signedTypeData, splitSignature } from '../ethers.service';
import { prettyJSON } from '../helpers';
import { lensHub } from '../lens-hub';
import { store } from '@/store/store';
import { pollUntilIndexed } from '../indexer/has-transaction-been-indexed';


const CREATE_COLLECT_TYPED_DATA = `
  mutation($request: CreateCollectRequest!) { 
    createCollectTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          CollectWithSig {
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
        pubId
        data
      }
     }
   }
 }
`;

// TODO typings
const createCollectTypedData = (createCollectTypedDataRequest: any) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_COLLECT_TYPED_DATA),
    variables: {
      request: createCollectTypedDataRequest,
    },
  });
};

export const collect = async (internalPublicationId:any) => {

  await login();

  // must follow to collect need to wait for it to be indexed!
  // await follow('0x032f1a');

  // hard coded to make the code example clear
  // remember you must make sure you approved allowance of
  // this currency on the module
  const collectRequest = {
    publicationId: internalPublicationId,
  };

  const result = await createCollectTypedData(collectRequest);
  console.log('collect: createCollectTypedData', result);

  const typedData = result.data.createCollectTypedData.typedData;
  prettyJSON('collect: typedData', typedData);

  const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
  console.log('collect: signature', signature);

  const { v, r, s } = splitSignature(signature);

  const tx = await lensHub.collectWithSig(
    {
      collector: store.address,
      profileId: typedData.value.profileId,
      pubId: typedData.value.pubId,
      data: typedData.value.data,
      sig: {
        v,
        r,
        s,
        deadline: typedData.value.deadline,
      },
    },
    { gasLimit: 1000000 }
  );
  console.log('collect: tx hash', tx.hash);

  console.log('follow: poll until indexed');
  const indexedResult = await pollUntilIndexed(tx.hash);
  const logs = indexedResult.txReceipt.logs;
  console.log('follow: logs', logs);
  store.currentProfile.stats.totalAmountOfCollects += 1
  store.collectInProgress = false
  store.currentProfile.hasCollectedByMe = true
  return tx.hash

};
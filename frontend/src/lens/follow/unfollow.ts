import { gql } from '@apollo/client/core';
import { ethers } from 'ethers';
import { apolloClient } from '../apollo-client';
import { login } from '../authentication/login';
import { LENS_FOLLOW_NFT_ABI } from '../config';
import { getSigner, signedTypeData, splitSignature } from '../ethers.service';
import { prettyJSON } from '../helpers';
import { store } from '@/store/store'
import { doesFollow } from './does-follow'
import { pollUntilIndexed } from '../indexer/has-transaction-been-indexed';

const CREATE_UNFOLLOW_TYPED_DATA = `
  mutation($request: UnfollowRequest!) { 
    createUnfollowTypedData(request: $request) {
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
          BurnWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          tokenId
        }
      }
    }
 }
`;

const createUnfollowTypedData = (profile: string) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_UNFOLLOW_TYPED_DATA),
    variables: {
      request: {
        profile,
      },
    },
  });
};

export const unfollow = async (unfollowProfileId:string) => {
  await login();

  // hard coded to make the code example clear
  const result = await createUnfollowTypedData(unfollowProfileId);
  console.log('unfollow: result', result);

  const typedData = result.data.createUnfollowTypedData.typedData;
  prettyJSON('unfollow: typedData', typedData);

  const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
  console.log('unfollow: signature', signature);

  const { v, r, s } = splitSignature(signature);

  // load up the follower nft contract
  const followNftContract = new ethers.Contract(
    typedData.domain.verifyingContract,
    LENS_FOLLOW_NFT_ABI,
    getSigner
  );

  const sig = {
    v,
    r,
    s,
    deadline: typedData.value.deadline,
  };

  // force the tx to send
  const tx = await followNftContract.burnWithSig(typedData.value.tokenId, sig);
  console.log('follow: tx hash', tx.hash);

  console.log('unfollow: poll until indexed');
  const indexedResult = await pollUntilIndexed(tx.hash);
  const logs = indexedResult.txReceipt.logs;
  console.log('unfollow: logs', logs);

  
  // @ts-ignore
  doesFollow(store.address, unfollowProfileId).then((data)=>{
    store.followInProgress = false
    store.userIsFollowing = data.doesFollow[0].follows
  })
  
  return tx.hash;
};
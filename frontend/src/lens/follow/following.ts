import { gql } from '@apollo/client/core';
import { apolloClient } from '../apollo-client';
import { prettyJSON } from '../helpers';
import { store } from '@/store/store'

const GET_FOLLOWING = `
  query($request: FollowingRequest!) {
    following(request: $request) { 
      items {
        profile {
          id
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
		}
  }
`;

const followingRequest = (walletAddress: string|null) => {
  return apolloClient.query({
    query: gql(GET_FOLLOWING),
    variables: {
      request: {
        address: walletAddress,
        limit: 10,
      },
    },
  });
};

export const following = async (address:string|null) => {

  console.log('following: address', address);

  const result = await followingRequest(address);
  // prettyJSON('following: result', ronesult.data);
  // @ts-ignore
  store.followedAccounts = result.data.following.items.map(elem => elem.profile.id)

  return result.data;
};

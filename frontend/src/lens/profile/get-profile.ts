import { gql } from '@apollo/client/core';
import { apolloClient } from '../apollo-client';
import { login } from '../authentication/login';
import { prettyJSON } from '../helpers';


const GET_PROFILE = `
  query($request: SingleProfileQueryRequest!) {
    profile(request: $request) {
        id
        name
        bio
        attributes {
          displayType
          traitType
          key
          value
        }
        followNftAddress
        metadata
        isDefault
        isFollowedByMe
        isFollowing(who: null)
        picture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
          __typename
        }
        handle
        coverPicture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
          __typename
        }
        ownedBy
        dispatcher {
          address
          canUseRelay
        }
        stats {
          totalFollowers
          totalFollowing
          totalPosts
          totalComments
          totalMirrors
          totalPublications
          totalCollects
        }
        followModule {
          ... on FeeFollowModuleSettings {
            type
            amount {
              asset {
                symbol
                name
                decimals
                address
              }
              value
            }
            recipient
          }
          ... on ProfileFollowModuleSettings {
            type
          }
          ... on RevertFollowModuleSettings {
            type
          }
        }
    }
  }
`;

export interface ProfileRequest {
  profileId?: string;
  handles?: string;
}

const getProfileRequest = (request: ProfileRequest) => {
  return apolloClient.query({
    query: gql(GET_PROFILE),
    variables: {
      request,
    },
  });
};

export const profile = async (profileId:any) => {

  await login();
  const request = { profileId: profileId };
  const profile = await getProfileRequest(request);
  // prettyJSON('profile: result', profile.data);

  return profile.data;
};

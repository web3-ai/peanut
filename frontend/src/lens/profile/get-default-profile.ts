import { gql } from '@apollo/client/core';
import { apolloClient } from '../apollo-client';
import { prettyJSON } from '../helpers';
import { store } from '@/store/store'


const GET_DEFAULT_PROFILES = `
  query($request: DefaultProfileRequest!) {
    defaultProfile(request: $request) {
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

const getDefaultProfileRequest = (ethereumAddress: string|null) => {
  if(ethereumAddress===null) {
    console.log('The wallet address is null. Check the wallet connection.')
  }
  return apolloClient.query({
    query: gql(GET_DEFAULT_PROFILES),
    variables: {
      request: {
        ethereumAddress,
      },
    },
  });
};

export const getDefaultProfile = async (address: string|null) => {
  const result = await getDefaultProfileRequest(address);
  // prettyJSON('profiles: result', result.data);
  store.defaultProfile = result.data.defaultProfile
  return result.data;
};

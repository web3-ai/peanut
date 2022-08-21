import { gql } from '@apollo/client/core';
import { apolloClient } from '../apollo-client';
import { prettyJSON } from '../helpers';
import { store } from '@/store/store'

const EXPLORE_PUBLICATIONS = `
  query($request: ExplorePublicationRequest!) {
    explorePublications(request: $request) {
      items {
        __typename 
        ... on Post {
          ...PostFields
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }

  fragment MediaFields on Media {
    url
    width
    height
    mimeType
  }

  fragment ProfileFields on Profile {
    id
    name
    bio
    attributes {
      displayType
      traitType
      key
      value
    }
    isFollowedByMe
    isFollowing(who: null)
    followNftAddress
    metadata
    isDefault
    handle
    picture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
        small {
          ...MediaFields
        }
        medium {
          ...MediaFields
        }
      }
    }
    coverPicture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
        small {
         ...MediaFields
        }
        medium {
          ...MediaFields
        }
      }
    }
    ownedBy
    dispatcher {
      address
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
            name
            symbol
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

  fragment PublicationStatsFields on PublicationStats { 
    totalAmountOfMirrors
    totalAmountOfCollects
    totalAmountOfComments
  }

  fragment MetadataOutputFields on MetadataOutput {
    name
    description
    content
    image
    media {
      original {
        ...MediaFields
      }
      small {
        ...MediaFields
      }
      medium {
        ...MediaFields
      }
    }
    attributes {
      displayType
      traitType
      value
    }
  }

  fragment Erc20Fields on Erc20 {
    name
    symbol
    decimals
    address
  }

  fragment CollectModuleFields on CollectModule {
    __typename
    ... on FreeCollectModuleSettings {
      type
      followerOnly
      contractAddress
    }
    ... on FeeCollectModuleSettings {
      type
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
    }
    ... on LimitedFeeCollectModuleSettings {
      type
      collectLimit
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
    }
    ... on LimitedTimedFeeCollectModuleSettings {
      type
      collectLimit
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
      endTimestamp
    }
    ... on RevertCollectModuleSettings {
      type
    }
    ... on TimedFeeCollectModuleSettings {
      type
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
      endTimestamp
    }
  }

  fragment PostFields on Post {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
    hidden
    reaction(request: null)
    mirrors(by: null)
    hasCollectedByMe
  }
`;

const explorePublications = (explorePublicationQueryRequest: {
  sortCriteria: string;
  limit: number;
  sources: string[];
  excludeProfileIds: string[];
}) => {
  return apolloClient.query({
    query: gql(EXPLORE_PUBLICATIONS),
    variables: {
      request: explorePublicationQueryRequest,
    },
  });
};

export const exploreLatest = async (excludeProfileIds:string[]) => {
  const result = await explorePublications({
    // switch for `TOP_COLLECTED` if you wanted collected!
    // switch for `TOP_MIRRORED` if you wanted top mirrored
    // switch for `TOP_COMMENTED` if you wanted top commented
    sortCriteria: 'LATEST',
    limit: 50,
    sources: ['peanut37'],
    excludeProfileIds: excludeProfileIds,
  });

  prettyJSON('explore: result', result.data);
  store.latestPublicationList = result.data.explorePublications.items

  return result.data;
};

export const explorePopular = async (excludeProfileIds:string[]) => {
  const result = await explorePublications({
    // switch for `TOP_COLLECTED` if you wanted collected!
    // switch for `TOP_MIRRORED` if you wanted top mirrored
    // switch for `TOP_COMMENTED` if you wanted top commented
    sortCriteria: 'TOP_COLLECTED',
    limit: 50,
    sources: ['peanut37'],
    excludeProfileIds: excludeProfileIds,
  });

  // prettyJSON('explore: result', result.data);
  store.popularPublicationList = result.data.explorePublications.items
  return result.data;
};

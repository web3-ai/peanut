import { gql } from '@apollo/client/core';
import { apolloClient } from '../apollo-client';
import { login } from '../authentication/login';
import { store } from '@/store/store';

const REMOVE_REACTION = `
  mutation($request: ReactionRequest!) { 
   removeReaction(request: $request)
 }
`;

enum ReactionType {
  UPVOTE = 'UPVOTE',
  DOWNVOTE = 'DOWNVOTE',
}

const removeReactionRequest = (
  profileId: string,
  reaction: ReactionType,
  publicationId: string
) => {
  return apolloClient.mutate({
    mutation: gql(REMOVE_REACTION),
    variables: {
      request: {
        profileId,
        reaction,
        publicationId,
      },
    },
  });
};

export const removeReaction = async (internalPublicationId:string) => {
  const profileId = store.defaultProfile.id;
  if (!profileId) {
    throw new Error('Must define PROFILE_ID in the .env to run this');
  }

  const address = store.address
  console.log('remove reaction: address', address);

  await login();

  await removeReactionRequest(profileId, ReactionType.UPVOTE, internalPublicationId);

  console.log('remove reaction: sucess');
};

import { gql } from '@apollo/client/core';
import { apolloClient } from '../apollo-client';
import { login } from '../authentication/login';
import { store } from '@/store/store'

const ADD_REACTION = `
  mutation($request: ReactionRequest!) { 
   addReaction(request: $request)
 }
`;

enum ReactionType {
  UPVOTE = 'UPVOTE',
  DOWNVOTE = 'DOWNVOTE',
}

const addReactionRequest = (profileId: string, reaction: ReactionType, publicationId: string) => {
  return apolloClient.mutate({
    mutation: gql(ADD_REACTION),
    variables: {
      request: {
        profileId,
        reaction,
        publicationId,
      },
    },
  });
};

export const addReaction = async (internalPublicationId:string) => {
  const profileId = store.defaultProfile.id
  if (!profileId) {
    throw new Error('Must define PROFILE_ID in the .env to run this');
  }

  const address = store.address
  console.log('add reaction: address', address);

  await login();

  await addReactionRequest(profileId, ReactionType.UPVOTE, internalPublicationId);

  console.log('add reaction: sucess');
};
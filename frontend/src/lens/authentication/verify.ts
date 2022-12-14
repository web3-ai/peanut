import { gql } from '@apollo/client/core';
import { apolloClient } from '../apollo-client';
import { prettyJSON } from '../helpers';
import { login } from './login';

const VERIFY = `
  query($request: VerifyRequest!) {
    verify(request: $request)
  }
`;

const verify = (accessToken: string) => {
  return apolloClient.query({
    query: gql(VERIFY),
    variables: {
      request: {
        accessToken,
      },
    },
  });
};

export const verifyRequest = async () => {
  const accessTokens = await login();

  const result = await verify(accessTokens.authenticate.accessToken);
  prettyJSON('verify: result', result.data);

  return result.data;
};

export const verifyToken = async (accessToken:string) => {
  const result = await verify(accessToken);
  prettyJSON('verify: result', result.data);
  return result.data;
};

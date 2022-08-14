import { gql } from '@apollo/client/core';
import { apolloClient } from '../apollo-client';
import { prettyJSON } from '../helpers';
import { login } from './login';


const REFRESH_AUTHENTICATION = `
  mutation($request: RefreshRequest!) { 
    refresh(request: $request) {
      accessToken
      refreshToken
    }
 }
`;

const refreshAuth = (refreshToken: string) => {
  return apolloClient.mutate({
    mutation: gql(REFRESH_AUTHENTICATION),
    variables: {
      request: {
        refreshToken,
      },
    },
  });
};

export const refresh = async () => {

  const accessTokens = await login();

  const newAccessToken = await refreshAuth(
    accessTokens.authenticate.refreshToken
  );
  prettyJSON('refresh: result', newAccessToken.data);

  return newAccessToken.data;
};

(async () => {
  await refresh();
})();

import { gql } from '@apollo/client/core';
import { apolloClient } from '../apollo-client';
import { getSigner, provider } from '../ethers.service';
import { prettyJSON } from '../helpers';
import { getAuthenticationToken, setAuthenticationToken } from '../state';
import { store } from '@/store/store'
import { getDefaultProfile } from '../profile/get-default-profile'




const GET_CHALLENGE = `
  query($request: ChallengeRequest!) {
    challenge(request: $request) { text }
  }
`;

export const generateChallenge = (address: string) => {
  return apolloClient.query({
    query: gql(GET_CHALLENGE),
    variables: {
      request: {
        address,
      },
    },
  });
};

const AUTHENTICATION = `
  mutation($request: SignedAuthChallenge!) { 
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
 }
`;

const authenticate = (address: string, signature: string) => {
  return apolloClient.mutate({
    mutation: gql(AUTHENTICATION),
    variables: {
      request: {
        address,
        signature,
      },
    },
  });
};

export const login = async () => {
  
  let address = null
  if(store.address === null) {
    const accounts:string[] = await provider.send('eth_requestAccounts', [])
          .catch(() => console.log('user rejected request'));
    address = accounts[0]
    console.log('login: address', address)
  }
  else {
    address = store.address
  }

  if (getAuthenticationToken()) {
    console.log('login: already logged in');
    return;
  }

  // we request a challenge from the server
  const challengeResponse = await generateChallenge(address);

  // sign the text with the wallet
  const signature = await getSigner.signMessage(challengeResponse.data.challenge.text);
  store.address = address
  localStorage.setItem('address', address)
  const accessTokens = await authenticate(address, signature);
  prettyJSON('login: result', accessTokens.data);

  setAuthenticationToken(accessTokens.data.authenticate.accessToken);

  getDefaultProfile(address).then((data) => {
    console.log(data.defaultProfile)
    store.defaultProfile = data.defaultProfile
  })
  // store.defaultProfile = defaultProfile
  // console.log(defaultProfile)
  return accessTokens.data
};

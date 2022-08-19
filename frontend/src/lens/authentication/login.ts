import { gql } from '@apollo/client/core';
import { apolloClient } from '../apollo-client';
import { getSigner, provider } from '../ethers.service';
import { prettyJSON } from '../helpers';
import { getAuthenticationToken, setAuthenticationToken, setRefreshToken, getRefreshToken } from '../state';
import { store } from '@/store/store'
import { getDefaultProfile } from '../profile/get-default-profile'
import { getProfiles } from '../profile/get-profiles'
import { verifyToken } from '../authentication/verify'
import { refreshTokens } from '../authentication/refresh'
import { setDefaultProfile } from '../profile/set-default-profile'




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
  console.log('store address:', store.address )
  if(store.address === null) {
    const accounts:string[] = await provider.send('eth_requestAccounts', [])
          .catch(() => console.log('user rejected request'));
    address = accounts[0]
    store.address = address
    localStorage.setItem('address', address)
    console.log('login: address', address)
  }
  else {
    address = store.address
  }

  const authenticationToken = getAuthenticationToken()
  if (authenticationToken) {
    // verify the token
    const verificationResult = await verifyToken(authenticationToken)
    if (verificationResult.verify==true){
      // refresh the token
      const refreshToken = getRefreshToken()
      if (refreshToken){
        console.log('Token refreshed')
        const newAccessTokens = await refreshTokens(refreshToken) // check if this is success?
        setAuthenticationToken(newAccessTokens.refresh.accessToken)
        setRefreshToken(newAccessTokens.refresh.refreshToken)
        if (store.defaultProfile==null) {
          getDefaultProfile(address).then((data) => {
            console.log(data.defaultProfile)
            store.defaultProfile = data.defaultProfile
          })
        }
        
      }
      console.log('login: already logged in');
      return;
    }
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
  // set refresh token
  setRefreshToken(accessTokens.data.authenticate.refreshToken);


  getDefaultProfile(address).then((data) => {
    console.log(data.defaultProfile)
    store.defaultProfile = data.defaultProfile
  })

  // getProfiles(address).then((data)=>{
  //   const profileId = data.profiles.items[0].id
  //   if(profileId) {
  //     setDefaultProfile(profileId)
  //   }
  // })

  // store.defaultProfile = defaultProfile
  // console.log(defaultProfile)
  return accessTokens.data
};

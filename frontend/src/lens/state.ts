/*
  Now if a user refresh, the token will be null. It would be better if token is stored in browser, and get verified to decide if refresh is needed.
*/ 

let authenticationToken: string | null = null;
let refreshToken: string | null = null;

export const setAuthenticationToken = (token: string|null) => {
  authenticationToken = token;
  if (token!=null) {
    localStorage.setItem('authenticationToken', token)
  }
  console.log('setAuthenticationToken: token', token);
};

export const getAuthenticationToken = () => {
  if (authenticationToken===null){
    authenticationToken = localStorage.getItem('authenticationToken')
  }
  return authenticationToken;
};

export const setRefreshToken = (token: string|null) => {
  refreshToken = token;
  if (token!=null) {
    localStorage.setItem('refreshToken', token)
  }
  console.log('setRefreshToken: token', token);
};

export const getRefreshToken = () => {
  if (refreshToken===null){
    refreshToken = localStorage.getItem('refreshToken')
  }
  return refreshToken;
};
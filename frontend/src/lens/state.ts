let authenticationToken: string | null = null;
export const setAuthenticationToken = (token: string|null) => {
  authenticationToken = token;
  console.log('setAuthenticationToken: token', token);
};

export const getAuthenticationToken = () => {
  return authenticationToken;
};

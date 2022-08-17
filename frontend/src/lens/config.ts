
import fileLensHub from './abis/lens-hub-contract-abi.json';
import fileLensPeriphery from './abis/lens-periphery-data-provider.json';
import fileFollowNFT from './abis/lens-follow-nft-contract-abi.json';

// const getParamOrExit = (name: string) => {
//   const param = process.env[name];
//   if (!param) {
//     console.error(`Required config param '${name}' missing`);
//     process.exit(1);
//   }
//   return param;
// };

// const getParam = (name: string) => {
//   const param = process.env[name];
//   if (!param) {
//     return null;
//   }
//   return param;
// };

export const argsBespokeInit = () => {
  return process.argv.find((c) => c === '--init') !== undefined;
};

// export const PK = getParamOrExit('PK');

// export const MUMBAI_RPC_URL = getParamOrExit('MUMBAI_RPC_URL');

// export const LENS_API = getParamOrExit('LENS_API');
const LENS_API_MAINNET = 'https://api.lens.dev'
const LENS_API_TESTNET = 'https://api-mumbai.lens.dev/'
export const LENS_API = LENS_API_MAINNET

// export const LENS_HUB_CONTRACT = getParamOrExit('LENS_HUB_CONTRACT');
export const LENS_HUB_CONTRACT='0x60Ae865ee4C725cd04353b5AAb364553f56ceF82'

// export const LENS_PERIPHERY_CONTRACT = getParamOrExit('LENS_PERIPHERY_CONTRACT');
export const LENS_PERIPHERY_CONTRACT='0xD5037d72877808cdE7F669563e9389930AF404E8'

export const LENS_PERIPHERY_NAME = 'LensPeriphery';

// export const PROFILE_ID = getParam('PROFILE_ID'); // get profile_id from store

export const LENS_FOLLOW_NFT_ABI = fileFollowNFT

export const LENS_HUB_ABI = fileLensHub

export const LENS_PERIPHERY_ABI = fileLensPeriphery

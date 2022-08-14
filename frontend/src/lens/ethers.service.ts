import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer';
import { ethers, utils } from 'ethers';
// import { MUMBAI_RPC_URL, PK } from './config';
import { omit } from './helpers';
import { store } from '../store/store'


// @ts-ignore
const { ethereum } = window;
console.log(ethereum)
if (!ethereum) {
  console.log('no wallet detected')
  store.providerAvailability = false
}

// @ts-ignore
export const provider = new ethers.providers.Web3Provider(window.ethereum);

export const getSigner = provider.getSigner();

export const getAddressFromSigner = () => {
  return getSigner.getAddress();
};

export const signedTypeData = (
  domain: TypedDataDomain,
  types: Record<string, TypedDataField[]>,
  value: Record<string, any>
) => {
  // remove the __typedname from the signature!
  return getSigner._signTypedData(
    omit(domain, '__typename'),
    omit(types, '__typename'),
    omit(value, '__typename')
  );
};

export const splitSignature = (signature: string) => {
  return utils.splitSignature(signature);
};

export const sendTx = (
  transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest>
) => {
  return getSigner.sendTransaction(transaction);
};

export const signText = (text: string) => {
  return getSigner.signMessage(text);
};

import { create } from 'ipfs-http-client';
import { Web3Storage } from 'web3.storage'
import { NFTStorage } from 'nft.storage'

export const ipfs_client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});

export const uploadIpfs = async <T>(data: T) => {
  const result = await ipfs_client.add(JSON.stringify(data));

  console.log('upload result ipfs', result);
  return result;
};

// web3.storage
const getWeb3StorageAccessToken = ()=>{
  return process.env.VUE_APP_Web3STORAGEAPIKEY
}
// @ts-ignore
export const web3_client = ()=>{ return new Web3Storage({token:getWeb3StorageAccessToken()}) }

// NFT Storage
const getNFTStorageAccessToken = ()=>{
  return process.env.VUE_APP_NFTSTORAGEAPIKEY
}
// @ts-ignore
export const nft_storage_client = new NFTStorage({ token: getNFTStorageAccessToken() })
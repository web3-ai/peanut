import { create } from 'ipfs-http-client';
import { Web3Storage } from 'web3.storage'

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
const getAccessToken = ()=>{
  return process.env.VUE_APP_Web3APIKEY
}
// @ts-ignore
export const web3_client = ()=>{ return new Web3Storage({token:getAccessToken()}) }
import { Provider, setMulticallAddress } from 'ethers-multicall';
import { ethers } from 'ethers';
import { MULTICALL } from './constants';

export const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '1');

export const provider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_RPC_URL,
  { name: 'Unknown', chainId }
);

setMulticallAddress(chainId, MULTICALL);
export const ethcallProvider = new Provider(provider, chainId);

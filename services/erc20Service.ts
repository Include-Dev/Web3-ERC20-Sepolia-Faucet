
import { BrowserProvider, Contract, TransactionResponse, parseUnits } from 'ethers';
import { ERC20_ABI } from '../constants';

export const sendToken = async (
  provider: BrowserProvider,
  tokenAddress: string,
  recipientAddress: string,
  amount: string
): Promise<TransactionResponse> => {
  if (!provider) {
    throw new Error('Provider is not initialized');
  }

  const signer = await provider.getSigner();
  const tokenContract = new Contract(tokenAddress, ERC20_ABI, signer);

  const decimals = await tokenContract.decimals();
  const amountToSend = parseUnits(amount, decimals);

  const tx = await tokenContract.transfer(recipientAddress, amountToSend);
  return tx;
};

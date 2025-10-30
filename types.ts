// Fix: Add a global declaration for `window.ethereum` to inform TypeScript about the provider injected by wallet extensions like MetaMask.
declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface Wallet {
  address: string | null;
  chainId: string | null;
  isConnected: boolean;
}

export enum Status {
  Idle = 'IDLE',
  Loading = 'LOADING',
  Success = 'SUCCESS',
  Error = 'ERROR',
}

export interface TransactionState {
  status: Status;
  message: string;
  txHash?: string | null;
}

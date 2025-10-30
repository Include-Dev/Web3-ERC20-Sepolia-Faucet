
import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider } from 'ethers';
import { Wallet } from '../types';
import { SEPOLIA_CHAIN_ID } from '../constants';

const INITIAL_WALLET_STATE: Wallet = {
  address: null,
  chainId: null,
  isConnected: false,
};

export const useWallet = () => {
  const [wallet, setWallet] = useState<Wallet>(INITIAL_WALLET_STATE);
  const [error, setError] = useState<string | null>(null);
  const [isProviderAvailable, setIsProviderAvailable] = useState(false);
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    let detectionInterval: number;
    let detectionTimeout: number;

    const pollForProvider = () => {
      console.log('Polling for wallet provider...');
      console.log('window.ethereum:', window.ethereum);

      try {
        if (window.parent && window.parent.ethereum) {
          console.log('Found ethereum provider on window.parent! The app is likely in an iframe.');
        }
      } catch (e) {
        console.warn('Could not access window.parent.ethereum due to security restrictions.', e);
      }

      if (typeof window !== 'undefined' && window.ethereum) {
        console.log('Wallet provider found!');
        setIsProviderAvailable(true);
        setIsDetecting(false);
        clearInterval(detectionInterval);
        clearTimeout(detectionTimeout);
        // Once found, we can proceed with other logic
        getWalletInfo(); 
      }
    };
    
    // Poll every 500ms
    detectionInterval = window.setInterval(pollForProvider, 500);

    // Stop polling after 3 seconds
    detectionTimeout = window.setTimeout(() => {
      console.log('Finished polling for wallet provider.');
      setIsDetecting(false);
      clearInterval(detectionInterval);
      if (!window.ethereum) {
         setIsProviderAvailable(false);
      }
    }, 3000);

    return () => {
      clearInterval(detectionInterval);
      clearTimeout(detectionTimeout);
    };
  }, []);

  const resetWallet = useCallback(() => {
    setWallet(INITIAL_WALLET_STATE);
  }, []);

  const getWalletInfo = useCallback(async () => {
    if (!window.ethereum) return;
    try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
            const network = await provider.getNetwork();
            const address = accounts[0].address;
            const chainId = `0x${network.chainId.toString(16)}`;
            setWallet({ address, chainId, isConnected: true });
        } else {
            resetWallet();
        }
    } catch (e) {
        console.error("Could not get wallet info", e);
        resetWallet();
    }
  }, [resetWallet]);

  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      console.log('Please connect to MetaMask.');
      resetWallet();
    } else {
      getWalletInfo();
    }
  }, [getWalletInfo, resetWallet]);

  const handleChainChanged = useCallback(() => {
      getWalletInfo();
  }, [getWalletInfo]);

  useEffect(() => {
    if (isProviderAvailable && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [isProviderAvailable, handleAccountsChanged, handleChainChanged, getWalletInfo]);

  const connectWallet = async () => {
    if (!isProviderAvailable || !window.ethereum) {
      setError('MetaMask is not installed or available. Please install it to use this app.');
      return;
    }
    setError(null);

    try {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      await getWalletInfo();
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      if (err.code === 4001) {
          setError('Connection request rejected by user.');
      } else {
          setError('Failed to connect wallet. Please try again.');
      }
      resetWallet();
    }
  };

  return { wallet, connectWallet, error, isProviderAvailable, isDetecting };
};


import React, { useState, useCallback } from 'react';
import { isAddress, BrowserProvider } from 'ethers';
import { useWallet } from './hooks/useWallet';
import { sendToken } from './services/erc20Service';
import { SEPOLIA_CHAIN_ID, SEPOLIA_CHAIN_NAME } from './constants';
import { Status, TransactionState } from './types';
import ConnectWalletButton from './components/ConnectWalletButton';
import TransactionStatusDisplay from './components/TransactionStatusDisplay';
import Header from './components/Header';
import SenderForm from './components/SenderForm';

const App: React.FC = () => {
  const { wallet, connectWallet, error: walletError, isProviderAvailable, isDetecting } = useWallet();
  const [transactionState, setTransactionState] = useState<TransactionState>({
    status: Status.Idle,
    message: '',
    txHash: null,
  });

  const handleSend = useCallback(async (tokenAddress: string, recipientAddress: string, amount: string) => {
    if (!wallet.address || wallet.chainId !== SEPOLIA_CHAIN_ID) {
      setTransactionState({ status: Status.Error, message: 'Please connect to the Sepolia network first.' });
      return;
    }

    if (!isAddress(tokenAddress) || !isAddress(recipientAddress)) {
      setTransactionState({ status: Status.Error, message: 'Invalid token or recipient address.' });
      return;
    }

    try {
      setTransactionState({ status: Status.Loading, message: 'Preparing transaction...' });
      const provider = new BrowserProvider(window.ethereum);
      
      setTransactionState({ status: Status.Loading, message: 'Please confirm the transaction in your wallet.' });
      
      const tx = await sendToken(provider, tokenAddress, recipientAddress, amount);
      setTransactionState({ status: Status.Loading, message: `Transaction sent! Waiting for confirmation...`, txHash: tx.hash });

      await tx.wait();
      setTransactionState({ status: Status.Success, message: 'Transaction successfully confirmed!', txHash: tx.hash });

    } catch (err: any) {
      console.error(err);
      let errorMessage = 'An unknown error occurred.';
      if (err.code === 'ACTION_REJECTED') {
          errorMessage = 'Transaction rejected by user.';
      } else if (err.reason) {
          errorMessage = `Transaction failed: ${err.reason}`;
      } else if (err.message) {
          errorMessage = err.message;
      }
      setTransactionState({ status: Status.Error, message: errorMessage, txHash: err?.transactionHash });
    }
  }, [wallet.address, wallet.chainId]);


  const isWalletConnected = wallet.isConnected && wallet.address;
  const isCorrectNetwork = wallet.chainId === SEPOLIA_CHAIN_ID;
  
  const openInNewTab = () => {
    window.open(window.location.href, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text font-sans flex flex-col items-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <Header />
        <main className="mt-8">
          <div className="bg-dark-card shadow-2xl rounded-2xl p-6 sm:p-8">
            {!isWalletConnected ? (
              <div className="text-center">
                {isDetecting ? (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-2">Detecting Wallet...</h2>
                    <p className="text-dark-text-secondary mb-6">Please wait while we check for a browser wallet.</p>
                     <div className="flex justify-center items-center h-12">
                        <svg className="animate-spin h-8 w-8 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                  </>
                ) : isProviderAvailable ? (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
                    <p className="text-dark-text-secondary mb-6">
                      Connect your wallet to start sending ERC20 tokens on the {SEPOLIA_CHAIN_NAME} network.
                    </p>
                    <ConnectWalletButton onClick={connectWallet} />
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-2">Wallet Not Detected</h2>
                    <div className="text-left bg-dark-bg border border-dark-border rounded-lg p-4 my-4 space-y-2 text-dark-text-secondary">
                        <p>This app may be running in an environment (like an iframe) that blocks wallet extensions.</p>
                        <p className="font-semibold text-dark-text">For the best experience, please open this app in a new browser tab.</p>
                    </div>
                    <button 
                        onClick={openInNewTab}
                        className="w-full mb-4 inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-brand-secondary rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary focus:ring-offset-dark-card"
                    >
                      Open in New Tab
                    </button>
                    <p className="text-dark-text-secondary text-sm">Alternatively, if you don't have a wallet, you can install one.</p>
                    <a 
                      href="https://metamask.io/download/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-block mt-2 text-brand-light hover:underline"
                    >
                      Install MetaMask
                    </a>
                  </>
                )}

                {walletError && <p className="text-red-400 mt-4">{walletError}</p>}
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-dark-border">
                   <h2 className="text-xl font-bold text-white">Send ERC20 Token</h2>
                  <div className="text-right">
                    <p className="text-sm text-dark-text-secondary">Connected as</p>
                    <p className="text-sm font-mono text-brand-light truncate">{wallet.address}</p>
                  </div>
                </div>

                {!isCorrectNetwork ? (
                  <div className="text-center p-4 bg-yellow-900/50 border border-yellow-700 rounded-lg">
                    <p className="font-semibold text-yellow-300">Wrong Network</p>
                    <p className="text-yellow-400">Please switch your wallet to the {SEPOLIA_CHAIN_NAME} testnet.</p>
                  </div>
                ) : (
                  <SenderForm
                    isLoading={transactionState.status === Status.Loading}
                    onSend={handleSend}
                  />
                )}
              </div>
            )}
            <TransactionStatusDisplay {...transactionState} />
          </div>
        </main>
         <footer className="text-center mt-8 text-dark-text-secondary text-sm">
            <p>&copy; {new Date().getFullYear()} Web3 ERC20 Sender. For educational purposes on Sepolia Testnet.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;

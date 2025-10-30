
import React from 'react';

interface ConnectWalletButtonProps {
  onClick: () => void;
}

const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-brand-primary rounded-lg hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary focus:ring-offset-dark-card"
    >
      Connect Wallet
    </button>
  );
};

export default ConnectWalletButton;

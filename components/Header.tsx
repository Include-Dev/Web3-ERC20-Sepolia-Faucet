
import React from 'react';

const EthIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-light" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <path d="M12 5.5l-4.24 7.34 4.24 2.44 4.24-2.44L12 5.5zM12 17.5l4.24-2.44L12 12.62 7.76 15.06 12 17.5z"/>
    </svg>
);


const Header: React.FC = () => {
  return (
    <header className="flex flex-col items-center text-center">
        <div className="flex items-center gap-3 mb-2">
            <EthIcon />
            <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-light">
                ERC20 Token Sender
            </h1>
        </div>
        <p className="text-lg text-dark-text-secondary">Send tokens on the Sepolia testnet with ease.</p>
    </header>
  );
};

export default Header;

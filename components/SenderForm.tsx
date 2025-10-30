
import React, { useState } from 'react';

interface SenderFormProps {
    isLoading: boolean;
    onSend: (tokenAddress: string, recipientAddress: string, amount: string) => void;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-dark-text-secondary mb-2">
            {label}
        </label>
        <input
            id={id}
            className="w-full px-4 py-2 text-dark-text bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary transition duration-200"
            {...props}
        />
    </div>
);


const SenderForm: React.FC<SenderFormProps> = ({ isLoading, onSend }) => {
    const [tokenAddress, setTokenAddress] = useState('');
    const [recipientAddress, setRecipientAddress] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSend(tokenAddress, recipientAddress, amount);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
                label="ERC20 Token Address"
                id="token-address"
                type="text"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                placeholder="0x..."
                required
                disabled={isLoading}
            />
            <InputField
                label="Recipient Address"
                id="recipient-address"
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="0x..."
                required
                disabled={isLoading}
            />
            <InputField
                label="Amount"
                id="amount"
                type="text" // Using text to allow for decimals
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 10.5"
                required
                disabled={isLoading}
                pattern="^[0-9]*\.?[0-9]+$"
            />
            <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 font-semibold text-white transition-all duration-300 bg-brand-primary rounded-lg hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary focus:ring-offset-dark-card disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </>
                ) : 'Send Token'}
            </button>
        </form>
    );
};

export default SenderForm;


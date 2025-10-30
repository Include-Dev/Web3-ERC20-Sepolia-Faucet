
import React from 'react';
import { Status, TransactionState } from '../types';

const TransactionStatusDisplay: React.FC<TransactionState> = ({ status, message, txHash }) => {
  if (status === Status.Idle) {
    return null;
  }

  const baseClasses = "mt-6 p-4 rounded-lg text-sm";
  const statusConfig = {
    [Status.Loading]: {
      bgColor: "bg-blue-900/50",
      borderColor: "border-blue-700",
      textColor: "text-blue-300",
      title: "Processing..."
    },
    [Status.Success]: {
      bgColor: "bg-green-900/50",
      borderColor: "border-green-700",
      textColor: "text-green-300",
      title: "Success!"
    },
    [Status.Error]: {
      bgColor: "bg-red-900/50",
      borderColor: "border-red-700",
      textColor: "text-red-300",
      title: "Error"
    },
    [Status.Idle]: {
      bgColor: "",
      borderColor: "",
      textColor: "",
      title: ""
    }
  };

  const config = statusConfig[status];

  return (
    <div className={`${baseClasses} ${config.bgColor} border ${config.borderColor} ${config.textColor}`}>
      <p className="font-bold mb-1">{config.title}</p>
      <p className="break-words">{message}</p>
      {txHash && (
        <a
          href={`https://sepolia.etherscan.io/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-brand-light hover:text-white underline font-mono text-xs break-all"
        >
          View on Etherscan: {txHash}
        </a>
      )}
    </div>
  );
};

export default TransactionStatusDisplay;

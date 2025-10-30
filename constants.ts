
export const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in decimal
export const SEPOLIA_CHAIN_NAME = 'Sepolia';

export const ERC20_ABI = [
  // Read-Only Functions
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",

  // Authenticated Functions
  "function transfer(address to, uint256 amount) returns (bool)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint256 amount)"
];

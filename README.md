# CiWallet Core SDK

**CiWallet Core** là một SDK (Software Development Kit) đa blockchain toàn diện cho phép tích hợp ví tiền điện tử vào các ứng dụng web và extension. SDK hỗ trợ nhiều blockchain phổ biến bao gồm Ethereum, Solana, Sui, Aptos, Bitcoin và nhiều mạng khác.

## 🌟 Tính năng chính

- **Đa blockchain**: Hỗ trợ nhiều nền tảng blockchain
  - EVM chains: Ethereum, BSC, Polygon, Avalanche, Arbitrum, Base, Fantom, Monad, Plasma (Plume Network)
  - Solana
  - Sui
  - Aptos
  - Bitcoin
  - Hyperliquid

- **Quản lý ví**: 
  - Tạo ví từ mnemonic phrase (BIP39)
  - Import ví từ private key
  - Hỗ trợ HD wallet (Hierarchical Deterministic)
  
- **Giao dịch**: 
  - Chuyển token native và token chuẩn
  - Kiểm tra số dư
  - Lịch sử giao dịch
  
- **DEX Aggregation**:
  - Jupiter (Solana)
  - LiFi (Multi-chain)
  - Cetus (Sui)
  
- **Tích hợp giá cả**: 
  - Pyth Network integration cho dữ liệu giá real-time
  
- **Storage**: 
  - IndexedDB integration với Dexie
  - Redux persist hỗ trợ web extension
  
- **React Integration**:
  - Custom hooks cho wallet operations
  - React providers cho state management
  - UI components với Tailwind CSS và Radix UI

## 📦 Cài đặt

```bash
npm install @ciwallet-sdk/core
```

## 🚀 Sử dụng cơ bản

```typescript
import { EvmWallet, SolanaWallet } from '@ciwallet-sdk/core';

// Tạo ví EVM từ mnemonic
const evmWallet = new EvmWallet();
const wallet = evmWallet.fromMnemonic('your mnemonic phrase here');
console.log(wallet.accountAddress); // Địa chỉ ví EVM

// Tạo ví Solana
const solanaWallet = new SolanaWallet();
const solWallet = solanaWallet.fromMnemonic('your mnemonic phrase here');
console.log(solWallet.accountAddress); // Địa chỉ ví Solana
```

## 🏗️ Cấu trúc dự án

```
packages/
├── classes/         # Core wallet classes và aggregators
├── providers/       # React providers (Storage, Transaction, WalletKit)
├── hooks/          # React hooks (useBalance, useTransfer, etc.)
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── constants/      # Chain metadata và constants
└── pyth/           # Pyth Network integration
```

## 🛠️ Development

```bash
# Development mode
npm run dev

# Build library
npm run build:lib

# Build for extension
npm run build:extension

# Lint code
npm run lint
```

## 📝 Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tools**: Vite, Webpack
- **Blockchain SDKs**: 
  - ethers.js (EVM chains)
  - @solana/web3.js (Solana)
  - @mysten/sui (Sui)
  - @aptos-labs/ts-sdk (Aptos)
  - bitcoinjs-lib / tiny-secp256k1 (Bitcoin)
- **State Management**: Redux Toolkit với Redux Persist
- **UI**: Radix UI + Tailwind CSS
- **Database**: Dexie (IndexedDB wrapper)

## 🔐 Security

- Hỗ trợ mnemonic encryption
- Private key management
- Secure storage với IndexedDB
- BIP39/BIP32 compliant

## 📄 License

MIT License - Copyright (c) CiWallet Team

---

## Developer Notes

This project uses React + TypeScript + Vite for development.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

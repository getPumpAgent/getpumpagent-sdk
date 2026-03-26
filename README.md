# getpumpagent

The PumpFun Trading SDK — swap execution, token data, and MCP server in one package.

## Install

```bash
npm install getpumpagent
```

## Quick Start

```typescript
import { PumpAgent } from "getpumpagent";

const agent = new PumpAgent({
  apiKey: "your-api-key", // optional
});

// Fetch newest token launches
const { tokens } = await agent.tokens.new();
console.log(tokens);

// Get a specific token
const token = await agent.tokens.get("So11111111111111111111111111111111111111112");

// Trending tokens
const trending = await agent.tokens.trending();

// Token risk analysis
const risk = await agent.tokens.risk("TOKEN_MINT_ADDRESS");

// KOL activity feed
const activity = await agent.kol.activity();

// Build a swap transaction (returns serialized tx, never executes)
const swap = await agent.swap({
  inputMint: "So11111111111111111111111111111111111111112",
  outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  amount: 100_000_000, // lamports
  slippage: "auto",
  userWallet: "YOUR_WALLET_PUBLIC_KEY",
});

console.log(swap.transaction); // base64 serialized transaction
console.log(swap.platformFee); // { bps, percent, referralAccount }
```

## Custom Base URL

```typescript
const agent = new PumpAgent({
  baseUrl: "http://localhost:3000",
});
```

## Birdeye Integration

```typescript
const agent = new PumpAgent({
  birdeyeKey: "your-birdeye-key",
});
```

export interface PumpAgentConfig {
  apiKey?: string;
  baseUrl?: string;
  birdeyeKey?: string;
}

export interface SwapParams {
  inputMint: string;
  outputMint: string;
  amount: number;
  slippage?: number | "auto";
  pool?: "pump" | "pumpswap" | "auto";
  userWallet: string;
  jito?: boolean;
}

export interface PlatformFee {
  bps: number;
  percent: string;
  referralAccount: string;
}

export interface SwapResponse {
  transaction: string;
  requestId: string | null;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string | null;
  otherAmountThreshold: string | null;
  slippageBps: number | "auto";
  platformFee: PlatformFee;
  jito: boolean;
  pool: string;
}

export interface TokenInfo {
  mint: string;
  name: string | null;
  symbol: string | null;
  uri: string | null;
  image: string | null;
  createdAt: string | null;
}

export interface TokenListResponse {
  tokens: TokenInfo[];
}

export interface TokenRiskResponse {
  mint: string;
  risk: Record<string, unknown>;
}

export interface KolActivity {
  activity: Record<string, unknown>[];
}

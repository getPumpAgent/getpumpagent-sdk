export interface PumpAgentConfig {
  apiKey?: string;
  baseUrl?: string;
  birdeyeKey?: string;
}

// ── Swap ────────────────────────────────────────────────────────────────

export interface SwapParams {
  inputMint: string;
  outputMint: string;
  amount: number;
  slippage?: number | "auto";
  pool?: "pump" | "pumpswap" | "auto";
  userWallet: string;
  jito?: boolean;
  priorityLevel?: "low" | "medium" | "high" | "turbo";
  jitoTipLamports?: number;
  receiver?: string;
  useV1?: boolean;
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
  jitoTipLamports: number;
  senderEndpoint: string;
  pool: string;
  priorityLevel: string;
  retryCount: number;
  simulationPassed: boolean;
  apiVersion: "v1" | "v2";
  mode?: string;
  router?: string | null;
}

export interface SwapExecuteParams {
  transaction: string;
  requestId?: string;
}

export interface SwapExecuteResponse {
  signature: string | null;
  status: string;
  method: string;
  details?: Record<string, unknown>;
}

export interface SwapSendParams {
  transaction: string;
}

export interface SwapSendResponse {
  signature: string;
  method: "helius_sender" | "rpc_fallback";
  endpoint?: string;
}

export interface SwapStatusResponse {
  signature: string;
  status: "confirmed" | "pending" | "failed" | "not_found";
  slot: number | null;
  err: unknown;
}

// ── Tokens ──────────────────────────────────────────────────────────────

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
  risk: RiskScore;
}

export interface TokenDetail {
  mint: string;
  name: string | null;
  symbol: string | null;
  image: string | null;
  uri: string | null;
  createdAt: string | null;
  price: number | null;
  volume24h: number | null;
  liquidity: number | null;
  priceChange24h: number | null;
  fdv: number | null;
  risk: RiskScore;
  kolSignal: { score: number; eliteCount: number; profitableCount: number };
}

export interface RiskScore {
  score: number;
  flags: string[];
  tier: "safe" | "moderate" | "risky" | "dangerous";
}

export interface OHLCVCandle {
  mint: string;
  interval: string;
  candles: Record<string, unknown>[];
}

export interface HolderData {
  mint: string;
  holders: {
    address: string;
    amount: number;
    percentage: number;
  }[];
  concentration: {
    top1: number;
    top5: number;
    top10: number;
  };
}

// ── KOL ─────────────────────────────────────────────────────────────────

export interface KolActivity {
  activity: Record<string, unknown>[];
}

export interface KolWallet {
  address: string;
  label: string;
  winRate: number;
  volumeSol: number;
  tier: "elite" | "profitable" | null;
}

// ── Market ──────────────────────────────────────────────────────────────

export interface MarketStats {
  sentiment: "bullish" | "bearish" | "neutral";
  modifier: number;
  confidence: number;
  topGaining: Record<string, unknown>[];
  mostActive: Record<string, unknown>[];
}

// ── Narratives ──────────────────────────────────────────────────────────

export interface Narrative {
  narrative: string;
  count: number;
}

// ── Trigger Orders (Limit / Stop-Loss / TP-SL / OCO / OTOCO) ───────────

export interface TriggerChallengeParams {
  walletPubkey: string;
  type?: "message" | "transaction";
}

export interface TriggerChallengeResponse {
  type: "message" | "transaction";
  challenge?: string;
  transaction?: string;
}

export interface TriggerVerifyParams {
  walletPubkey: string;
  type: "message" | "transaction";
  signature?: string;
  signedTransaction?: string;
}

export interface TriggerVerifyResponse {
  token: string;
}

export interface TriggerVaultResponse {
  userPubkey: string;
  vaultPubkey: string;
  privyVaultId: string;
}

export interface TriggerDepositParams {
  jwt: string;
  inputMint: string;
  outputMint: string;
  userAddress: string;
  amount: string;
}

export interface TriggerDepositResponse {
  transaction: string;
  requestId: string;
  receiverAddress: string;
  mint: string;
  amount: string;
  tokenDecimals: number;
}

export interface TriggerCreateOrderParams {
  jwt: string;
  orderType: "single" | "oco" | "otoco";
  depositRequestId: string;
  depositSignedTx: string;
  userPubkey: string;
  inputMint: string;
  inputAmount: string;
  outputMint: string;
  triggerMint: string;
  expiresAt: number;
  // Single
  triggerCondition?: "above" | "below";
  triggerPriceUsd?: number;
  slippageBps?: number;
  // OCO
  tpPriceUsd?: number;
  slPriceUsd?: number;
  tpSlippageBps?: number;
  slSlippageBps?: number;
}

export interface TriggerOrderResponse {
  id: string;
  txSignature?: string;
}

export interface TriggerUpdateOrderParams {
  jwt: string;
  orderType: "single" | "oco" | "otoco";
  triggerPriceUsd?: number;
  slippageBps?: number;
  tpPriceUsd?: number;
  slPriceUsd?: number;
  tpSlippageBps?: number;
  slSlippageBps?: number;
}

export interface TriggerCancelResponse {
  id: string;
  transaction: string;
  requestId: string;
}

export interface TriggerConfirmCancelParams {
  jwt: string;
  signedTransaction: string;
  cancelRequestId: string;
}

export interface TriggerOrderHistoryParams {
  jwt: string;
  state?: "active" | "past";
  mint?: string;
  limit?: number;
  offset?: number;
  sort?: "updated_at" | "created_at" | "expires_at";
  dir?: "asc" | "desc";
}

export interface TriggerOrderHistoryResponse {
  orders: Record<string, unknown>[];
  pagination: { total: number; limit: number; offset: number };
}

// ── DCA (Recurring Orders) ──────────────────────────────────────────────

export interface DcaCreateParams {
  user: string;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  numberOfOrders: number;
  interval: number;
  minPrice?: number;
  maxPrice?: number;
  startAt?: number | null;
}

export interface DcaCreateResponse {
  transaction: string;
  requestId: string;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  numberOfOrders: number;
  interval: number;
  perCycleAmount: string;
  totalDurationSeconds: number;
}

export interface DcaExecuteParams {
  signedTransaction: string;
  requestId: string;
}

export interface DcaCancelParams {
  order: string;
  user: string;
  recurringType?: string;
}

export interface DcaCancelResponse {
  transaction: string;
  requestId: string;
  order: string;
}

export interface DcaOrdersParams {
  user: string;
  orderStatus?: "active" | "history";
  recurringType?: string;
  page?: string;
  inputMint?: string;
  outputMint?: string;
  includeFailedTx?: string;
}

// ── Lend (Jupiter Earn) ─────────────────────────────────────────────────

export interface LendToken {
  id: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  assetAddress: string;
  asset: Record<string, unknown>;
  totalAssets: string;
  totalSupply: string;
  convertToShares: string;
  convertToAssets: string;
  rewardsRate: string;
  supplyRate: string;
  totalRate: string;
}

export interface LendActionParams {
  asset: string;
  signer: string;
  amount: string;
}

export interface LendActionResponse {
  transaction: string;
  asset: string;
  signer: string;
  amount: string;
  action: "deposit" | "withdraw";
}

export interface LendSendParams {
  signedTransaction: string;
}

export interface LendSendResponse {
  signature: string;
  method: string;
}

// ── Jupiter Data (Price, Tokens, Portfolio) ─────────────────────────────

export interface JupiterPrice {
  id: string;
  type: string;
  price: string;
  confidenceLevel?: "high" | "medium" | "low";
  ema?: string;
}

export interface JupiterPriceResponse {
  data: Record<string, JupiterPrice | null>;
  timeTaken: number;
}

export interface JupiterToken {
  mint: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  audit?: { isSus: boolean };
  organicScore?: number;
  website?: string;
  twitter?: string;
}

export type JupiterTokenCategory = "toporganicscore" | "toptraded" | "toptrending";
export type JupiterTokenInterval = "5m" | "1h" | "6h" | "24h";

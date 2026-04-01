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
    priorityLevel?: "low" | "medium" | "high" | "very-high";
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
    jitoEnabled: boolean;
    tipLamports: number;
    senderEndpoint: string;
    pool: string;
    priorityLevel: string;
    retryCount: number;
    simulationPassed: boolean;
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
    risk: RiskScore;
}
export interface KolActivity {
    activity: Record<string, unknown>[];
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
    kolSignal: {
        score: number;
        eliteCount: number;
        profitableCount: number;
    };
}
export interface RiskScore {
    score: number;
    flags: string[];
    tier: "safe" | "moderate" | "risky" | "dangerous";
}
export interface KolWallet {
    address: string;
    label: string;
    winRate: number;
    volumeSol: number;
    tier: "elite" | "profitable" | null;
}
export interface MarketStats {
    sentiment: "bullish" | "bearish" | "neutral";
    modifier: number;
    confidence: number;
    topGaining: Record<string, unknown>[];
    mostActive: Record<string, unknown>[];
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
export interface Narrative {
    narrative: string;
    count: number;
}
//# sourceMappingURL=types.d.ts.map
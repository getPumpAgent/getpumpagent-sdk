import type { PumpAgentConfig, SwapParams, SwapResponse, TokenListResponse, TokenRiskResponse, TokenDetail, KolActivity, KolWallet, MarketStats, OHLCVCandle, HolderData, Narrative } from "./types.js";
export declare class PumpAgent {
    private http;
    tokens: {
        new: () => Promise<TokenListResponse>;
        get: (address: string) => Promise<TokenDetail>;
        trending: () => Promise<TokenListResponse>;
        graduating: () => Promise<TokenListResponse>;
        boosted: () => Promise<{
            tokens: Record<string, unknown>[];
        }>;
        search: (query: string) => Promise<{
            pairs: Record<string, unknown>[];
        }>;
        risk: (address: string) => Promise<TokenRiskResponse>;
        ohlcv: (address: string, interval?: string) => Promise<OHLCVCandle>;
        holders: (address: string) => Promise<HolderData>;
        txns: (address: string) => Promise<{
            mint: string;
            transactions: Record<string, unknown>[];
        }>;
    };
    kol: {
        activity: () => Promise<KolActivity>;
        leaderboard: () => Promise<{
            leaderboard: KolWallet[];
        }>;
        trades: (wallet: string) => Promise<{
            wallet: string;
            trades: Record<string, unknown>[];
        }>;
    };
    market: {
        stats: () => Promise<MarketStats>;
    };
    narratives: {
        trending: () => Promise<{
            narratives: Narrative[];
            tokensSampled: number;
        }>;
    };
    constructor(config?: PumpAgentConfig);
    swap(params: SwapParams): Promise<SwapResponse>;
    private get;
    private post;
}
//# sourceMappingURL=client.d.ts.map
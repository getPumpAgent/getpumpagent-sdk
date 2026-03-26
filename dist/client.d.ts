import type { PumpAgentConfig, SwapParams, SwapResponse, TokenInfo, TokenListResponse, TokenRiskResponse, KolActivity } from "./types.js";
export declare class PumpAgent {
    private http;
    tokens: {
        new: () => Promise<TokenListResponse>;
        get: (address: string) => Promise<TokenInfo>;
        trending: () => Promise<TokenListResponse>;
        risk: (address: string) => Promise<TokenRiskResponse>;
    };
    kol: {
        activity: () => Promise<KolActivity>;
    };
    constructor(config?: PumpAgentConfig);
    swap(params: SwapParams): Promise<SwapResponse>;
    private get;
    private post;
}
//# sourceMappingURL=client.d.ts.map
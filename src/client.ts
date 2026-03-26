import axios, { AxiosInstance } from "axios";
import type {
  PumpAgentConfig,
  SwapParams,
  SwapResponse,
  TokenInfo,
  TokenListResponse,
  TokenRiskResponse,
  TokenDetail,
  KolActivity,
  KolWallet,
  MarketStats,
  OHLCVCandle,
  HolderData,
  Narrative,
} from "./types.js";

const DEFAULT_BASE_URL = "https://api.pumpapi.markets";

export class PumpAgent {
  private http: AxiosInstance;

  public tokens: {
    new: () => Promise<TokenListResponse>;
    get: (address: string) => Promise<TokenDetail>;
    trending: () => Promise<TokenListResponse>;
    graduating: () => Promise<TokenListResponse>;
    boosted: () => Promise<{ tokens: Record<string, unknown>[] }>;
    search: (query: string) => Promise<{ pairs: Record<string, unknown>[] }>;
    risk: (address: string) => Promise<TokenRiskResponse>;
    ohlcv: (address: string, interval?: string) => Promise<OHLCVCandle>;
    holders: (address: string) => Promise<HolderData>;
    txns: (address: string) => Promise<{ mint: string; transactions: Record<string, unknown>[] }>;
  };

  public kol: {
    activity: () => Promise<KolActivity>;
    leaderboard: () => Promise<{ leaderboard: KolWallet[] }>;
    trades: (wallet: string) => Promise<{ wallet: string; trades: Record<string, unknown>[] }>;
  };

  public market: {
    stats: () => Promise<MarketStats>;
  };

  public narratives: {
    trending: () => Promise<{ narratives: Narrative[]; tokensSampled: number }>;
  };

  constructor(config: PumpAgentConfig = {}) {
    const baseURL = config.baseUrl ?? DEFAULT_BASE_URL;

    const headers: Record<string, string> = {};
    if (config.apiKey) headers["x-api-key"] = config.apiKey;
    if (config.birdeyeKey) headers["x-birdeye-key"] = config.birdeyeKey;

    this.http = axios.create({ baseURL, headers });

    this.tokens = {
      new: () => this.get<TokenListResponse>("/v1/tokens/new"),
      get: (address: string) => this.get<TokenDetail>(`/v1/tokens/${address}`),
      trending: () => this.get<TokenListResponse>("/v1/tokens/trending"),
      graduating: () => this.get<TokenListResponse>("/v1/tokens/graduating"),
      boosted: () => this.get<{ tokens: Record<string, unknown>[] }>("/v1/tokens/boosted"),
      search: (query: string) =>
        this.get<{ pairs: Record<string, unknown>[] }>(`/v1/tokens/search?q=${encodeURIComponent(query)}`),
      risk: (address: string) =>
        this.get<TokenRiskResponse>(`/v1/tokens/${address}/risk`),
      ohlcv: (address: string, interval?: string) =>
        this.get<OHLCVCandle>(`/v1/tokens/${address}/ohlcv${interval ? `?interval=${interval}` : ""}`),
      holders: (address: string) =>
        this.get<HolderData>(`/v1/tokens/${address}/holders`),
      txns: (address: string) =>
        this.get<{ mint: string; transactions: Record<string, unknown>[] }>(`/v1/tokens/${address}/txns`),
    };

    this.kol = {
      activity: () => this.get<KolActivity>("/v1/kol/activity"),
      leaderboard: () => this.get<{ leaderboard: KolWallet[] }>("/v1/kol/leaderboard"),
      trades: (wallet: string) =>
        this.get<{ wallet: string; trades: Record<string, unknown>[] }>(`/v1/kol/${wallet}/trades`),
    };

    this.market = {
      stats: () => this.get<MarketStats>("/v1/market/stats"),
    };

    this.narratives = {
      trending: () =>
        this.get<{ narratives: Narrative[]; tokensSampled: number }>("/v1/narratives/trending"),
    };
  }

  async swap(params: SwapParams): Promise<SwapResponse> {
    return this.post<SwapResponse>("/v1/swap", params);
  }

  private async get<T>(path: string): Promise<T> {
    const { data } = await this.http.get<T>(path);
    return data;
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const { data } = await this.http.post<T>(path, body);
    return data;
  }
}

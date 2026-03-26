import axios, { AxiosInstance } from "axios";
import type {
  PumpAgentConfig,
  SwapParams,
  SwapResponse,
  TokenInfo,
  TokenListResponse,
  TokenRiskResponse,
  KolActivity,
} from "./types.js";

const DEFAULT_BASE_URL = "https://api.pumpapi.markets";

export class PumpAgent {
  private http: AxiosInstance;

  public tokens: {
    new: () => Promise<TokenListResponse>;
    get: (address: string) => Promise<TokenInfo>;
    trending: () => Promise<TokenListResponse>;
    risk: (address: string) => Promise<TokenRiskResponse>;
  };

  public kol: {
    activity: () => Promise<KolActivity>;
  };

  constructor(config: PumpAgentConfig = {}) {
    const baseURL = config.baseUrl ?? DEFAULT_BASE_URL;

    const headers: Record<string, string> = {};
    if (config.apiKey) headers["x-api-key"] = config.apiKey;
    if (config.birdeyeKey) headers["x-birdeye-key"] = config.birdeyeKey;

    this.http = axios.create({ baseURL, headers });

    this.tokens = {
      new: () => this.get<TokenListResponse>("/v1/tokens/new"),
      get: (address: string) => this.get<TokenInfo>(`/v1/tokens/${address}`),
      trending: () => this.get<TokenListResponse>("/v1/tokens/trending"),
      risk: (address: string) =>
        this.get<TokenRiskResponse>(`/v1/tokens/${address}/risk`),
    };

    this.kol = {
      activity: () => this.get<KolActivity>("/v1/kol/activity"),
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

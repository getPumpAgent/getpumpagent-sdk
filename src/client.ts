import axios, { AxiosInstance } from "axios";
import type {
  PumpAgentConfig,
  SwapParams,
  SwapResponse,
  SwapExecuteParams,
  SwapExecuteResponse,
  SwapSendParams,
  SwapSendResponse,
  SwapStatusResponse,
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
  TriggerChallengeParams,
  TriggerChallengeResponse,
  TriggerVerifyParams,
  TriggerVerifyResponse,
  TriggerVaultResponse,
  TriggerDepositParams,
  TriggerDepositResponse,
  TriggerCreateOrderParams,
  TriggerOrderResponse,
  TriggerUpdateOrderParams,
  TriggerCancelResponse,
  TriggerConfirmCancelParams,
  TriggerOrderHistoryParams,
  TriggerOrderHistoryResponse,
  DcaCreateParams,
  DcaCreateResponse,
  DcaExecuteParams,
  DcaCancelParams,
  DcaCancelResponse,
  DcaOrdersParams,
  LendToken,
  LendActionParams,
  LendActionResponse,
  LendSendParams,
  LendSendResponse,
  JupiterPriceResponse,
  JupiterToken,
  JupiterTokenCategory,
  JupiterTokenInterval,
} from "./types.js";

const DEFAULT_BASE_URL = "https://api.pumpapi.markets";

export class PumpAgent {
  private http: AxiosInstance;

  // ── Token discovery ─────────────────────────────────────────────────
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

  // ── KOL tracking ───────────────────────────────────────────────────
  public kol: {
    activity: () => Promise<KolActivity>;
    leaderboard: () => Promise<{ leaderboard: KolWallet[] }>;
    trades: (wallet: string) => Promise<{ wallet: string; trades: Record<string, unknown>[] }>;
  };

  // ── Market intelligence ────────────────────────────────────────────
  public market: {
    stats: () => Promise<MarketStats>;
  };

  // ── Narratives ─────────────────────────────────────────────────────
  public narratives: {
    trending: () => Promise<{ narratives: Narrative[]; tokensSampled: number }>;
  };

  // ── Trigger Orders (Limit / Stop-Loss / TP-SL / OCO / OTOCO) ──────
  public trigger: {
    /** Request a signing challenge for wallet authentication */
    challenge: (params: TriggerChallengeParams) => Promise<TriggerChallengeResponse>;
    /** Submit signed challenge to receive JWT */
    verify: (params: TriggerVerifyParams) => Promise<TriggerVerifyResponse>;
    /** Check if JWT is still valid */
    verifyToken: (walletPubkey: string, jwt: string) => Promise<{ valid: boolean }>;
    /** Get or auto-register vault for wallet */
    vault: (jwt: string) => Promise<TriggerVaultResponse>;
    /** Craft unsigned deposit transaction */
    deposit: (params: TriggerDepositParams) => Promise<TriggerDepositResponse>;
    /** Create a trigger order (single/OCO/OTOCO) */
    createOrder: (params: TriggerCreateOrderParams) => Promise<TriggerOrderResponse>;
    /** Update trigger price / slippage on existing order */
    updateOrder: (orderId: string, params: TriggerUpdateOrderParams) => Promise<TriggerOrderResponse>;
    /** Initiate cancel (step 1 — returns unsigned withdrawal tx) */
    cancelOrder: (orderId: string, jwt: string) => Promise<TriggerCancelResponse>;
    /** Confirm cancel with signed withdrawal tx (step 2) */
    confirmCancel: (orderId: string, params: TriggerConfirmCancelParams) => Promise<TriggerOrderResponse>;
    /** Get order history */
    orders: (params: TriggerOrderHistoryParams) => Promise<TriggerOrderHistoryResponse>;
  };

  // ── DCA (Dollar Cost Averaging) ────────────────────────────────────
  public dca: {
    /** Create a recurring DCA order (returns unsigned tx) */
    create: (params: DcaCreateParams) => Promise<DcaCreateResponse>;
    /** Submit signed DCA transaction */
    execute: (params: DcaExecuteParams) => Promise<Record<string, unknown>>;
    /** Cancel an active DCA order (returns unsigned cancel tx) */
    cancel: (params: DcaCancelParams) => Promise<DcaCancelResponse>;
    /** List active or historical DCA orders */
    orders: (params: DcaOrdersParams) => Promise<Record<string, unknown>>;
  };

  // ── Lend (Jupiter Earn) ────────────────────────────────────────────
  public lend: {
    /** List all earning markets with APY rates */
    tokens: () => Promise<LendToken[]>;
    /** Get lending positions for wallet(s) */
    positions: (users: string) => Promise<Record<string, unknown>[]>;
    /** Build unsigned deposit transaction */
    deposit: (params: LendActionParams) => Promise<LendActionResponse>;
    /** Build unsigned withdraw transaction */
    withdraw: (params: LendActionParams) => Promise<LendActionResponse>;
    /** Submit signed lend transaction */
    send: (params: LendSendParams) => Promise<LendSendResponse>;
  };

  // ── Jupiter Data (Prices, Token Rankings, Portfolio) ───────────────
  public jupiter: {
    /** Get real-time USD prices with confidence levels (max 50 mints) */
    prices: (mints: string[]) => Promise<JupiterPriceResponse>;
    /** Search tokens by mint address */
    tokenSearch: (query: string) => Promise<JupiterToken[]>;
    /** Get tokens by tag (verified, lst) */
    tokensByTag: (tag: string) => Promise<JupiterToken[]>;
    /** Get top/trending tokens by category and interval */
    tokenRankings: (category: JupiterTokenCategory, interval: JupiterTokenInterval) => Promise<JupiterToken[]>;
    /** Get recently created tokens */
    recentTokens: () => Promise<JupiterToken[]>;
    /** Get DeFi portfolio positions for wallet */
    portfolio: (wallet: string, platforms?: string) => Promise<Record<string, unknown>>;
    /** Get staked JUP positions */
    stakedJup: (wallet: string) => Promise<Record<string, unknown>>;
  };

  constructor(config: PumpAgentConfig = {}) {
    const baseURL = config.baseUrl ?? DEFAULT_BASE_URL;

    const headers: Record<string, string> = {};
    if (config.apiKey) headers["x-api-key"] = config.apiKey;
    if (config.birdeyeKey) headers["x-birdeye-key"] = config.birdeyeKey;

    this.http = axios.create({ baseURL, headers });

    // ── Tokens ──────────────────────────────────────────────────────
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

    // ── KOL ─────────────────────────────────────────────────────────
    this.kol = {
      activity: () => this.get<KolActivity>("/v1/kol/activity"),
      leaderboard: () => this.get<{ leaderboard: KolWallet[] }>("/v1/kol/leaderboard"),
      trades: (wallet: string) =>
        this.get<{ wallet: string; trades: Record<string, unknown>[] }>(`/v1/kol/${wallet}/trades`),
    };

    // ── Market ──────────────────────────────────────────────────────
    this.market = {
      stats: () => this.get<MarketStats>("/v1/market/stats"),
    };

    // ── Narratives ──────────────────────────────────────────────────
    this.narratives = {
      trending: () =>
        this.get<{ narratives: Narrative[]; tokensSampled: number }>("/v1/narratives/trending"),
    };

    // ── Trigger Orders ──────────────────────────────────────────────
    this.trigger = {
      challenge: (params) =>
        this.post<TriggerChallengeResponse>("/v1/trigger/auth/challenge", params),

      verify: (params) =>
        this.post<TriggerVerifyResponse>("/v1/trigger/auth/verify", params),

      verifyToken: (walletPubkey, jwt) =>
        this.post<{ valid: boolean }>("/v1/trigger/auth/verify-token", { walletPubkey, jwt }),

      vault: (jwt) =>
        this.get<TriggerVaultResponse>("/v1/trigger/vault", { jwt }),

      deposit: (params) =>
        this.post<TriggerDepositResponse>("/v1/trigger/deposit", params),

      createOrder: (params) =>
        this.post<TriggerOrderResponse>("/v1/trigger/order", params),

      updateOrder: (orderId, params) =>
        this.patch<TriggerOrderResponse>(`/v1/trigger/order/${orderId}`, params),

      cancelOrder: (orderId, jwt) =>
        this.post<TriggerCancelResponse>(`/v1/trigger/order/${orderId}/cancel`, { jwt }),

      confirmCancel: (orderId, params) =>
        this.post<TriggerOrderResponse>(`/v1/trigger/order/${orderId}/confirm-cancel`, params),

      orders: (params) => {
        const { jwt, ...query } = params;
        const qs = new URLSearchParams();
        qs.set("jwt", jwt);
        if (query.state) qs.set("state", query.state);
        if (query.mint) qs.set("mint", query.mint);
        if (query.limit) qs.set("limit", query.limit.toString());
        if (query.offset) qs.set("offset", query.offset.toString());
        if (query.sort) qs.set("sort", query.sort);
        if (query.dir) qs.set("dir", query.dir);
        return this.get<TriggerOrderHistoryResponse>(`/v1/trigger/orders?${qs.toString()}`);
      },
    };

    // ── DCA ─────────────────────────────────────────────────────────
    this.dca = {
      create: (params) =>
        this.post<DcaCreateResponse>("/v1/dca/create", params),

      execute: (params) =>
        this.post<Record<string, unknown>>("/v1/dca/execute", params),

      cancel: (params) =>
        this.post<DcaCancelResponse>("/v1/dca/cancel", params),

      orders: (params) => {
        const qs = new URLSearchParams();
        qs.set("user", params.user);
        if (params.orderStatus) qs.set("orderStatus", params.orderStatus);
        if (params.recurringType) qs.set("recurringType", params.recurringType);
        if (params.page) qs.set("page", params.page);
        if (params.inputMint) qs.set("inputMint", params.inputMint);
        if (params.outputMint) qs.set("outputMint", params.outputMint);
        if (params.includeFailedTx) qs.set("includeFailedTx", params.includeFailedTx);
        return this.get<Record<string, unknown>>(`/v1/dca/orders?${qs.toString()}`);
      },
    };

    // ── Lend ────────────────────────────────────────────────────────
    this.lend = {
      tokens: () => this.get<LendToken[]>("/v1/lend/tokens"),

      positions: (users) =>
        this.get<Record<string, unknown>[]>(`/v1/lend/positions?users=${encodeURIComponent(users)}`),

      deposit: (params) =>
        this.post<LendActionResponse>("/v1/lend/deposit", params),

      withdraw: (params) =>
        this.post<LendActionResponse>("/v1/lend/withdraw", params),

      send: (params) =>
        this.post<LendSendResponse>("/v1/lend/send", params),
    };

    // ── Jupiter Data ────────────────────────────────────────────────
    this.jupiter = {
      prices: (mints) =>
        this.get<JupiterPriceResponse>(`/v1/jupiter/prices?ids=${mints.join(",")}`),

      tokenSearch: (query) =>
        this.get<JupiterToken[]>(`/v1/jupiter/tokens/search?query=${encodeURIComponent(query)}`),

      tokensByTag: (tag) =>
        this.get<JupiterToken[]>(`/v1/jupiter/tokens/tag?tag=${encodeURIComponent(tag)}`),

      tokenRankings: (category, interval) =>
        this.get<JupiterToken[]>(`/v1/jupiter/tokens/${category}/${interval}`),

      recentTokens: () =>
        this.get<JupiterToken[]>("/v1/jupiter/tokens/recent"),

      portfolio: (wallet, platforms?) => {
        const qs = platforms ? `?platforms=${encodeURIComponent(platforms)}` : "";
        return this.get<Record<string, unknown>>(`/v1/jupiter/portfolio/${wallet}${qs}`);
      },

      stakedJup: (wallet) =>
        this.get<Record<string, unknown>>(`/v1/jupiter/portfolio/${wallet}/staked-jup`),
    };
  }

  // ── Swap (V2 primary) ─────────────────────────────────────────────

  /** Build unsigned swap transaction (V2 with 4-router competition) */
  async swap(params: SwapParams): Promise<SwapResponse> {
    return this.post<SwapResponse>("/v1/swap", params);
  }

  /** Submit signed swap via Jupiter V2 managed execution */
  async swapExecute(params: SwapExecuteParams): Promise<SwapExecuteResponse> {
    return this.post<SwapExecuteResponse>("/v1/swap/execute", params);
  }

  /** Submit signed swap via Helius Sender (fallback path) */
  async swapSend(params: SwapSendParams): Promise<SwapSendResponse> {
    return this.post<SwapSendResponse>("/v1/swap/send", params);
  }

  /** Check transaction confirmation status */
  async swapStatus(signature: string): Promise<SwapStatusResponse> {
    return this.get<SwapStatusResponse>(`/v1/swap/status/${signature}`);
  }

  // ── HTTP helpers ──────────────────────────────────────────────────

  private async get<T>(path: string, queryParams?: Record<string, string>): Promise<T> {
    const { data } = await this.http.get<T>(path, { params: queryParams });
    return data;
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const { data } = await this.http.post<T>(path, body);
    return data;
  }

  private async patch<T>(path: string, body: unknown): Promise<T> {
    const { data } = await this.http.patch<T>(path, body);
    return data;
  }
}

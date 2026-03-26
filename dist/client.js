import axios from "axios";
const DEFAULT_BASE_URL = "https://api.pumpapi.markets";
export class PumpAgent {
    http;
    tokens;
    kol;
    constructor(config = {}) {
        const baseURL = config.baseUrl ?? DEFAULT_BASE_URL;
        const headers = {};
        if (config.apiKey)
            headers["x-api-key"] = config.apiKey;
        if (config.birdeyeKey)
            headers["x-birdeye-key"] = config.birdeyeKey;
        this.http = axios.create({ baseURL, headers });
        this.tokens = {
            new: () => this.get("/v1/tokens/new"),
            get: (address) => this.get(`/v1/tokens/${address}`),
            trending: () => this.get("/v1/tokens/trending"),
            risk: (address) => this.get(`/v1/tokens/${address}/risk`),
        };
        this.kol = {
            activity: () => this.get("/v1/kol/activity"),
        };
    }
    async swap(params) {
        return this.post("/v1/swap", params);
    }
    async get(path) {
        const { data } = await this.http.get(path);
        return data;
    }
    async post(path, body) {
        const { data } = await this.http.post(path, body);
        return data;
    }
}
//# sourceMappingURL=client.js.map
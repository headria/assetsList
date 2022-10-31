type QuoteTag = {
  slug: string;
  name: string;
  category: string;
};

export type QoutePriceData = {
  price?: number;
  volume_24h?: number;
  volume_change_24h?: number;
  percent_change_1h?: number;
  percent_change_24h?: number;
  percent_change_7d?: number;
  percent_change_30d?: number;
  percent_change_60d?: number;
  percent_change_90d?: number;
  market_cap?: number;
  market_cap_dominance?: number;
  fully_diluted_market_cap?: number;
  tvl?: unknown;
  last_updated?: string;
};
export type Quote = {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  num_market_pairs: number;
  date_added: string;
  tags: QuoteTag[];
  max_supply: number;
  circulating_supply: number;
  total_supply: number;
  is_active: number;
  platform: unknown;
  cmc_rank: number;
  is_fiat: number;
  self_reported_circulating_supply: unknown;
  self_reported_market_cap: unknown;
  tvl_ratio: unknown;
  last_updated: string;
  quote: {
    [k: string]: QoutePriceData;
  }[];
};

export type IQoutes = {
  [A: string]: Quote;
};

export type ICapResult<A> = {
  status?: {
    timestamp?: string;
    error_code?: number;
    error_message?: unknown;
    elapsed?: number;
    credit_count?: number;
    notice?: unknown;
  };
  data: A;
};

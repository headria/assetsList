import { IAssetsDetailsItem } from "../thirdparty/types";
import tokensList from "./tokenssamples";
import nomics, { generateQuery, nomicsAxios } from "../thirdparty/nomics";
import { supportedTokens } from "../tokens/supportedTokens";
import { ITokenContract } from "../interfaces/tokens";
import { ITokenInfo } from "../interfaces/tokenInfo";
import {
  IHistoryData,
  IHistoryDataParams,
  IHistoryParams,
  KindHistoryType,
} from "../interfaces/minCryptoInteraces";
import {
  generateMinCryptoQuery,
  minCryptoAxois,
} from "../thirdparty/minCryptoApis";
import { LoggerService } from "../logger";
import { getCachedData, cacheData } from "../utils";

export const TokenListServices = {
  getList: async ({ symbol }: { symbol?: string }) => {
    let tokens: IAssetsDetailsItem[] = tokensList
      .filter((x: IAssetsDetailsItem) =>
        symbol ? x.assetOriginalSymbol?.toLocaleLowerCase() === symbol : 1 === 1
      )
      .slice(0, 10);

    return tokens;
  },
  get1HourPirceList: async ({
    symbols,
  }: {
    symbols?: string[];
  }): Promise<any[]> => {
    let priceListData: any = [];
    let keySymbols: string = symbols?.join(",") || "";
    const cachData = await getCachedData(keySymbols);

    if (cachData?.cached) priceListData = cachData.payload;

    if (!cachData?.cached) {
      priceListData = await nomics.currenciesTicker({
        ids: symbols,
        interval: ["1d"],
      });

      // 10 seconds for cache request. when it's removed it will make new request for data
      await cacheData(keySymbols, JSON.stringify(priceListData), 10);
    }

    let pList: ITokenInfo[] = [];
    priceListData.forEach((x: any) =>
      pList.push({
        symbol: x.symbol === "SAND" ? "SAND2" : x.symbol,
        name: x.name,
        logo: x.logo_url,
        price: x.price,
        price_date: x.price_date,
        price_timestamp: x.price_timestamp,
        circulating_supply: x.circulating_supply,
        max_supply: x.max_supply,
        market_cap: x.market_cap,
        volume: x["1d"]?.volume,
        price_change: x["1d"]?.price_change,
        price_change_pct: x["1d"]?.price_change_pct,
        volume_change: x["1d"]?.volume_change,
        volume_change_pct: x["1d"]?.volume_change_pct,
        market_cap_change: x["1d"]?.market_cap_change,
        market_cap_change_pct: x["1d"]?.market_cap_change_pct,
      })
    );

    return pList;
  },
  getSupportedToken: async (): Promise<ITokenContract[]> => {
    return supportedTokens;
  },
  getCoinInfo: async (symbol: string): Promise<ITokenInfo> => {
    let symbolInfo: ITokenInfo = {};
    let keySymbolCacheData: string = `symbolData-${symbol}`;
    const cachData = await getCachedData(keySymbolCacheData);
    if (cachData?.cached) symbolInfo = cachData.payload as ITokenInfo;

    if (!cachData?.cached) {
      let symbolInfoData: any = {};
      symbolInfoData = await nomics.currenciesTicker({
        ids: [symbol],
        interval: ["1h"],
      });
      if (symbolInfoData?.length > 0) {
        symbolInfo = {
          price: symbolInfoData[0].price,
          price_date: symbolInfoData[0].price_date,
          price_timestamp: symbolInfoData[0].price_timestamp,
          circulating_supply: symbolInfoData[0].circulating_supply,
          max_supply: symbolInfoData[0].max_supply,
          market_cap: symbolInfoData[0].market_cap,
          volume: symbolInfoData[0]["1h"]?.volume,
          price_change: symbolInfoData[0]["1h"]?.price_change,
          price_change_pct: symbolInfoData[0]["1h"]?.price_change_pct,
          volume_change: symbolInfoData[0]["1h"]?.volume_change,
          volume_change_pct: symbolInfoData[0]["1h"]?.volume_change_pct,
          market_cap_change: symbolInfoData[0]["1h"]?.market_cap_change,
          market_cap_change_pct: symbolInfoData[0]["1h"]?.market_cap_change_pct,
        };
      }
      const query = {
        ids: symbol,
        attributes: "description,name,original_symbol,website_url",
      };
      await nomicsAxios
        .get("currencies?" + generateQuery(query))
        .then((res) => {
          if (res?.status === 200) {
            const d = res.data[0];
            symbolInfo = {
              ...symbolInfo,
              symbol:
                d.original_symbol === "SAND" ? "SAND2" : d.original_symbol,
              name: d.name,
              description: d.description,
              website_url: d.website_url,
              coinmarketcapUrl: `https://coinmarketcap.com/currencies/${d.name}/`,
            };
          }
        });
      await cacheData(keySymbolCacheData, JSON.stringify(symbolInfo), 300);
    }

    return symbolInfo;
  },
  getChartData: async (params: IHistoryDataParams): Promise<any> => {
    try {
      const getHistory = getLimitHistory(params.kind);
      const queryParams: IHistoryParams = {
        aggregate: 1,
        e: "CCCAGG",
        fsym: params.symbol,
        limit: getHistory.limit,
        tsym: "usdt",
        tryConversion: false,
      };
      const request = await minCryptoAxois.get(
        getHistory.service + "?" + generateMinCryptoQuery(queryParams)
      );

      if (request.status === 200) {
        const chartData: IHistoryData[] = request.data?.Data?.Data;

        const sortedData: IHistoryData[] = chartData.sort(
          (a: IHistoryData, b: IHistoryData) => b.time - a.time
        );
        return sortedData.map((data) => ({
          time: data.time,
          price: data.close,
        }));
      } else return [];
    } catch (e) {
      LoggerService.error(e);
      return [];
    }
  },
};

const getLimitHistory = (kind: KindHistoryType) => {
  switch (kind) {
    case "24H":
      return {
        service: "histohour",
        limit: 24,
      };

    case "7D":
      return {
        service: "histoday",
        limit: 7,
      };

    case "30D":
      return {
        service: "histoday",
        limit: 30,
      };

    case "60D":
      return {
        service: "histoday",
        limit: 60,
      };

    case "180D":
      return {
        service: "histoday",
        limit: 180,
      };

    case "90D":
      return {
        service: "histoday",
        limit: 90,
      };

    case "365D":
      return {
        service: "histoday",
        limit: 365,
      };

    default:
      return {
        service: "",
        limit: 10,
      };
  }
};

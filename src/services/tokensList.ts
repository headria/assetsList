import {
  ICapResult,
  IQoutes,
  ItemsSymbolDatas,
  ItemSymbolData,
  QoutePriceData,
  Quote,
} from "./../interfaces/coinmarketcap";
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
import { getMetaData, getRealTimePrice } from "../thirdparty/coinmarketcap";

const prefixCachePraceData = "-priceList";

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
    let priceListData: IQoutes = {};
    let keySymbols: string = "";

    for (const symbol of symbols || []) {
      const cachData = await getCachedData(
        symbol.toUpperCase() + prefixCachePraceData
      );
      if (cachData?.cached) {
        priceListData = {
          ...priceListData,
          [symbol]: cachData.payload as Quote,
        };
      } else {
        console.log({ symbol, payload: cachData.payload });
        keySymbols += symbol + ",";
      }
    }

    if (keySymbols.length > 2) {
      const getData = await getRealTimePrice({
        symbol: keySymbols,
      });
      const keys: string[] = Object.keys(getData.data || {});
      // 100 seconds for cache request. cache each symbol sprately
      for (const symbolName of keys) {
        const symbolData = getData.data[symbolName];
        await cacheData(
          symbolName + prefixCachePraceData,
          JSON.stringify(symbolData),
          300
        );
        priceListData = {
          ...priceListData,
          [symbolName]: symbolData,
        };
      }
    }

    let pList: ITokenInfo[] = [];
    const keys: string[] = Object.keys(priceListData);

    keys.forEach((symbolName: string) => {
      const symbolData = priceListData[symbolName];
      if (!symbolData) return;

      let name = symbolData.name;

      if (name == "Boba Network") {
        name = "Ethereum (Boba)";
      }

      //@ts-ignore
      const priceData: QoutePriceData = symbolData.quote["USD"];

      pList.push({
        symbol: symbolData.symbol,
        name: name,
        logo: "",
        price: priceData.price?.toString(),
        price_date: priceData.last_updated?.toString(),
        price_timestamp: priceData.last_updated?.toString(),
        circulating_supply: symbolData.circulating_supply?.toString(),
        max_supply: symbolData.max_supply?.toString(),
        market_cap: priceData.market_cap?.toString(),
        volume: priceData.volume_24h?.toString(),
        price_change: priceData?.percent_change_1h?.toString(),
        price_change_pct: priceData?.percent_change_1h?.toString(),
        volume_change: priceData?.volume_change_24h?.toString(),
        volume_change_pct: priceData?.volume_change_24h?.toString(),
        market_cap_change: "0",
        market_cap_change_pct: "0",
      });
    });

    return pList;
  },
  getSupportedToken: async (): Promise<ITokenContract[]> => {
    return supportedTokens;
  },
  getCoinInfo: async (symbol: string): Promise<ITokenInfo> => {
    let symbolInfo: ITokenInfo = {};
    let keySymbolCacheData: string = `symbolData-${symbol}`;
    const cachData = await getCachedData(keySymbolCacheData);

    if (cachData?.cached) {
      return cachData.payload as ITokenInfo;
    }

    let symbolInfoData: ICapResult<ItemsSymbolDatas> = await getMetaData({
      symbol,
    });

    if (symbolInfoData.status?.error_code != 0) return symbolInfo;

    const symbolData: ItemSymbolData = symbolInfoData.data[symbol];

    if (!symbolData.id) return symbolInfo;

    const getPriceList: ITokenInfo[] =
      await TokenListServices.get1HourPirceList({
        symbols: [symbol],
      });
    console.log(getPriceList);
    if (getPriceList.length === 0) return symbolInfo;

    symbolInfo = {
      price: getPriceList[0].price,
      price_date: getPriceList[0].price_date,
      price_timestamp: getPriceList[0].price_timestamp,
      circulating_supply: getPriceList[0].circulating_supply,
      max_supply: getPriceList[0].max_supply,
      market_cap: getPriceList[0].market_cap,
      volume: getPriceList[0]?.volume,
      price_change: getPriceList[0]?.price_change,
      price_change_pct: getPriceList[0]?.price_change_pct,
      volume_change: getPriceList[0]?.volume_change,
      volume_change_pct: getPriceList[0]?.volume_change_pct,
      market_cap_change: getPriceList[0]?.market_cap_change,
      market_cap_change_pct: getPriceList[0]?.market_cap_change_pct,
      symbol: symbolData.symbol,
      name: symbolData.name,
      description: symbolData.description,
      website_url: symbolData.urls?.website[0] || "",
      coinmarketcapUrl: `https://coinmarketcap.com/currencies/${symbolData.name?.replace(
        " ",
        "-"
      )}/`,
    };

    await cacheData(keySymbolCacheData, JSON.stringify(symbolInfo), 300);

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
          (a: IHistoryData, b: IHistoryData) => a.time - b.time
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

import { IAssetsDetailsItem } from "../thirdparty/types";
import tokensList from "./tokenssamples";
import nomics, { generateQuery, nomicsAxios } from "../thirdparty/nomics";
import { supportedTokens } from "../tokens/supportedTokens";
import { ITokenContract } from "../interfaces/tokens";
import { ITokenInfo } from "../interfaces/tokenInfo";

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
    const priceList = await nomics.currenciesTicker({
      ids: symbols,
      interval: ["1h"],
    });
    let pList: ITokenInfo[] = [];
    priceList.forEach((x: any) =>
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
        volume: x["1h"]?.volume,
        price_change: x["1h"]?.price_change,
        price_change_pct: x["1h"]?.price_change_pct,
        volume_change: x["1h"]?.volume_change,
        volume_change_pct: x["1h"]?.volume_change_pct,
        market_cap_change: x["1h"]?.market_cap_change,
        market_cap_change_pct: x["1h"]?.market_cap_change_pct,
      })
    );

    return pList;
  },
  getSupportedToken: async (): Promise<ITokenContract[]> => {
    return supportedTokens;
  },
  getCoinInfo: async (symbol: string): Promise<ITokenInfo> => {
    const priceInfo: any = await nomics.currenciesTicker({
      ids: [symbol],
      interval: ["1h"],
    });
    let symbolInfo: ITokenInfo = {};
    if (priceInfo?.length > 0) {
      symbolInfo = {
        price: priceInfo[0].price,
        price_date: priceInfo[0].price_date,
        price_timestamp: priceInfo[0].price_timestamp,
        circulating_supply: priceInfo[0].circulating_supply,
        max_supply: priceInfo[0].max_supply,
        market_cap: priceInfo[0].market_cap,
        volume: priceInfo[0]["1h"]?.volume,
        price_change: priceInfo[0]["1h"]?.price_change,
        price_change_pct: priceInfo[0]["1h"]?.price_change_pct,
        volume_change: priceInfo[0]["1h"]?.volume_change,
        volume_change_pct: priceInfo[0]["1h"]?.volume_change_pct,
        market_cap_change: priceInfo[0]["1h"]?.market_cap_change,
        market_cap_change_pct: priceInfo[0]["1h"]?.market_cap_change_pct,
      };
    }

    const query = {
      ids: symbol,
      attributes: "description,name,original_symbol,website_url",
    };
    await nomicsAxios.get("currencies?" + generateQuery(query)).then((res) => {
      if (res?.status === 200) {
        const d = res.data[0];
        symbolInfo = {
          ...symbolInfo,
          symbol: d.original_symbol === "SAND" ? "SAND2" : d.original_symbol,
          name: d.name,
          description: d.description,
          website_url: d.website_url,
          coinmarketcapUrl: `https://coinmarketcap.com/currencies/${d.name}/`,
        };
      }
    });

    return symbolInfo;
  },
};

const getIconUrl = () => {};

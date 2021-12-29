import { IAssetsDetailsItem } from "../thirdparty/types";
import tokensList from "./tokenssamples";
import nomics from "../thirdparty/nomics";
import { IRawCurrencyTicker } from "nomics";

type TokenDataType = {
  address?: string | null;
  name?: string | null;
  symbol?: string | null;
  decimals?: string | null;
  logo?: string | null;
  logo_hash?: string | null;
  thumbnail?: string | null;
  block_number?: string | null;
  validated?: number | null;
};

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
    let pList: any = [];
    console.log(priceList);
    priceList.forEach((x: any) =>
      pList.push({
        symbol: x.symbol,
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
};

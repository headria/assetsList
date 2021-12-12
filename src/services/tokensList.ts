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
  }): Promise<IRawCurrencyTicker[]> => {
    console.log({ symbols });
    return nomics
      .currenciesTicker({
        ids: symbols,
        interval: ["1h"],
      })
      .then((x) => x)
      .catch((x) => {
        console.log(x);
        return x;
      });
  },
};

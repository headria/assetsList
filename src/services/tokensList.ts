import { Moralis } from "moralis";
import cryptoApis from "../thirdparty/cryptoapis";
import redis from "../thirdparty/redis";
import {
  IAssetsDetailsItem,
  ICryptoApisAssestListDetails,
} from "../thirdparty/types";
import tokensList from "./tokenssamples";

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
  searchToken: () => {},
};

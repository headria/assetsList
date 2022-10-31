import { cacheData, getCachedData } from "../../utils";
import callApi, { EthereumChainName } from "./callApi";
const querystring = require("querystring");

const getRequest = (chain: EthereumChainName) => callApi(chain, 30000);

export const getListTransactions = async (
  address: string,
  startblock?: number,
  endblock?: string,
  page?: number,
  offset?: number,
  sort?: string,
  contractAddress?: string,
  chain: EthereumChainName = "mainnet"
): Promise<any> => {
  const module = "account";
  const action = contractAddress ? "tokentx" : "txlist";

  if (!startblock) {
    startblock = 0;
  }

  if (!endblock) {
    endblock = "latest";
  }

  if (!page) {
    page = 1;
  }

  if (!offset) {
    offset = 100;
  }

  if (!sort) {
    sort = "desc";
  }

  var query = {
    module,
    action,
    startblock,
    endblock,
    page,
    offset,
    sort,
    address,
    contractaddress: contractAddress,
  };

  const keyCache = querystring.stringify({ ...query, chain });

  const cachedData = await getCachedData(keyCache);

  if (cachedData.cached) return cachedData.payload;

  const getData = await getRequest(chain)(query);
  cacheData(keyCache, JSON.stringify(getData), 60);
  return getData;
};

export const getBalance = async (
  address: string,
  contractAddress?: string,
  chain: EthereumChainName = "mainnet"
): Promise<any> => {
  const module = "account";
  const action = contractAddress ? "tokenbalance" : "balance";

  var query = {
    module,
    action,

    address,
    contractaddress: contractAddress,
  };

  const keyCache = querystring.stringify({ ...query, chain });

  const cachedData = await getCachedData(keyCache);

  if (cachedData.cached) return cachedData.payload;

  const getData = await getRequest(chain)(query);
  cacheData(keyCache, JSON.stringify(getData), 10);
  return getData;
};

import callApi, { EthereumChainName } from "./callApi";

const getRequest = (chain: EthereumChainName) => callApi(chain, 30000);

export const getListTransactions = (
  address: string,
  startblock?: number,
  endblock?: string,
  page?: number,
  offset?: number,
  sort?: string,
  contractAddress?: string,
  chain: EthereumChainName = "rinkeby"
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

  return getRequest(chain)(query);
};

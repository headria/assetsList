import callApi, { EthereumChainName } from "./callApi";

const getRequest = (chain: EthereumChainName) => callApi(chain, 1000);

export const getListTransactions = (
  address: string,
  startblock?: number,
  endblock?: string,
  page?: number,
  offset?: number,
  sort?: string,
  chain: EthereumChainName = "rinkeby"
) => {
  const module = "account";
  const action = "txlist";

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
    sort = "asc";
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
  };

  return getRequest(chain)(query);
};

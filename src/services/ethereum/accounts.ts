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

export const watchAccount = async (address: string) => {
  const txList: any[] = await getListTransactions(
    address,
    undefined,
    undefined,
    1,
    10
  );

  // query the database to check last transaction
  let expectedAddress: string[] = [];

  const checkIfExits = (trx: any): boolean => {
    let index: number = expectedAddress.findIndex(
      (a) => a === trx.from || a === trx.to
    );

    return index > -1 ? true : false;
  };
  const newList: any[] = txList.filter((trx) => checkIfExits(trx));
  if (newList.length > 0) {
  }
};

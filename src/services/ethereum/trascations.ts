import callApi, { EthereumChainName } from "./callApi";

const getRequest = (chain: EthereumChainName) => callApi(chain, 1000);

export const getStatusOfTransaction = (txhash: string) => {
  const module = "transaction";
  const action = "getstatus";

  var query = {
    module,
    action,
    txhash,
  };

  return getRequest("rinkeby")(query);
};

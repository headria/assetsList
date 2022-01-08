import getReuqest from "./callApi";

export const getBalance = async (address: string): Promise<number> => {
  const request: any = await getReuqest(`q/addressbalance/${address}`)({
    confirmations: 6,
  });
  return Number.parseFloat(request);
};

export const getTransactionsList = async (address: string): Promise<any> => {
  const request: any = await getReuqest(`rawaddr/${address}`)({ limit: 10 });
  return request;
};

export const getUTXOs = async (address: string): Promise<any> => {
  const request: any = await getReuqest(`unspent`)({ active: address });
  return request;
};

import getReuqest from "./callApi";

export const getBalance = async (address: string): Promise<number> => {
  try {
    const request: any = await getReuqest(`addrs/${address}`)();
    return Number.parseFloat(request?.balance || 0);
  } catch {
    return 0;
  }
};

export const getTransactionsList = async (address: string): Promise<any> => {
  try {
    const request: any = await getReuqest(`addrs/${address}/full`)({
      limit: 10,
    });
    return request;
  } catch {
    return 0;
  }
};

export const getUTXOs = async (address: string): Promise<any> => {
  try {
    const request: any = await getReuqest(`addrs/${address}`)({
      unspentOnly: true,
      includeScript: true,
    });
    return request;
  } catch {
    return 0;
  }
};

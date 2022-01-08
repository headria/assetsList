import getReuqest from "./callApi";

export const getBalance = async (address: string): Promise<number> => {
  const request: any = await getReuqest(`q/addressbalance/${address}`)({
    confirmations: 6,
  });
  return Number.parseFloat(request);
};

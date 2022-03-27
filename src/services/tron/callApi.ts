import { LoggerService } from "../../logger";
import axios, { AxiosResponse } from "axios";
import { RPCBody } from "../../interfaces/RPC";

const querystring = require("querystring");

const urls = {
  mainnet: "https://api.trongrid.io/wallet/",
};

export default (service: string, timeout: number = 30000, baseURL?: string) => {
  var client = axios.create({
    baseURL: baseURL,
    timeout: timeout,
  });

  /**
   * @param query
   * @returns {Promise<any>}
   */
  const getRequest = (query?: object) => {
    let q2 = "";
    if (query) q2 = "?" + querystring.stringify({ ...query });
    return new Promise((resolve, reject) => {
      client
        .get(service + q2)
        .then((response: any) => {
          if (response.status === 200) return resolve(response.data);
          return reject(null);
        })
        .catch((error: any) => {
          LoggerService.error(`binance chain error service: ${error}`);
          return reject(null);
        });
    });
  };

  return getRequest;
};
const tronApiKey = "7a13483a-3940-427e-ba5c-f98f474c5682";
export const RPCApiCall = async <A>(url: string, body: RPCBody): Promise<A> => {
  const client = axios.create({
    baseURL: urls["mainnet"],
    timeout: 30000,
  });
  // const q2 = querystring.stringify({ api_key: tronApiKey });

  return new Promise<A>((resolve, reject) => {
    client
      .post(url, body)
      .then((res: AxiosResponse<A>) => {
        if (res.status === 200) return resolve(res.data);
        return reject(null);
      })
      .catch((err: any) => {
        LoggerService.error(`[Tron-service] err: ${err.toString()}`);
        return reject(null);
      });
  });
};

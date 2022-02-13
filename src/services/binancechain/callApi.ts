import { LoggerService } from "../../logger";
import axios from "axios";

const querystring = require("querystring");

const urls = {
  mainnet: "https://api.binance.org/bc/api/v1/",
};

export default (service: string, timeout: number = 30000) => {
  var client = axios.create({
    baseURL: urls["mainnet"],
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

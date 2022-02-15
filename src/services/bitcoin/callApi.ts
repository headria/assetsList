import { LoggerService } from "../../logger";

const querystring = require("querystring");
const axios = require("axios");

const urls = {
  testnet: "https://api.blockcypher.com/v1/btc/test3/",
  testnet2: "https://api.blockcypher.com/v1/bcy/test/",
  mainnet: "https://api.blockcypher.com/v1/btc/main/",
};
const tokenApi = "4f1652bce3864b0198ccf41b1242efce";

export default (
  service: string,
  timeout: number = 30000,
  shouldUseToken: boolean = true
) => {
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
    if (query)
      q2 =
        "?" +
        querystring.stringify({
          ...query,
          token: shouldUseToken ? tokenApi : undefined,
        });
    console.log(urls["mainnet"] + service + q2);
    return new Promise((resolve, reject) => {
      client
        .get(service + q2)
        .then((response: any) => {
          if (response.status === 200) return resolve(response.data);
          return reject(null);
        })
        .catch((error: any) => {
          LoggerService.error(`bitcoin error service: ${error}`);
          return reject(null);
        });
    });
  };

  return getRequest;
};

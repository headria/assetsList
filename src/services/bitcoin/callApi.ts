import { LoggerService } from "../../logger";

const querystring = require("querystring");
const axios = require("axios");

const urls = {
  testnet: "https://api.blockcypher.com/v1/btc/test3/",
  testnet2: "https://api.blockcypher.com/v1/bcy/test/",
  mainnet: "https://api.blockcypher.com/v1/btc/main/",
};
const tokenApi = "4f1652bce3864b0198ccf41b1242efce";

export default (service: string, timeout: number = 30000) => {
  var client = axios.create({
    baseURL: urls["testnet"],
    timeout: timeout,
  });

  /**
   * @param query
   * @returns {Promise<any>}
   */
  const getRequest = (query?: object) => {
    let q2 = "";
    if (query) q2 = "?" + querystring.stringify({ ...query, token: tokenApi });
    return new Promise((resolve, reject) => {
      client
        .get(service + q2)
        .then((response: any) => {
          var data = response.data;

          resolve(data);
        })
        .catch((error: any) => {
          LoggerService.error(`bitcoin error service: ${error}`);
          return reject(new Error(error));
        });
    });
  };

  return getRequest;
};

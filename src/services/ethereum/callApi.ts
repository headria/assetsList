const querystring = require("querystring");
const axios = require("axios");

export type EthereumChainName = "ropsten" | "kovan" | "rinkeby" | "mainnet";
/**
 * @param {string} chain
 * @returns {string}
 */

function pickChainUrl(chain: EthereumChainName) {
  if (!chain || !TESTNET_API_URL_MAP[chain]) {
    return MAIN_API_URL;
  }

  return TESTNET_API_URL_MAP[chain];
}

const MAIN_API_URL = "https://api.etherscan.io";
const TESTNET_API_URL_MAP = {
  ropsten: "https://api-ropsten.etherscan.io",
  kovan: "https://api-kovan.etherscan.io",
  rinkeby: "https://api-rinkeby.etherscan.io",
  mainnet: "https://api.etherscan.io",
};

export default (chain: EthereumChainName, timeout: number) => {
  var client = axios.create({
    baseURL: pickChainUrl(chain),
    timeout: timeout,
  });
  const apiKey = "3GND43EEVWQFZ9GSZVSSMV68PUIPJKDD8D";

  /**
   * @param query
   * @returns {Promise<any>}
   */
  const getRequest = (query: object) => {
    const q2 = querystring.stringify({ ...query, apiKey });
    console.log(q2);
    return new Promise(function (resolve, reject) {
      client
        .get("/api?" + q2)
        .then(function (response: any) {
          var data = response.data;

          if (data.status && data.status != 1) {
            let returnMessage = data.message || "NOTOK";
            if (data.result && typeof data.result === "string") {
              returnMessage = data.result;
            } else if (data.message && typeof data.message === "string") {
              returnMessage = data.message;
            }

            return reject(returnMessage);
          }

          if (data.error) {
            var message = data.error;

            if (typeof data.error === "object" && data.error.message) {
              message = data.error.message;
            }

            return reject(new Error(message));
          }

          resolve(data.result);
        })
        .catch(function (error: any) {
          return reject(new Error(error));
        });
    });
  };

  return getRequest;
};

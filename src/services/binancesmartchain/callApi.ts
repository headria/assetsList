const querystring = require("querystring");
const axios = require("axios");

export type EthereumChainName = "testnet" | "mainnet";
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
function pickApiKey(chain: EthereumChainName) {
  return ApiKeys[chain];
}

const MAIN_API_URL = "https://api.bscscan.com/api";
const TESTNET_API_URL_MAP = {
  testnet: "https://api-testnet.bscscan.com",
  mainnet: "https://api.bscscan.com/api",
};
const ApiKeys = {
  testnet: "1ZCF7UITDGJ46YU2H6KD7P4RWP5H57FM3J",
  mainnet: "1ZCF7UITDGJ46YU2H6KD7P4RWP5H57FM3J",
};

export default (chain: EthereumChainName, timeout: number) => {
  var client = axios.create({
    baseURL: pickChainUrl(chain),
    timeout: timeout,
  });
  const apiKey = pickApiKey(chain);

  /**
   * @param query
   * @returns {Promise<any>}
   */
  const getRequest = (query: object) => {
    const q2 = querystring.stringify({ ...query, apiKey });
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
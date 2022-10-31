const querystring = require("querystring");
const axios = require("axios");

export type EthereumChainName = "testnet" | "mainnet" | "avax";
/**
 * @param {string} chain
 * @returns {string}
 */

function pickChainUrl(chain: EthereumChainName = "mainnet") {
  return Urls[chain];
}
function pickApiKey(chain: EthereumChainName) {
  return ApiKeys[chain];
}

const MAIN_API_URL = "https://api.bobascan.com/api";
const Urls = {
  testnet: "https://api-testnet.bscscan.com",
  mainnet: "https://api.bobascan.com",
  avax: "https://blockexplorer.avax.boba.network",
};
const ApiKeys = {
  testnet: "QFF596MU5FGDEZS8PHUPST3X2WWH59THFV",
  mainnet: "QFF596MU5FGDEZS8PHUPST3X2WWH59THFV",
  avax: undefined,
};

export default (chain: EthereumChainName, timeout: number) => {
  var client = axios.create({
    baseURL: pickChainUrl(chain),
    timeout: timeout,
  });
  const apiKey = pickApiKey(chain);
  // const apiKey = undefined;

  /**
   * @param query
   * @returns {Promise<any>}
   */
  const getRequest = (query: object) => {
    const q2 = querystring.stringify({ ...query, apiKey });
    console.log(pickChainUrl(chain) + "/api?" + q2);

    return new Promise(function (resolve, reject) {
      client
        .get("/api?" + q2)
        .then(function (response: any) {
          var data = response.data;
          if (data?.result && typeof data.result !== "string")
            return resolve(data.result);

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

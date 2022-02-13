import { RPCBody, RPCResult } from "../../interfaces/RPC";
import axios, { AxiosResponse } from "axios";
import querystring from "querystring";
import { LoggerService } from "../../logger";

export type EthereumChainName =
  | "ropsten"
  | "kovan"
  | "rinkeby"
  | "mainnet"
  | "mumbai"
  | "polygon"
  | "bsctestnet"
  | "bscmainnet";
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

const MAIN_API_URL = "https://api.etherscan.io";
const TESTNET_API_URL_MAP = {
  ropsten: "https://api-ropsten.etherscan.io",
  kovan: "https://api-kovan.etherscan.io",
  rinkeby: "https://api-rinkeby.etherscan.io",
  mainnet: "https://api.etherscan.io",
  mumbai: "https://mumbai.polygonscan.com",
  polygon: "https://polygonscan.com",
  bsctestnet: "https://api-testnet.bscscan.com",
  bscmainnet: "https://api.bscscan.com/api",
};
const ApiKeys = {
  ropsten: "3GND43EEVWQFZ9GSZVSSMV68PUIPJKDD8D",
  kovan: "3GND43EEVWQFZ9GSZVSSMV68PUIPJKDD8D",
  rinkeby: "3GND43EEVWQFZ9GSZVSSMV68PUIPJKDD8D",
  mainnet: "3GND43EEVWQFZ9GSZVSSMV68PUIPJKDD8D",
  mumbai: "PNIPM91AZ6B8CWNSIUHGNBC8S31THZGGVK",
  polygon: "PNIPM91AZ6B8CWNSIUHGNBC8S31THZGGVK",
  bsctestnet: "1ZCF7UITDGJ46YU2H6KD7P4RWP5H57FM3J",
  bscmainnet: "1ZCF7UITDGJ46YU2H6KD7P4RWP5H57FM3J",
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

const blockIOApiKey = "2e89aac7-4985-4684-9547-fd4956bbd784";
export const RPCApiCall = async <A>(url: string, body: RPCBody): Promise<A> => {
  const client = axios.create({
    baseURL: url,
    timeout: 30000,
  });
  const q2 = querystring.stringify({ api_key: blockIOApiKey });

  console.log(url);
  return new Promise<A>((resolve, reject) => {
    client
      .post("", body)
      .then((res: AxiosResponse<A>) => {
        if (res.status === 200) return resolve(res.data);
        return reject(null);
      })
      .catch((err: any) => {
        LoggerService.error(`[RPCApiCall] err: ${err.toString()}`);
        return reject(null);
      });
  });
};

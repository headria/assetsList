import querystring from "querystring";
import axios from "axios";

const apiKey =
  "958c8f0d7b50ae0d76eeff6f59947cda81b111fee7487be672bb630ca4d23669";

export const generateMinCryptoQuery = (query: object) => {
  return querystring.stringify({ ...query, api_key: apiKey });
};

export const minCryptoAxois = axios.create({
  baseURL: "https://min-api.cryptocompare.com/data/v2/",
});

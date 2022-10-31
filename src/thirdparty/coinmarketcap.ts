import { ICapResult, IQoutes } from "./../interfaces/coinmarketcap";
import axios from "axios";
import { LoggerService } from "../logger";
const querystring = require("querystring");

export const coinmartketApi = (service: string, timeout: number = 30000) => {
  var client = axios.create({
    baseURL: "https://pro-api.coinmarketcap.com/v1/cryptocurrency",
    timeout: timeout,
    headers: {
      "X-CMC_PRO_API_KEY": "39132736-62a9-4823-97f5-acfbcae5900a",
    },
  });

  /**
   * @param query
   * @returns {Promise<any>}
   */
  const getRequest = (query?: object) => {
    let q2 = "";
    if (query) q2 = "?" + querystring.stringify({ ...query });
    return new Promise((resolve, reject) => {
      console.log(service + q2);
      client
        .get(service + q2)
        .then((response: any) => {
          if (response.status === 200) return resolve(response.data);
          return reject(null);
        })
        .catch((error: any) => {
          LoggerService.error(`coinmarketcap error service: ${error}`);
          return reject(null);
        });
    });
  };

  return getRequest;
};

/**
 * 
 * @param query ref: https://coinmarketcap.com/api/documentation/v1/#operation/getV2CryptocurrencyQuotesLatest
 * @param id	
string
One or more comma-separated cryptocurrency CoinMarketCap IDs. Example: 1,2

@param slug	
string
Alternatively pass a comma-separated list of cryptocurrency slugs. Example: "bitcoin,ethereum"

@param symbol	
string
Alternatively pass one or more comma-separated cryptocurrency symbols. Example: "BTC,ETH". At least one "id" or "slug" or "symbol" is required for this request.

@param convert	
string
Optionally calculate market quotes in up to 120 currencies at once by passing a comma-separated list of cryptocurrency or fiat currency symbols. Each additional convert option beyond the first requires an additional call credit. A list of supported fiat options can be found here. Each conversion is returned in its own "quote" object.

 @param convert_id	
string
Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.

 @param aux	
string
"num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,is_active,is_fiat"
Optionally specify a comma-separated list of supplemental data fields to return. Pass num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,market_cap_by_total_supply,volume_24h_reported,volume_7d,volume_7d_reported,volume_30d,volume_30d_reported,is_active,is_fiat to include all auxiliary fields.

@param skip_invalid	
boolean
true
Pass true to relax request validation rules. When requesting records on multiple cryptocurrencies an error is returned if no match is found for 1 or more requested cryptocurrencies. If set to true, invalid lookups will be skipped allowing valid cryptocurrencies to still be returned.
 * @returns 
 */
export const getRealTimePrice = async (
  query?: object
): Promise<ICapResult<IQoutes>> => {
  return (await coinmartketApi("quotes/latest")(query)) as ICapResult<IQoutes>;
};

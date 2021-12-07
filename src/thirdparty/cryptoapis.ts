import Cryptoapis from "cryptoapis";

var defaultClient = Cryptoapis.ApiClient.instance;
// Configure API key authorization: ApiKey
var ApiKey = defaultClient.authentications["ApiKey"];
ApiKey.apiKey = "6f4ee03cce2068fae8b778d87f68ab52e2cdf8ef";
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//ApiKey.apiKeyPrefix['x-api-key'] = "Token"

var api = new Cryptoapis.AssetsApi();

export default api;

const querystring = require("querystring");
const axios = require("axios");

export default (service: string, timeout: number = 30000) => {
  var client = axios.create({
    baseURL: "https://blockchain.info/",
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
          var data = response.data;

          resolve(data);
        })
        .catch((error: any) => {
          return reject(new Error(error));
        });
    });
  };

  return getRequest;
};

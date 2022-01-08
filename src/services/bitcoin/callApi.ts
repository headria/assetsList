const querystring = require("querystring");
const axios = require("axios");

export default (service: string, timeout: number = 1000) => {
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
    return new Promise(function (resolve, reject) {
      client
        .get(service + q2)
        .then(function (response: any) {
          var data = response.data;

          resolve(data);
        })
        .catch(function (error: any) {
          return reject(new Error(error));
        });
    });
  };

  return getRequest;
};

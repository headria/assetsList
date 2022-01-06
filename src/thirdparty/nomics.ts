import Nomics from "nomics";
import querystring from "querystring";
import axios from "axios";

export const nomicsApiKey = "m_0dd1c06d4ad75bf3ab84e9e66e81243bd8d43b2b";

const nomics = new Nomics({
  apiKey: nomicsApiKey,
});

export const nomicsAxios = axios.create({
  baseURL: "https://api.nomics.com/v1/",
});

export const generateQuery = (query: object) => {
  return querystring.stringify({ ...query, key: nomicsApiKey });
};
export default nomics;

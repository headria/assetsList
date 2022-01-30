import client from "../thirdparty/redis";

export const getCachedData = async (
  key: string
): Promise<{
  payload: any;
  cached: boolean;
}> => {
  try {
    const data = await client.get(key);

    if (data)
      return {
        cached: true,
        payload: JSON.parse(data),
      };

    return {
      cached: false,
      payload: null,
    };
  } catch (err: any) {
    return {
      cached: false,
      payload: err,
    };
  }
};

export const cacheData = async (
  key: string,
  data: string,
  seconds: number = 3600
): Promise<{
  payload?: any;
  cached: boolean;
}> => {
  try {
    const cacheResult = await client.setex(key, seconds, data);

    if (cacheResult)
      return {
        cached: true,
      };

    return {
      cached: false,
    };
  } catch (err: any) {
    return {
      cached: false,
      payload: err,
    };
  }
};

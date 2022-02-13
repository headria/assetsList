export type RPCResult<T> = {
  jsonrpc: string;
  id: string;
  result: T;
};

export type RPCBody = {
  jsonrpc: string;
  method: string;
  id: number;
  params: object;
};

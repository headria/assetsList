export type TronTransactionResult = {
  ret: {
    contractRet: string;
  }[];
  signature: string[];
  txID: string;
  raw_data: {
    contract: {
      parameter: {
        value: {
          amount: number;
          owner_address: string;
          to_address: string;
        };
        type_url: string;
      };
      type: string;
    }[];
    ref_block_bytes: string;
    ref_block_hash: string;
    expiration: number;
    timestamp: number;
  };
  raw_data_hex: string;
};

export type ArabCoin = {
  from: string;
  to: string;
  network: string;
  amount_network: string;
  amount_arb: number;
  ref_code?: string;
  discount?: number;
  price_arabcoin?: number;
  hash: string;
  check_count?: number;
  rejected_reasons?: string;
  createdAt?: Date;
  createdAtNumber?: number;
};

export type ArabCoinSummeryTransaction = {
  trHash: string;
  arabCoinAmount: number;
  networkAmount: string;
  network: string;
  createdAt: string | Date;
};
export type TotalBalanceType = { totalAmount: number; _id: object };

/**
 * new for new transaction(s)
 * success for validated transaction(s)
 * failed for failer transacion(s)
 * pending for transaction those are check under 4 time
 */
export type TransactionStatus = "new" | "success" | "failed" | "pending";

export type TransactionTypes = {
  [A in TransactionStatus]: "New" | "Success" | "Failed" | "Pending";
};
export type ETHNetworkTypes = "ETH" | "BSC" | "MATIC";

export const transactionTypeStatus: TransactionTypes = {
  new: "New",
  success: "Success",
  failed: "Failed",
  pending: "Pending",
};

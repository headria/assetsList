export type ArabCoin = {
  from: string;
  to: string;
  network: string;
  amount_network: string;
  amount_arb: number;
  hash: string;
  check_count?: number;
};

export type TotalBalanceArab = { totalAmount: number; _id: object };

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

export const transactionTypeStatus: TransactionTypes = {
  new: "New",
  success: "Success",
  failed: "Failed",
  pending: "Pending",
};

import Web3 from "web3";
import BN from "bn.js";
import { LoggerService } from "../logger";
export const XRPUnit = 6;
export const ETHUnit = 18;
export const BTCUnit = 8;

export type NetworkType = "XRP" | "BTC" | "ETH" | "BNB";

export const convertToUnit = (
  value: string | undefined,
  network: NetworkType,
  reverse?: boolean
): string => {
  if (!value) return "0";

  const tenN: number = 10;

  if (network === "XRP") {
    const poweredTen = Math.pow(tenN, XRPUnit);

    return (Number(value) / poweredTen).toString();
  }
  if (network === "ETH") return Web3.utils.fromWei(value, "ether");

  if (network === "BTC") {
    const poweredTen = Math.pow(tenN, BTCUnit);

    if (reverse) return (Number(value) * poweredTen).toString();

    return (Number(value) / poweredTen).toString();
  }

  return "0";
};

export const convertXrpDateTime = (value?: string): string => {
  if (!value) return "0";

  const newValue = new BN(value);
  return newValue.add(new BN("946684800")).toString() + "000";
};

export const multiplyTwoNumber = (
  a: string | number,
  b: string | number
): string => {
  return new BN(a).mul(new BN(b)).toString();
};

const erc20TransferABI = [
  {
    type: "address",
    name: "recipient",
  },
  {
    type: "uint256",
    name: "amount",
  },
];
export const decodeETHInputDataTransafer = (str: string) => {
  try {
    const web3 = new Web3();
    const data = web3.eth.abi.decodeParameters(erc20TransferABI, str.slice(10));
    return {
      amount: Web3.utils.fromWei(data.amount),
      recipient: data.recipient,
    };
  } catch (e: any) {
    LoggerService.error(`[decodeETHInputDataTransafer] err: ${e.toString()}`);
    return {
      amount: 0,
      recipient: "",
    };
  }
};

import ReferralModel from "../models/referalcode";
import { nanoid, customAlphabet } from "nanoid";
import { LoggerService } from "../logger";
import { IServiceResult } from "../interfaces/general";
import { isConstructorDeclaration } from "typescript";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const getNewCode = customAlphabet(alphabet, 9);

export const getReferralByAddress = async (address?: string) => {
  try {
    let query: any = {};
    query.user_wallet_addresses = { $all: [address] };

    const doc = await ReferralModel.findOne(query);
    if (!doc) return undefined;
    return doc;
  } catch (e) {
    return undefined;
  }
};
export const checkExitsReferralCodeByaddressAndCode = async (
  referral_code?: string,
  address?: string | string[]
) => {
  try {
    let query: any = {};
    if (referral_code) query.referral_code = referral_code;

    console.log(address);
    if (address) {
      if (Array.isArray(address))
        query.user_wallet_addresses = { $all: address };
      else query.user_wallet_addresses = { $all: [address] };
    }

    const doc = await ReferralModel.findOne(query);
    if (!doc) return undefined;
    return doc;
  } catch (e) {
    LoggerService.error(`[checkExitsReferralCodeByaddressAndCode] err: ${e}`);
    return undefined;
  }
};

export const checkExitsReferralCodeByCode = async (referral_code?: string) => {
  try {
    let query: any = {};
    query.referral_code = referral_code;

    const doc = await ReferralModel.findOne(query);
    if (!doc) return undefined;
    return doc;
  } catch (e) {
    LoggerService.error(`[checkExitsReferralCodeByCode] err: ${e}`);
    return undefined;
  }
};
export const getAllReferral = async () => {
  try {
    const doc = await ReferralModel.find({});
    return doc;
  } catch (e) {
    LoggerService.error(`[getAllReferral] err: ${e}`);
    return [];
  }
};

const generateNewCode = async (): Promise<string> => {
  const referral_code: string = getNewCode();
  const getReferral = await checkExitsReferralCodeByCode(referral_code);
  if (getReferral) return await generateNewCode();

  return referral_code;
};
export const generateNewReferral = async (
  params: any
): Promise<IServiceResult> => {
  const { dID, user_wallet_addresses, percentage } = params;

  console.log({ dID, user_wallet_addresses, percentage });
  try {
    const referral_code: string = await generateNewCode();

    if (!Array.isArray(user_wallet_addresses)) {
      return {
        code: -1,
        message: "user_wallet_addresses must be an array.",
      };
    }
    if (user_wallet_addresses.length < 5) {
      return {
        code: -1,
        message:
          "user_wallet_addresses length must be bigger than five address .",
      };
    }
    const checkByAddress = await checkExitsReferralCodeByaddressAndCode(
      undefined,
      user_wallet_addresses
    );
    if (checkByAddress) return { code: 0, message: "", data: checkByAddress };

    const doc = await ReferralModel.create({
      referral_code,
      user_wallet_addresses: user_wallet_addresses,
      dID: dID,
      percentage,
    });
    return {
      code: 0,
      message: "",
      data: doc,
    };
  } catch (e) {
    LoggerService.error(`[generateNewReferral] err: ${e}`);
    return {
      code: -1,
      message: "Error occured on the server.",
    };
  }
};

export const updatePercentage = async (params: any) => {
  const { referral_code, percentage } = params;
  try {
    const doc = await ReferralModel.updateOne(
      { referral_code },
      {
        $set: {
          percentage,
        },
      }
    );
    return doc.modifiedCount > 0;
  } catch (e) {
    LoggerService.error(`[updatePercentage] err: ${e}`);
    return null;
  }
};

export const getUserWallets = async (params: any) => {
  const { referral_code } = params;
  try {
    const doc = await ReferralModel.findOne(
      { referral_code },
      { user_wallet_addresses: 1, _id: 0 }
    );
    if (!doc) return null;
    return doc;
  } catch (e) {
    LoggerService.error(`[getUserWallets] err: ${e}`);
    return null;
  }
};

export const addUserWallets = async (params: any) => {
  const { referral_code, user_wallet_addresses } = params;
  try {
    const doc = await ReferralModel.findOneAndUpdate(
      { referral_code },
      { $addToSet: { user_wallet_addresses } },
      { new: true }
    );
    if (!doc) return null;
    return doc;
  } catch (e) {
    LoggerService.error(`[addUserWallets] err: ${e}`);
    return null;
  }
};

import ReferralModel from "../models/referalcode";
import { nanoid, customAlphabet } from "nanoid";
import { LoggerService } from "../logger";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const getNewCode = customAlphabet(alphabet, 6);

export const getReferralByAddress = async (address?: string) => {
  try {
    let query: any = {};
    query.user_wallet_addresseses = { $all: [address] };

    const doc = await ReferralModel.findOne(query);
    if (!doc) return undefined;
    return doc;
  } catch (e) {
    return undefined;
  }
};
const checkExitsReferralCodeByaddressAndCode = async (
  referral_code?: string,
  address?: string | string[]
) => {
  try {
    let query: any = {};
    if (referral_code) query.referral_code = referral_code;

    if (address) {
      if (Array.isArray(address))
        query.user_wallet_addresseses = { $all: address };
      else query.user_wallet_addresseses = { $all: [address] };
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
export const generateNewReferral = async (params: any) => {
  const { user_wallet_addresses, percentage } = params;
  try {
    const referral_code: string = await generateNewCode();

    const checkByAddress = await checkExitsReferralCodeByaddressAndCode(
      undefined,
      user_wallet_addresses
    );
    if (checkByAddress) return checkByAddress;
    const doc = await ReferralModel.create({
      referral_code,
      user_wallet_addresseses: user_wallet_addresses,
      percentage,
    });
    return doc;
  } catch (e) {
    LoggerService.error(`[generateNewReferral] err: ${e}`);
    return null;
  }
};

export const updatePercentage = async (params: any) => {
  const { referral_code, percentage } = params;
  try {
    console.log(referral_code);
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
      { user_wallet_addresseses: 1, _id: 0 }
    );
    if (!doc) return null;
    return doc;
  } catch (e) {
    LoggerService.error(`[getUserWallets] err: ${e}`);
    return null;
  }
};

export const addUserWallets = async (params: any) => {
  const { referral_code, user_wallet_addresseses } = params;
  try {
    const doc = await ReferralModel.findOneAndUpdate(
      { referral_code },
      { $addToSet: { user_wallet_addresseses } },
      { new: true }
    );
    if (!doc) return null;
    return doc;
  } catch (e) {
    LoggerService.error(`[addUserWallets] err: ${e}`);
    return null;
  }
};

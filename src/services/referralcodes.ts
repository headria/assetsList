import ReferralModel from "../models/referalcode";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const getNewCode = "213saß";

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
export const checkExitsReferralCode = async (
  referral_code: string,
  address?: string | string[]
) => {
  try {
    let query: any = {};
    query.referral_code = referral_code;
    if (address) query.user_wallet_addresses = { $all: [address] };

    const doc = await ReferralModel.findOne(query);
    if (!doc) return undefined;
    return doc;
  } catch (e) {
    return undefined;
  }
};

export const getAllReferral = async () => {
  try {
    const doc = await ReferralModel.find({});
    return doc;
  } catch (e) {
    return [];
  }
};
export const generateNewReferral = async (params: any) => {
  const { user_wallet_address, percentage } = params;
  try {
    const referral_code = getNewCode[0];
    const getReferral = await checkExitsReferralCode(
      referral_code,
      user_wallet_address
    );
    if (getReferral) return getReferral;

    const doc = await ReferralModel.create({
      referral_code,
      user_wallet_address,
      percentage,
    });
    return doc;
  } catch (e) {
    return null;
  }
};

export const updatePercentage = async (params: any) => {
  const { referral_code, percentage } = params;
  try {
    const doc = await ReferralModel.findOneAndUpdate(
      { referral_code },
      {
        $addToSet: {
          percentage,
        },
      }
    );
    return doc;
  } catch (e) {
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
    return null;
  }
};

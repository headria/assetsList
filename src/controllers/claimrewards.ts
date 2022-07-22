export const ClaimRewardsController = {
  new: async (req, res) => {
    return res.status(200).send({
      code: 0,
      message: "",
      data: true,
    });
  },
  getLastStatus: async (req, res) => {
    return res.status(200).send({
      code: 0,
      message: "",
      data: {
        nextPayment: 1658583836,
        locked: true,
      },
    });
  },
};

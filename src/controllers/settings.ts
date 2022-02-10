export const SettingsController = {
  checkForUpdate: async (res, req) => {
    return res.status(200).send({
      code: 0,
      message: "",
      data: false,
    });
  },
};

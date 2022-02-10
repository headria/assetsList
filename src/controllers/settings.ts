export const SettingsController = {
  checkForUpdate: async (req: any, res: any) => {
    return res.status(200).send({
      code: 0,
      message: "",
      data: false,
    });
  },
};

export const SettingsController = {
  checkForUpdate: async (req: any, res: any) => {
    const version: number = req.qeury.version;

    if (version === 2) {
      return res.status(200).send({
        code: 0,
        message: "",
        data: {
          latestVersion: 0.1,
          description: `
          1. Add new coins
          2. Bla bla bla
          `,
          forceUpdate: true,
        },
      });
    }
    return res.status(200).send({
      code: 0,
      message: "",
      data: {
        latestVersion: 0.1,
        description: `
        `,
        forceUpdate: false,
      },
    });
  },
};

import e from "express";
import { Networks } from "../interfaces/devices";
import { LoggerService } from "../logger";
import { AddressesService, DevicesService } from "../services";

export const NofiticationService = {
  addNewDevice: async (req: any, res: any) => {
    try {
      const body: any = req.body;
      const addDevice = await DevicesService.addNewDeviceOrUpdate({
        dId: body.id,
        token: body.token,
        type: body.type,
      });

      const networks: Networks[] = body?.networks;

      const funcs = networks?.map((item) =>
        AddressesService.addNewDeviceOrUpdate({
          addresses: item.addresses,
          blockchain: item.name,
          dId: body.id,
        })
      );

      await Promise.all(funcs);

      if (addDevice) return res.status(200).send({ code: 0, message: "" });
      else return res.status(500).send({});
    } catch (e: any) {
      LoggerService.error(e.toString());
      return res.status(500).send({});
    }
  },
  removeDevice: async (req: any, res: any) => {
    try {
      const id = req.query?.id;
      const removeDevice = await DevicesService.removeDevice({ dId: id });
      const removeAddresses = await AddressesService.removeDevice({ dId: id });
      if (removeDevice && removeAddresses)
        return res.status(200).send({ code: 0, message: "" });
      else return res.status(500).send({});
    } catch (e: any) {
      LoggerService.error(e.toString());
      return res.status(500).send({});
    }
  },
};

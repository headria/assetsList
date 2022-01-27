import { NewDevice } from "../interfaces/devices";
import { LoggerService } from "../logger";
import DeviceModel, { DeviceDTO } from "../models/devices";

export const DevicesService = {
  addNewDeviceOrUpdate: async (payloads: NewDevice) => {
    try {
      const checkIfExits = await DeviceModel.findOne({
        dID: payloads.dId,
      });

      if (checkIfExits?.dID) {
        await DeviceModel.findByIdAndUpdate(
          checkIfExits._id,
          {
            $set: {
              dID: payloads.dId,
              token: payloads.token,
            },
          },
          {
            overwrite: true,
          }
        );
        return true;
      } else {
        await new DeviceModel({
          dID: payloads.dId,
          token: payloads.token,
          type: payloads.type,
        }).save();

        return true;
      }
    } catch (e: any) {
      console.log(e);
      LoggerService.error(e.toString());
      return false;
    }
  },
  getDevices: async ({ dId }: Partial<NewDevice>): Promise<DeviceDTO[]> => {
    try {
      const getData = await DeviceModel.find({
        dID: dId,
      });
      return getData;
    } catch (e: any) {
      LoggerService.error(e.toString());
      return [];
    }
  },
  /**
   *
   * @param payloads
   * @returns
   */
  removeDevice: async ({ dId }: Partial<NewDevice>): Promise<boolean> => {
    try {
      await DeviceModel.deleteMany({
        dID: dId,
      });
      return true;
    } catch (e: any) {
      LoggerService.error(e.toString());
      return false;
    }
  },
  getAllDevices: async (): Promise<DeviceDTO[]> => {
    try {
      const getData = await DeviceModel.find({});
      return getData;
    } catch (e: any) {
      LoggerService.error(e.toString());
      return [];
    }
  },
};

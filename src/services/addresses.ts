import { NewDeviceAddress } from "../interfaces/addresses";
import { LoggerService } from "../logger";
import AddressesModel, { AddressesDTO } from "../models/address";

export const AddressesService = {
  addNewDeviceOrUpdate: async (payloads: NewDeviceAddress) => {
    try {
      const checkIfExits = await AddressesModel.findOne({
        dID: payloads.dId,
        blockchain: payloads.blockchain,
      });
      if (checkIfExits?.dID) {
        await AddressesModel.findByIdAndUpdate(
          checkIfExits._id,
          {
            $set: {
              dID: payloads.dId,
              addresses: payloads.addresses,
              blockchain: payloads.blockchain,
              fcm_token: payloads.fcm_token,
            },
          },
          {
            overwrite: true,
          }
        );
        return true;
      } else {
        await new AddressesModel({
          dID: payloads.dId,
          addresses: payloads.addresses,
          blockchain: payloads.blockchain,
          fcm_token: payloads.fcm_token,
        }).save();

        return true;
      }
    } catch (e: any) {
      console.log(e);
      LoggerService.error(e.toString());
      return false;
    }
  },
  getDevice: async (payloads: NewDeviceAddress): Promise<AddressesDTO[]> => {
    try {
      const getData = await AddressesModel.find({
        dID: payloads.dId,
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
  removeDevice: async ({
    dId,
  }: Partial<NewDeviceAddress>): Promise<boolean> => {
    try {
      await AddressesModel.deleteMany({
        dID: dId,
      });
      return true;
    } catch (e: any) {
      LoggerService.error(e.toString());
      return false;
    }
  },
  getAllDevices: async (): Promise<AddressesDTO[]> => {
    try {
      const getData = await AddressesModel.find({});
      return getData;
    } catch (e: any) {
      LoggerService.error(e.toString());
      return [];
    }
  },
};

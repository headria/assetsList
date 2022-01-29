import { MessagingPayload } from "firebase-admin/lib/messaging/messaging-api";
import { LoggerService } from "../logger";
import { admin, options } from "../thirdparty/firebase";
export const NotificationService = {
  sendNotification: async (
    title: string,
    mob_token: string
  ): Promise<{ status: boolean; message?: string }> => {
    try {
      const bodyData = {
        from: "0x55140c7Fd926Ef5fC9467aBe40Af73eD60B2d991",
        to: "0x55140c7Fd926Ef5fC9467aBe40Af73eD60B2d991",
        value: "1",
        type: "send",
        netwrokFee: "15",
        hash: "0x55140c7Fd926Ef5fC9467aBe40Af73eD60B2d991",
        blcokchain: "ETH",
        status: "success",
        nonce: "1",
        date: "1643482719000",
      };
      let payload: MessagingPayload = {
        notification: {
          title,
          ...bodyData,
        },
      };
      console.log(payload, "==========");
      let token = [mob_token];

      const result = await admin
        .messaging()
        .sendToDevice(token, payload, options);

      console.log(result);
      if (result.successCount === 1)
        return {
          status: true,
        };

      if (result?.failureCount > 0)
        return {
          status: false,
          message: result?.results[0]?.error?.message,
        };
      return {
        status: false,
      };
    } catch (e: any) {
      LoggerService.error(e.toString());
      return {
        status: false,
      };
    }
  },
};

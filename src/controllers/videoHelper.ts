import { LoggerService } from "../logger";

type LangTypes = "ar" | "en" | "fa" | "tr" | "fr" | "ch";
const video_per_lang = {
  ar: "https://www.youtube.com/watch?v=XFEpnmepAL0",
  fa: "https://www.youtube.com/watch?v=XFEpnmepAL0",
  es: "https://www.youtube.com/watch?v=XFEpnmepAL0",
  en: "https://www.youtube.com/watch?v=XFEpnmepAL0",
  fr: "https://www.youtube.com/watch?v=XFEpnmepAL0",
  tr: "https://www.youtube.com/watch?v=XFEpnmepAL0",
  ch: "https://www.youtube.com/watch?v=XFEpnmepAL0",
};
export const VideoHelperController = {
  getVideo: async (req: any, res: any) => {
    try {
      const symbol: LangTypes = req.query.symbol || "en";

      return res.status(200).send({
        code: 0,
        message: "",
        data: video_per_lang[symbol],
      });
    } catch (error) {
      LoggerService.error(error);
      return res.status(500).send({});
    }
  },
};

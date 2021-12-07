export interface IAssetsDetailsItem {
  assetId?: string;
  assetLogo?: {
    encoding?: string;
    imageData?: string;
    mimeType?: string;
  };
  assetName?: string;
  assetOriginalSymbol?: string;
  assetSymbol?: string;
  assetType?: string;
}
export interface ICryptoApisAssestListDetails {
  apiVersion: string;
  requestId: string;
  context: string;
  data: {
    offset: number;
    limit: number;
    total: number;
    items: IAssetsDetailsItem[];
  };
}

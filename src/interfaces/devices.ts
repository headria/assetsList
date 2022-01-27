export type NewDevice = {
  dId: string;
  token: string;
  type: "Android" | "IOS";
  networks?: Networks[];
};

export type Networks = {
  name: string;
  addresses: string[];
};

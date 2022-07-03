export type jwtPayload = {
  sub: number;
  application: string;
};

export type responseSign = {
  access_token: string;
  refresh_token: string;
};

export type signInData = {
  id: number;
  application: string;
  ipAddress: string;
  geolocation: Map<string, string>;
};

export type signOutData = {
  access_token: string;
  refresh_token?: string;
};

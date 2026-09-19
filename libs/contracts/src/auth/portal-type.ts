export enum PortalType {
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN',
}

export interface JwtSessionPayload {
  sub: string;
  sid: string;
  portal: PortalType;
  iat?: number;
  exp?: number;
}

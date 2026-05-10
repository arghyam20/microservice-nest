export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'change-this-secret',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'change-this-refresh-secret',
};

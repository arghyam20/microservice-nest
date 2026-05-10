export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-secret',
    expiresIn: process.env.JWT_EXPIRATION || '900s',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'change-this-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
  kafka: {
    enabled: process.env.KAFKA_ENABLED !== 'false',
    clientId: process.env.KAFKA_CLIENT_ID || 'microservice-nest',
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    groupId: process.env.KAFKA_GROUP_ID || 'microservice-group',
  },
});

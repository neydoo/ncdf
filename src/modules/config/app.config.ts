/**
 * This is the config hack to make it work with the nestjs config.
 *
 * The config process definitely needs more work and is worth a second look.
 *
 */
export default () => ({
  app: {
    port: process.env.PORT,
    name: process.env.APP_ID,
    email: "adedotunolawale@gmail.com"
  },
  user: process.env.user,
  jwt: {
    secret: process.env.JWT_SECRET,
    duration: process.env.TOKEN_LIFETIME as string,
  },
  kafka: {
    endpoint: 'localhost:9092',
  },
  db: {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      host: process.env.DB_HOST,
      dialect: process.env.DB_CONNECTION,
      port: process.env.DB_PORT,
      operatorsAliases: false
  },
  data: {
      limit: "50mb",
      extended: false,
  },
  mail: {
      auth: {
          api_user: process.env.MAIL_USERNAME,
          api_key: process.env.MAIL_PASSWORD,
      },
      service: process.env.MAIL_SERVICE,
      SendGrid: 'api_user',
      Mailgun: 'domain'
  },
  sms: {
      africastalking: {
          apiKey: "", //         // use your sandbox app API key for development in the test environment
          username: "", // use 'sandbox' for development in the test environment
      },
      twilio: {
          apiKey: "",
          username: "",
      },
  },
  video: {
      vimeo: {
          clientId: "",
          clientSecret: "",
          accessToken: "",
      },
  },
  pusher: {
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_APP_KEY,
      secret: process.env.PUSHER_APP_SECRET,
      cluster: process.env.PUSHER_APP_CLUSTER,
  },
  loggly: {
      token: process.env.LOGGLY_TOKEN,
      subdomain: process.env.LOGGLY_DOMAIN
  },
  nogic: {
      url: process.env.NOGIC_URL,
      key: process.env.NOGIC_KEY
  },
  remita: {
      merchantId: process.env.REMITA_MERCHANT_ID,
      serviceTypeId: process.env.REMITA_SERVICE_TYPE_ID,
      apiKey: process.env.REMITA_API_KEY,
      url: process.env.REMITA_URL
  },
  teamEmail: process.env.TEAM_EMAIL
});

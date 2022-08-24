interface IConfig {
  /** To differentiate between development and production modes */
  env: string;

  /** To define the listening port for the server */
  port: number;

  /** The secret key to be used to sign JWT */
  jwtSecret: string;

  /** The location of the MongoDB database instance for the project */
  mongoUri: string;
}

export const config: IConfig = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
  mongoUri:
    process.env.MONGODB_URI ||
    process.env.MONGO_HOST ||
    "mongodb://" +
      (process.env.IP || "localhost") +
      ":" +
      (process.env.MONGO_PORT || "27017") +
      "/mernproject",
};

const config = {
    // To differentiate between development and production modes
    env: process.env.NODE_ENV || "development",
    // To define the listening port for the server
    port: process.env.PORT || 3000,
    // The secret key to be used to sign JWT
    jwtSecret: process.env.JWT_SECRET || "YOUR_SeCrEt_Key",
    // The location of the MongoDB database instance for the project
    mongoUri:
        process.env.MONGODB_URI ||
        process.env.MONGO_HOST ||
        "mongodb://" +
            (process.env.IP || "localhost") +
            ":" +
            (process.env.MONGO_PORT || "27017") +
            "/mernproject",
};

export default config;

let config = new Object();

config = {
    app: {
        port: process.env.port,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
        GITHUB_SECRET: process.env.GITHUB_SECRET,
        JWT_SECRET: process.env.JWT_SECRET,
        REDIS_URL: process.env.REDIS_URL,
        TABLE_NAME: process.env.TABLE_NAME
    },
    aws_remote_config: {
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey,
        region: process.env.region,
      }
}

module.exports = config;
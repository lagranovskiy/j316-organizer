var config = {
    hostname: process.env.HOSTNAME || 'http://localhost:7777/', // for requests
    host: process.env.HOST || 'localhost',
    httpPort: process.env.PORT || 7777,
    env: process.env.NODE_ENV || 'dev',
    apiToken: process.env.API_TOKEN || 'local123',
    mongoDB: process.env.NEO4J_URL || 'mongodb://localhost:27017/j316notificator',
    init: function () {
        return this;
    }
};

module.exports = config.init();
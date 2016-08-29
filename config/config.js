var config = {
    hostname: process.env.HOSTNAME || 'http://localhost:7777/', // for requests
    host: process.env.IP || 'localhost',
    httpPort: process.env.PORT || 7777,
    env: process.env.NODE_ENV || 'dev',
    apiToken: process.env.API_TOKEN || 'local123',
    neo4j: process.env.NEO4J_URL || 'http://neo4j:prodyna@localhost:7474',
    init: function () {
        return this;
    }
};

module.exports = config.init();
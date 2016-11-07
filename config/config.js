var config = {
    hostname: process.env.HOSTNAME || 'http://localhost:8080/', // for requests
    host: process.env.IP || 'localhost',
    httpPort: process.env.PORT || 8080,
    env: process.env.NODE_ENV || 'dev',
    apiToken: process.env.API_TOKEN || '',
    neo4j: process.env.NEO4J_URL || 'http://neo4j:prodyna@localhost:7474',
    init: function () {
        return this;
    }
};

module.exports = config.init();

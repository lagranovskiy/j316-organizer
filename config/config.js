var config = {
    hostname: process.env.HOSTNAME || 'http://localhost:7777/', // for requests
    host: process.env.HOST || 'localhost',
    httpPort: process.env.PORT || 7777,
    env: process.env.NODE_ENV || 'dev',
    apiToken: process.env.API_TOKEN || 'local123',
    neo4j: process.env.NEO4J_URL || 'http://app44006523:vpaX6Pf9rPtagEIpSbt2@app44006523.sb04.stations.graphenedb.com:24789',
    init: function () {
        return this;
    }
};

module.exports = config.init();
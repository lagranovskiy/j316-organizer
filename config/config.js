var config = {
    hostname: process.env.HOSTNAME || 'http://localhost:8080/', // for requests
    httpPort: process.env.PORT || 8080,
    host: process.env.IP || 'localhost',
    env: process.env.NODE_ENV || 'dev',
    j316NotificatorURI: process.env.J316_NOTIFICATOR_URL || 'http://j316-notificator-test.herokuapp.com/',
    j316NotificatorAPIToken: process.env.J316_NOTIFICATOR_APIToken || 'test',
    neo4j: process.env.GRAPHENEDB_URL || 'http://neo4j:prodyna@localhost:7474',
    init: function () {
        return this;
    }
};

module.exports = config.init();

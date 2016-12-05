var config = {
    hostname: process.env.HOSTNAME || 'http://localhost:8080/', // for requests
    httpPort: process.env.PORT || 8080,
    host: process.env.IP || 'localhost',
    env: process.env.NODE_ENV || 'dev',
    j316NotificatorURI: process.env.J316_NOTIFICATOR_URL || 'http://j316-notificator-test.herokuapp.com/',
    j316NotificatorAPIToken: process.env.J316_NOTIFICATOR_APIToken || 'test',
    neo4j: process.env.GRAPHENEDB_URL || 'http://neo4j:prodyna@localhost:7474',
    auth0secret: process.env.AUTH0SECRET||'GmDvCBT5mjIIufCBPJd1B1MadWLUJGeR_lqL0bTBMIOlaL8uMTOVzILg7osm1tW-',
    auth0audience: process.env.AUTH0AUDIENCE ||'J2NTOuFFPfJTzMsbgspctEgdbZ0YGWYx',
    init: function () {
        return this;
    }
};

module.exports = config.init();

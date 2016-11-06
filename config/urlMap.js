var config = require('./config'),
    _ = require('underscore');

var urlMap = {

        person: {
            self: config.hostname + 'person/{uuid}',
            relations: {
                address: config.hostname + 'person/{uuid}/address',
                marriage: config.hostname + 'person/{uuid}/marriage',
                relatedPerson: config.hostname + 'person/{uuid}/relation',
                child: config.hostname + 'person/{uuid}/child',
                parent: config.hostname + 'person/{uuid}/parent',
                engagement: config.hostname + 'person/{uuid}/engagement',
                responsibility: config.hostname + 'person/{uuid}/responsibility',
                membership: config.hostname + 'person/{uuid}/membership'
            }
        },
        service: {
            self: config.hostname + 'service/{uuid}',
            relations: {
                parent: config.hostname + 'service/{uuid}/parent',
                engagement: config.hostname + 'service/{uuid}/engagement',
                responsibility: config.hostname + 'service/{uuid}/responsibility'
            }
        },
        organization: {
            self: config.hostname + 'organization/{uuid}',
            relations: {
                activeMember: config.hostname + 'organization/{uuid}/member/active',
                inactiveMember: config.hostname + 'organization/{uuid}/member/inactive',
                location: config.hostname + 'organization/{uuid}/location'
            }
        },
        postal: {
            self: config.hostname + 'postaladdress/{uuid}',
            relations: {}
        },
        servicePlan: {
            self: config.hostname + 'serviceplan/{uuid}',
            relations: {}
        },


        /**
         * Resolves url pararmeters from the parameter map
         * @param urlSet
         * @param parameterMap
         * @returns {*}
         */
        getUrlMap: function (urlSet, parameterMap) {
            if (!urlSet) {
                return config.hostname;
            }

            var retVal = {};
            _.map(urlSet, function (value, key) {
                if (_.isObject(value)) {
                    retVal[key] = urlMap.getUrlMap(value, parameterMap);
                } else {
                    _.each(_.allKeys(parameterMap), function (parameterName) {
                        retVal[key] = value.replace('{' + parameterName + '}', parameterMap[parameterName]);
                    })
                }

            });


            return retVal;
        }
    }
    ;

module.exports = urlMap;

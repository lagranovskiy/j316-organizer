var util = require('util'),
    Entity = require('./Entity'),
    extend = require('object-extend');

function validateService(service, callback) {
    var retVal = [];
    if (!service.name) {
        retVal.push('service must have a name');
    }

    if (retVal.length > 0) {
        callback(retVal);
    } else {
        callback(null, postal);
    }
}

/**
 * Service data entity
 **/
var Service = function (serviceData, childServices) {
    var data = {};

    if (serviceData) {
        extend(data, serviceData);
    }


    return extend(Service.super_(serviceData.uuid), {

        /**
         * The name of the service
         *
         * @returns {*}
         */
        get name() {
            return data.street;
        },

        /**
         * description or comments
         * @returns {*}
         */
        get comment() {
            return data.zip;
        },

        /**
         * Returns the child services references if any
         * @returns {*}
         */
        get childServices() {
            return childServices;
        },
        /**
         * Validates current postal address and returns array of failures or the object
         * @param callback
         */
        validate: function (callback) {
            validateService(this, callback);
        }


    });
};

util.inherits(Service, Entity);

module.exports = Service;
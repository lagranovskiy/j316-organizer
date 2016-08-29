var util = require('util'),
    Entity = require('./Entity'),
    extend = require('object-extend');

function validateService(service, callback) {
    var retVal = [];
    if (!service.name) {
        retVal.push('service must have a name');
    }

    if (retVal.length > 0) {
        return callback(retVal);
    } else {
        return callback(null, service);
    }
}

/**
 * Service data entity
 **/
var Service = function (serviceData) {
    var data = {};

    if (serviceData) {
        extend(data, serviceData);
    }


    return extend(Service.super_(data), {

        /**
         * The name of the service
         *
         * @returns {*}
         */
        get name() {
            return serviceData.name;
        },

        /**
         * description or comments
         * @returns {*}
         */
        get comment() {
            return serviceData.comment;
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
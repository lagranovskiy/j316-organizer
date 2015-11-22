var util = require('util'),
    Entity = require('./Entity'),
    urlMap = require('../../config/urlMap'),
    extend = require('object-extend');

function validatePostalAddress(postal, callback) {
    var retVal = [];
    if (!postal.street) {
        retVal.push('PostalAddress must have a street');
    }
    if (!postal.zip) {
        retVal.push('PostalAddress must have a zip');
    }

    if (!postal.city) {
        retVal.push('PostalAddress must have a city');
    }

    if (!postal.country) {
        retVal.push('PostalAddress must have a country');
    }
    if (retVal.length > 0) {
        callback(retVal);
    } else {
        callback(null, postal);
    }
}

/**
 * Person data entity
 **/
var PostalAddress = function (postalAddressData) {
    var data = {};

    if (postalAddressData) {
        extend(data, postalAddressData);
    }


    return extend(PostalAddress.super_(data), {

        /**
         * Returns the street information
         *
         * @returns {*}•
         */
        get street() {
            return data.street;
        },

        /**
         * Returns the postal zip
         * @returns {*}
         */
        get zip() {
            return data.zip;
        },

        /**
         * Returns the postal city
         * @returns {*}
         */
        get city() {
            return data.city;
        },

        /**
         * Returns the postal country
         * @returns {*}
         */
        get country() {
            return data.country;
        },

        /**
         * Returns the comment to the postal address
         * @returns {*}
         */
        get comment() {
            return data.comment;
        },

        /**
         * Validates current postal address and returns array of failures or the object
         * @param callback
         */
        validate: function (callback) {
            validatePostalAddress(this, callback);
        },

        /**
         * Returns urls to the postal address relations
         * @returns {*}
         */
        get extra() {
            if (data.uuid) {
                return urlMap.getUrlMap(urlMap.postal, {uuid: data.uuid});
            }
            return null;
        }

    });
};

util.inherits(PostalAddress, Entity);

module.exports = PostalAddress;
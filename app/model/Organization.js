var util = require('util'),
    Entity = require('./Entity'),
    extend = require('object-extend');

function validateOrganization(organization, callback) {
    var retVal = [];
    if (!organization.organizationName) {
        retVal.push('Organization must have a name');
    }

    if (retVal.length > 0) {
        callback(retVal);
    } else {
        callback(null, organization);
    }
}

/**
 * Person data entity
 **/
var Organization = function (oraganizationData) {
    var data = {};

    if (oraganizationData) {
        extend(data, oraganizationData);
    }


    return extend(Organization.super_(data), {

        /**
         * Returns the organizationName
         *
         * @returns {*}
         */
        get organizationName() {
            return data.organizationName;
        },

        /**
         * Returns the contact infos of organization
         * @returns {*}
         */
        get contactInfo() {
            return data.contactInfo;
        },

        /**
         * Returns the finance Info of organization
         * @returns {*}
         */
        get financeInfo() {
            return data.financeInfo;
        },


        /**
         * Returns the comment to the organization
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
            validateOrganization(this, callback);
        }


    });
};

util.inherits(PostalAddress, Entity);

module.exports = Person;
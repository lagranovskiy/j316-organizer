var util = require('util'),
    Relation = require('./Relation'),
    urlMap = require('../../config/urlMap'),
    extend = require('object-extend');


/**
 * PersonIsResponsibleForService relation entity
 **/
var PersonIsResponsibleForService = function (relationData, ref) {

    var data = {};

    if (relationData) {
        extend(data, relationData);
    }

    return extend(PersonIsResponsibleForService.super_(relationData.uuid, ref), {

        /**
         * Indicates the date the member is active since
         * @returns {*}
         */
        get functionName() {
            return data.functionName;
        },

        /**
         * Date since the person is responsible for the service
         * @returns {*}
         */
        get responsibleSince() {
            return data.responsibleSince;
        },

        /**
         * Comment
         * @returns {*}
         */
        get comment() {
            return data.comment;
        }

    });
};

util.inherits(PersonIsResponsibleForService, Relation);

module.exports = PersonIsResponsibleForService;
var util = require('util'),
    Relation = require('./Relation'),
    urlMap = require('../../config/urlMap'),
    extend = require('object-extend');


/**
 * PersonIsRelatedTo relation entity
 **/
var PersonIsRelatedTo = function (relationData, ref) {

    var data = {};

    if (relationData) {
        extend(data, relationData);
    }

    return extend(PersonIsRelatedTo.super_(relationData.uuid, ref), {

        /**
         * Indicates the date the member is active since
         * @returns {*}
         */
        get relationInfo() {
            return data.relationInfo;
        }

    });
};

util.inherits(PersonIsRelatedTo, Relation);

module.exports = PersonIsRelatedTo;
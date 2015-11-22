var util = require('util'),
    Relation = require('./Relation'),
    urlMap = require('../../config/urlMap'),
    extend = require('object-extend');


/**
 * PersonIsMarriedWith relation entity
 **/
var PersonIsMarriedWith = function (relationData, ref) {

    var data = {};

    if (relationData) {
        extend(data, relationData);
    }

    return extend(PersonIsMarriedWith.super_(relationData.uuid, ref), {

        /**
         * Indicates the date the person married
         * @returns {*}
         */
        get marriedDate() {
            return data.marriedDate;
        }

    });
};

util.inherits(PersonIsMarriedWith, Relation);

module.exports = PersonIsMarriedWith;
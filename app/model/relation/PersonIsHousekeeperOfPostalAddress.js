var util = require('util'),
    Relation = require('./Relation'),
    urlMap = require('../../config/urlMap'),
    extend = require('object-extend');


/**
 * PersonIsHousekeeperOfPostalAddress relation entity
 **/
var PersonIsHousekeeperOfPostalAddress = function (relationData, ref) {

    var data = {};

    if (relationData) {
        extend(data, relationData);
    }

    return extend(PersonIsHousekeeperOfPostalAddress.super_(relationData.uuid, ref), {


    });
};

util.inherits(PersonIsHousekeeperOfPostalAddress, Relation);

module.exports = PersonIsHousekeeperOfPostalAddress;
var util = require('util'),
    Relation = require('./Relation'),
    urlMap = require('../../config/urlMap'),
    extend = require('object-extend');


/**
 * OrganizationHasLocation relation entity
 **/
var OrganizationHasLocation = function (relationData, ref) {

    var data = {};

    if (relationData) {
        extend(data, relationData);
    }

    return extend(OrganizationHasLocation.super_(relationData.uuid, ref), {



    });
};

util.inherits(OrganizationHasLocation, Relation);

module.exports = OrganizationHasLocation;
var util = require('util'),
    Relation = require('./Relation'),
    urlMap = require('../../config/urlMap'),
    extend = require('object-extend');


/**
 * OrganizationProvidesService relation entity
 **/
var OrganizationProvidesService = function (relationData, ref) {

    var data = {};

    if (relationData) {
        extend(data, relationData);
    }

    return extend(OrganizationProvidesService.super_(relationData.uuid, ref), {



    });
};

util.inherits(OrganizationProvidesService, Relation);

module.exports = OrganizationProvidesService;
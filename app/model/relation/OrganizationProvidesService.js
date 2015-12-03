var util = require('util'),
    Relation = require('./Relation'),
    urlMap = require('../../config/urlMap'),
    extend = require('object-extend');

var relationMap = require('../../config/relationMap');

/**
 * OrganizationProvidesService relation entity
 *
 * Relation (Organization)-[PROVIDES_SERVICE]->(Service)
 *
 * Represents an a services provided by the organization
 *
 * @param organizationUUID uuid of the organization
 * @param relationData data to be stored on relation
 * @param ref referenced object if any
 * @returns {*}
 * @constructor
 * */
var OrganizationProvidesService = function (organizationUUID, relationData, ref) {

    var data = {};

    if (relationData) {
        extend(data, relationData);
    }

    return extend(OrganizationProvidesService.super_(
            data,
            ref,
            relationMap.objects.Organization,
            relationMap.relations.Organization.PROVIDES_SERVICE,
            relationMap.objects.Service,
            organizationUUID,
            null,
            false,
            true),
        {

            // Nothing defined yet
        });
};

util.inherits(OrganizationProvidesService, Relation);

module.exports = OrganizationProvidesService;
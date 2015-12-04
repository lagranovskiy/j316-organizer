var util = require('util'),
    Relation = require('./Relation'),
    extend = require('object-extend');
var relationMap = require('../../../config/relationMap');


/**
 * OrganizationHasLocation relation entity
 *
 * Relation (Organization)-[HAS_LOCATION]->(PostalAddress)
 *
 * Represents an a postal address of organization
 *
 * @param organizationUUID uuid of the organization
 * @param relationData data to be stored on relation
 * @param ref referenced object if any
 * @returns {*}
 * @constructor
 **/
var OrganizationHasLocation = function (organizationUUID, relationData, ref) {

    var data = {};

    if (relationData) {
        extend(data, relationData);
    }

    return extend(OrganizationHasLocation.super_(
            data,
            ref,
            relationMap.objects.Organization,
            relationMap.relations.Organization.HAS_LOCATION,
            relationMap.objects.PostalAddress,
            organizationUUID,
            null,
            false,
            true),
        {

            // Nothing to define yet

        });
};

util.inherits(OrganizationHasLocation, Relation);

module.exports = OrganizationHasLocation;
var util = require('util'),
    Relation = require('./Relation'),
    urlMap = require('../../config/urlMap'),
    extend = require('object-extend');
var relationMap = require('../../config/relationMap');


/**
 * OrganizationActiveMember.
 *
 * Relation (Organization)-[HAS_ACTIVE_MEMBER]->(Person)
 *
 * Represents an active member of the organization
 *
 * @param organizationUUID uuid of the organization
 * @param relationData data to be stored on relation
 * @param ref referenced object if any
 * @returns {*}
 * @constructor
 **/
var OrganizationActiveMember = function (organizationUUID, relationData, ref) {

    var data = {};

    if (relationData) {
        extend(data, relationData);
    }

    return extend(OrganizationActiveMember.super_(
            data,
            ref,
            relationMap.objects.Organization,
            relationMap.relations.Organization.HAS_ACTIVE_MEMBER,
            relationMap.objects.Person,
            organizationUUID,
            null,
            false,
            true),
        {

            /**
             * Indicates the date the member is active since
             * @returns {*}
             */
            get activeSince() {
                return data.activeSince;
            }

        });
};

util.inherits(OrganizationActiveMember, Relation);

module.exports = OrganizationActiveMember;
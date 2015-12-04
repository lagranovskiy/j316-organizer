var util = require('util'),
    Relation = require('./Relation'),
    extend = require('object-extend');

var relationMap = require('../../../config/relationMap');

/**
 * OrganizationInactiveMember relation entity
 *
 * Relation (Organization)-[HAS_INACTIVE_MEMBER]->(Person)
 *
 * Represents an inactive member of the organization
 *
 * @param organizationUUID uuid of the organization
 * @param relationData data to be stored on relation
 * @param ref referenced object if any
 * @returns {*}
 * @constructor
 */
var OrganizationInactiveMember = function (organizationUUID, relationData, ref) {

    var data = {};

    if (relationData) {
        extend(data, relationData);
    }

    return extend(OrganizationInactiveMember.super_(
            data,
            ref,
            relationMap.objects.Organization,
            relationMap.relations.Organization.HAS_INACTIVE_MEMBER,
            relationMap.objects.Person,
            organizationUUID,
            null,
            false,
            true),
        {

            /**
             * Indicates the date the member is inactive since
             * @returns {*}
             */
            get inactiveSince() {
                return data.inactiveSince;
            }

        });
};

util.inherits(OrganizationInactiveMember, Relation);

module.exports = OrganizationInactiveMember;
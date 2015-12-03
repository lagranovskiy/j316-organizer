var util = require('util'),
    Relation = require('./Relation'),
    urlMap = require('../../config/urlMap'),
    extend = require('object-extend');
var relationMap = require('../../config/relationMap');

/**
 * PersonMemberOfOrganization.
 *
 * Relation (Organization)-[HAS_ACTIVE_MEMBER]->(Person)
 *
 * Represents organizations where the Person is active member
 *
 * @param personUUID person uuid to get active memeberships of
 * @param relationData relation data
 * @param ref referenced object
 * @returns {*}
 * @constructor
 */
var PersonMemberOfOrganization = function (personUUID, relationData, ref) {

    var data = {};

    if (relationData) {
        extend(data, relationData);
    }

    return extend(PersonMemberOfOrganization.super_(
            data,
            ref,
            relationMap.objects.Organization,
            relationMap.relations.Organization.HAS_ACTIVE_MEMBER,
            relationMap.objects.Person,
            null,
            personUUID,
            false,
            false),
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

util.inherits(PersonMemberOfOrganization, Relation);

module.exports = PersonMemberOfOrganization;
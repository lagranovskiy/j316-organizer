var util = require('util'),
    Relation = require('./Relation'),
    urlMap = require('../../config/urlMap'),
    extend = require('object-extend');


/**
 * OrganizationInactiveMember relation entity
 **/
var OrganizationInactiveMember = function (relationData, ref) {

    var data = {};

    if (relationData) {
        extend(data, relationData);
    }

    return extend(OrganizationInactiveMember.super_(relationData.uuid, ref), {

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
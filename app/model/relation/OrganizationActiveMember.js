var util = require('util'),
    Relation = require('./Relation'),
    urlMap = require('../../config/urlMap'),
    extend = require('object-extend');


/**
 * OrganizationActiveMember relation entity
 **/
var OrganizationActiveMember = function (relationData, ref) {

    var data = {};

    if (relationData) {
        extend(data, relationData);
    }

    return extend(OrganizationActiveMember.super_(relationData.uuid, ref), {

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
var util = require('util'),
    Relation = require('./Relation'),
    urlMap = require('../../config/urlMap'),
    extend = require('object-extend');


/**
 * PersonParticipateInService relation entity
 **/
var PersonParticipateInService = function (relationData, ref) {

    var data = {};

    if (relationData) {
        extend(data, relationData);
    }

    return extend(PersonParticipateInService.super_(relationData.uuid, ref), {

        /**
         * Comment
         * @returns {*}
         */
        get comment() {
            return data.comment;
        }

    });
};

util.inherits(PersonParticipateInService, Relation);

module.exports = PersonParticipateInService;
var util = require('util'),
    Relation = require('./Relation'),
    urlMap = require('../../config/urlMap'),
    extend = require('object-extend');
var relationMap = require('../../config/relationMap');


/**
 * Relation (Person)-[PARTICIPATE_IN]->(Service)
 *
 * Represents person services he participates in
 *
 * @param personUUID uuid of the person to get participations of
 * @param relationData relationData data to be stored on relation
 * @param ref ref referenced object if any
 * @returns {*}
 * @constructor
 */
var PersonParticipateInService = function (personUUID, relationData, ref) {

    var data = {};

    if (relationData) {
        extend(data, relationData);
    }

    return extend(PersonParticipateInService.super_(
            data,
            ref,
            relationMap.objects.Person,
            relationMap.relations.Person.PARTICIPATE_IN,
            relationMap.objects.Service,
            personUUID,
            null,
            false,
            true),
        {

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
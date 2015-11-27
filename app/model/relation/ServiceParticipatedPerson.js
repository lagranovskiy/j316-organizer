var util = require('util'),
    Relation = require('./Relation'),
    urlMap = require('../../config/urlMap'),
    extend = require('object-extend');
var relationMap = require('../../config/relationMap');


/**
 * Relation (Person)-[PARTICIPATE_IN]->(Service)
 *
 * Represents service's persons who participate
 *
 * @param serviceUUID uuid of the service to get participants of
 * @param relationData relationData data to be stored on relation
 * @param ref ref referenced object if any
 * @returns {*}
 * @constructor
 */
var ServiceParticipatedPerson = function (serviceUUID, relationData, ref) {

    var data = {};

    if (relationData) {
        extend(data, relationData);
    }

    return extend(ServiceParticipatedPerson.super_(
            data,
            ref,
            relationMap.objects.Person,
            relationMap.relations.Person.PARTICIPATE_IN,
            relationMap.objects.Service,
            null,
            serviceUUID,
            false),
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

util.inherits(ServiceParticipatedPerson, Relation);

module.exports = ServiceParticipatedPerson;
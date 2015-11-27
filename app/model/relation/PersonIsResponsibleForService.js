var util = require('util'),
    Relation = require('./Relation'),
    urlMap = require('../../config/urlMap'),
    extend = require('object-extend');

var relationMap = require('../../config/relationMap');

/**
 * Relation (Person)-[IS_RESPONSIBLE_FOR]->(Service)
 *
 * Represents person service responsibilities
 *
 *
 * @param personUUID uuid of the person to get responsibilities of
 * @param relationData relationData data to be stored on relation
 * @param ref ref referenced object if any
 * @returns {*}
 * @constructor
 */
var PersonIsResponsibleForService = function (personUUID, relationData, ref) {

    var data = {};

    if (relationData) {
        extend(data, relationData);
    }

    return extend(PersonIsResponsibleForService.super_(
            data,
            ref,
            relationMap.objects.Person,
            relationMap.relations.Person.IS_RESPONSIBLE_FOR,
            relationMap.objects.Service,
            personUUID,
            null,
            false
        ),
        {

            /**
             * Indicates the date the member is active since
             * @returns {*}
             */
            get functionName() {
                return data.functionName;
            },

            /**
             * Date since the person is responsible for the service
             * @returns {*}
             */
            get responsibleSince() {
                return data.responsibleSince;
            },

            /**
             * Comment
             * @returns {*}
             */
            get comment() {
                return data.comment;
            }

        });
};

util.inherits(PersonIsResponsibleForService, Relation);

module.exports = PersonIsResponsibleForService;
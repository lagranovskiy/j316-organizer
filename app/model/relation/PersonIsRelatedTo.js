var util = require('util'),
    Relation = require('./Relation'),
    urlMap = require('../../config/urlMap'),
    extend = require('object-extend');

var relationMap = require('../../config/relationMap');

/**
 * Relation (Person)-[IS_RELATED_TO]->(Person)
 *
 * Represents person related persons
 *
 * Relation is bidirectional! Special case.
 *
 * @param personUUID uuid of the person to get its married with person
 * @param relationData relationData data to be stored on relation
 * @param ref ref referenced object if any
 * @returns {*}
 * @constructor
 */
var PersonIsRelatedTo = function (personUUID, relationData, ref) {

    var data = {};

    if (relationData) {
        extend(data, relationData);
    }

    return extend(PersonIsRelatedTo.super_(
            data,
            ref,
            relationMap.objects.Person,
            relationMap.relations.Person.IS_RELATED_TO,
            relationMap.objects.Person,
            personUUID,
            null,
            true,
            true
        ),
        {

            /**
             * Indicates the date the member is active since
             * @returns {*}
             */
            get relationInfo() {
                return data.relationInfo;
            }

        });
};

util.inherits(PersonIsRelatedTo, Relation);

module.exports = PersonIsRelatedTo;
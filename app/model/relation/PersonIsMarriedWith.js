var util = require('util'),
    Relation = require('./Relation'),
    urlMap = require('../../config/urlMap'),
    extend = require('object-extend');

var relationMap = require('../../config/relationMap');

/**
 * Relation (Person)-[IS_MARRIED_WITH]->(Person)
 *
 * Represents person partner who it is married with.
 * Relation is bidirectional! Special case.
 *
 * @param personUUID uuid of the person to get its married with person
 * @param relationData relationData data to be stored on relation
 * @param ref ref referenced object if any
 * @returns {*}
 * @constructor
 */
var PersonIsMarriedWith = function (personUUID, relationData, ref) {

    var data = {};

    if (relationData) {
        extend(data, relationData);
    }

    return extend(PersonIsMarriedWith.super_(
        relationData.uuid,
        ref,
        relationMap.objects.Person,
        relationMap.relations.Person.IS_MARRIED_WITH,
        relationMap.objects.Person,
        personUUID,
        null), {

        // TODO: Undirected relation. Add logic!!

        /**
         * Indicates the date the person married
         * @returns {*}
         */
        get marriedDate() {
            return data.marriedDate;
        }

    });
};

util.inherits(PersonIsMarriedWith, Relation);

module.exports = PersonIsMarriedWith;
var util = require('util'),
    Relation = require('./Relation'),
    urlMap = require('../../config/urlMap'),
    extend = require('object-extend');

var relationMap = require('../../config/relationMap');

/**
 * Relation (Person)-[HAS_CHILD]->(Person)
 *
 * Represents parents of a person
 *
 * @param personUUID uuid of the person to get parent of
 * @param relationData relationData data to be stored on relation
 * @param ref ref referenced object if any
 * @returns {*}
 * @constructor
 */
var PersonHasParent = function (personUUID, relationData, ref) {

    var data = {};

    if (relationData) {
        extend(data, relationData);
    }

    return extend(PersonHasParent.super_(
            data,
            ref,
            relationMap.objects.Person,
            relationMap.relations.Person.HAS_CHILD,
            relationMap.objects.Person,
            null,
            personUUID,
            false),
        {

            // Nothing defined yet
        });
};

util.inherits(PersonHasParent, Relation);

module.exports = PersonHasParent;
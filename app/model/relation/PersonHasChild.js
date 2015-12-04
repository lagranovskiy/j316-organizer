var util = require('util'),
    Relation = require('./Relation'),
    extend = require('object-extend');

var relationMap = require('../../../config/relationMap');

/**
 * Relation (Person)-[HAS_CHILD]->(Person)
 *
 * Represents children of a person
 *
 * @param personUUID uuid of the person to get children of
 * @param relationData relationData data to be stored on relation
 * @param ref ref referenced object if any
 * @returns {*}
 * @constructor
 */
var PersonHasChild = function (personUUID, relationData, ref) {

    var data = {};

    if (relationData) {
        extend(data, relationData);
    }

    return extend(PersonHasChild.super_(
            data,
            ref,
            relationMap.objects.Person,
            relationMap.relations.Person.HAS_CHILD,
            relationMap.objects.Person,
            personUUID,
            null,
            false,
            true),
        {

            // Nothing defined yet
        });
};

util.inherits(PersonHasChild, Relation);

module.exports = PersonHasChild;
var util = require('util'),
    Relation = require('./Relation'),
    urlMap = require('../../config/urlMap'),
    extend = require('object-extend');

var relationMap = require('../../config/relationMap');

/**
 * Relation (Person)-[HOUSEKEEPER_OF]->(PostalAddress)
 *
 * Represents postal address where person is the housekeeper
 *
 * @param personUUID uuid of the person to get postal addresses of
 * @param relationData relationData data to be stored on relation
 * @param ref ref referenced object if any
 * @returns {*}
 * @constructor
 */
var PersonIsHousekeeperOfPostalAddress = function (personUUID, relationData, ref) {

    var data = {};

    if (relationData) {
        extend(data, relationData);
    }

    return extend(PersonIsHousekeeperOfPostalAddress.super_(
            data,
            ref,
            relationMap.objects.Person,
            relationMap.relations.Person.HOUSEKEEPER_OF,
            relationMap.objects.PostalAddress,
            personUUID,
            null,
            false,
            true),
        {

            // Nothing defined yet
        });
};

util.inherits(PersonIsHousekeeperOfPostalAddress, Relation);

module.exports = PersonIsHousekeeperOfPostalAddress;
var util = require('util'),
    Relation = require('./Relation'),
    urlMap = require('../../config/urlMap'),
    extend = require('object-extend');


/**
 * PersonHasChild relation entity
 **/
var PersonHasChild = function (relationData, ref) {

    var data = {};

    if (relationData) {
        extend(data, relationData);
    }

    return extend(PersonHasChild.super_(relationData.uuid, ref), {



    });
};

util.inherits(PersonHasChild, Relation);

module.exports = PersonHasChild;
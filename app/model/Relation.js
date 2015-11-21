var util = require('util'),
    Entity = require('./Entity'),
    urlMap = require('../../config/urlMap'),
    extend = require('object-extend');


/**
 * Person data entity
 **/
var Relation = function (personData) {
    var data = {};


    return extend(Relation.super_(personData.uuid), {

        get owner() {

        },

        get relatedUUID() {

        },

        get resolveURL() {

        },

        get type() {

        }

    });
};

util.inherits(Relation, Entity);

module.exports = Relation;
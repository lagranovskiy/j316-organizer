var CrudRepository = require('../model/CrudRepository');
var crudRepository = new CrudRepository();
var Person = require('../model/Person');
var uuid = require('node-uuid');
var _ = require('underscore');
var relationMap = require('../../config/relationMap');

/**
 * Controller to provide person crud functionality
 * @constructor
 */
var PersonController = function () {

    var controller = {


    };

    return controller;
};
module.exports = new PersonController();
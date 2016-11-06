var CrudRepository = require('../../model/CrudRepository');
var crudRepository = new CrudRepository();
var Service = require('../../model/Service');
var uuid = require('node-uuid');
var _ = require('underscore');
var relationMap = require('../../../config/relationMap');
/**
 * Controller to provide service crud functionality
 * @constructor
 */
var ServiceController = function () {

    var controller = {

    };

    return controller;
};
module.exports = new ServiceController();
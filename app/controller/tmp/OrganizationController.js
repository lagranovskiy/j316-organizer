var CrudRepository = require('../../model/CrudRepository');
var crudRepository = new CrudRepository();
var Organization = require('../../model/Organization');
var uuid = require('node-uuid');
var relationMap = require('../../../config/relationMap');
var _ = require('underscore');

/**
 * Controller to provide Organization crud functionality
 * @constructor
 */
var OrganizationController = function () {

    var controller = {


    };

    return controller;
};
module.exports = new OrganizationController();
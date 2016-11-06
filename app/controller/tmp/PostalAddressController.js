var CrudRepository = require('../../model/CrudRepository');
var crudRepository = new CrudRepository();
var PostalAddress = require('../../model/PostalAddress');
var uuid = require('node-uuid');
var _ = require('underscore');
var relationMap = require('../../../config/relationMap');

/**
 * Controller to provide postal address crud functionality
 * @constructor
 */
var PersonController = function () {

    var controller = {


    };

    return controller;
};
module.exports = new PersonController();
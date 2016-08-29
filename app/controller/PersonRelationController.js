var _ = require('underscore'),
    async = require('neo-async');
var crudRepository = require('../model/CrudRelationRepository');
var relationMap = require('../../config/relationMap');
var PersonHasChild = require('../model/relation/PersonHasChild');
var PersonHasParent = require('../model/relation/PersonHasParent');
var PersonIsHousekeeperOfPostalAddress = require('../model/relation/PersonIsHousekeeperOfPostalAddress');
var PersonIsMarriedWith = require('../model/relation/PersonIsMarriedWith');
var PersonIsRelatedTo = require('../model/relation/PersonIsRelatedTo');
var PersonIsResponsibleForService = require('../model/relation/PersonIsResponsibleForService');
var PersonMemberOfOrganization = require('../model/relation/PersonMemberOfOrganization');
var PersonParticipateInService = require('../model/relation/PersonParticipateInService');


/**
 * Controller to provide person relation crud functionality
 * @constructor
 */
var PersonRelationController = function () {

    var controller = {
    };

    return controller;
};
module.exports = new PersonRelationController();
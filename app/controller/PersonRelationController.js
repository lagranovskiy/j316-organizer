var _ = require('underscore'),
    async = require('neo-async');
var repository = require('../model/CrudRelationRepository');
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

        /**
         * Returns the whole list of person relations
         * @param req
         * @param res
         * @param next
         */
        getPersonRelations: function (req, res, next) {

            var personUUID = req.params.uuid;

            if (!personUUID) {
                return next('Error. uuid is empty');
            }
            next.send('Not ready yet.');

        },


        /**
         * Resolves children of the given person
         * @param req
         * @param res
         * @param next
         */
        getPersonHasChild: function (req, res, next) {
            var personUUID = req.params.uuid;

            if (!personUUID) {
                return next('Error. uuid is empty');
            }

            var relation = new PersonHasChild(personUUID);

            async.waterfall([
                function (callback) {
                    repository.getRelated(relation, callback);
                },
                function (relatedRelations, callback) {
                    var retVal = [];

                    _.each(relatedRelations, function (relationDef) {
                        retVal.push(new PersonHasChild(relationDef.source.uuid, relationDef.relation, relationDef.target))
                    });

                    callback(null, retVal);
                }
            ], function (err, retVal) {
                if (err) {
                    console.error('Cannot resolve ' + relation.getMetaInfo().relationType + '. ' + err);
                    return next(err);
                }
                console.info('Request of ' + relation.getMetaInfo().relationType + ' for Person ' + personUUID + ' successful. ' + retVal.length + ' relations found');
                next(null, retVal);
            });


            next.send('Not ready yet.');
        },


        /**
         * Resolves Parents of the given person
         * @param req
         * @param res
         * @param next
         */
        getPersonHasParent: function (req, res, next) {
            var personUUID = req.params.uuid;

            if (!personUUID) {
                return next('Error. uuid is empty');
            }
            next.send('Not ready yet.');
        },

        /**
         * Resolves postal addressen of the given person
         * @param req
         * @param res
         * @param next
         */
        getPersonIsHousekeeperOfPostalAddress: function (req, res, next) {
            var personUUID = req.params.uuid;

            if (!personUUID) {
                return next('Error. uuid is empty');
            }
            next.send('Not ready yet.');
        },

        /**
         * Resolves marriage partner of the given person
         * @param req
         * @param res
         * @param next
         */
        getPersonIsMarriedWith: function (req, res, next) {
            var personUUID = req.params.uuid;

            if (!personUUID) {
                return next('Error. uuid is empty');
            }
            next.send('Not ready yet.');
        },

        /**
         * Resolves related person of the given person
         * @param req
         * @param res
         * @param next
         */
        getPersonIsRelatedTo: function (req, res, next) {
            var personUUID = req.params.uuid;

            if (!personUUID) {
                return next('Error. uuid is empty');
            }
            next.send('Not ready yet.');
        },

        /**
         * Resolves Services the person is responsible for
         * @param req
         * @param res
         * @param next
         */
        getPersonIsResponsibleForService: function (req, res, next) {
            var personUUID = req.params.uuid;

            if (!personUUID) {
                return next('Error. uuid is empty');
            }
            next.send('Not ready yet.');
        },

        /**
         * Resolves Organizations of the given person
         * @param req
         * @param res
         * @param next
         */
        getPersonMemberOfOrganization: function (req, res, next) {
            var personUUID = req.params.uuid;

            if (!personUUID) {
                return next('Error. uuid is empty');
            }
            next.send('Not ready yet.');
        },

        /**
         * Resolves currently participated services of the given person
         * @param req
         * @param res
         * @param next
         */
        getPersonParticipateInService: function (req, res, next) {
            var personUUID = req.params.uuid;

            if (!personUUID) {
                return next('Error. uuid is empty');
            }
            next.send('Not ready yet.');
        }


    };

    return controller;
};
module.exports = new PersonRelationController();
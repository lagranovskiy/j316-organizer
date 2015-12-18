var uuid = require('node-uuid');
var _ = require('underscore');
var async = require('neo-async');
var relationMap = require('../../config/relationMap');
var CrudRelationRepository = require('../model/CrudRelationRepository');
var crudRelationRepository = new CrudRelationRepository();

/**
 * Crud Relation Controller is a factory to produce crud methods for business entity relations

 * @author Leonid Agranovskiy
 * @date  03.12.15.
 */


var CrudRelationControllerFactory = {
        /**
         * Constructor for the method to retrieve entity relations
         * @param relationType name of the relation type to provide crud for
         */
        getRelationCRUD: function (relationType) {

            var RelationWrapper = require('../model/relation/' + relationType);

            var controller = {


                /**
                 * Method to return Relation of given type with given source uuid
                 * @param req
                 * @param res
                 * @param next
                 */
                getRelatedRelations: function (req, res, next) {
                    var relationSourceUUID = req.params.uuid;

                    if (!relationSourceUUID) {
                        return next('Error. UUID of relation source is empty');
                    }

                    console.info('Resolving relations of type ' + relationType + ' of uuid: ' + relationSourceUUID);
                    var relation = new RelationWrapper(relationSourceUUID);

                    var referenceTargetType = relation.getMetaInfo().referenceTargetType;
                    /**
                     * referenceTargetType = true means that the target of relation is a ref of the wrapper, else the source is the ref
                     */

                    async.waterfall([
                        function (callback) {
                            crudRelationRepository.getRelated(relation, callback);
                        },
                        function (relatedRelations, callback) {
                            var retVal = [];

                            _.each(relatedRelations, function (relationDef) {
                                // rotate relation response if needed by the relation definition
                                var relRef = relationDef.target;
                                var relSourceUUID = relationDef.source.uuid;
                                if (referenceTargetType === false) {
                                    relRef = relationDef.source;
                                    relSourceUUID = relationDef.target.uuid;
                                }

                                retVal.push(new RelationWrapper(relSourceUUID, relationDef.relation, relRef))
                            });

                            return callback(null, retVal);
                        }
                    ], function (err, retVal) {
                        if (err) {
                            console.error('Cannot resolve ' + relation.getMetaInfo().relationType + '. ' + err);
                            return next(err);
                        }
                        console.info('Request of ' + relation.getMetaInfo().relationType + ' for ' + relation.getMetaInfo().sourceType + ' ' + relationSourceUUID + ' successful. ' + retVal.length + ' relations found');
                        next(null, retVal);
                    });

                },

                /**
                 * Process relation saving
                 * @param req request
                 * @param res response
                 * @param next callback
                 * @returns {*}
                 */
                saveRelation: function (req, res, next) {
                    var relationSourceUUID = req.params.uuid;

                    if (!relationSourceUUID) {
                        return next('Error. UUID of relation source is empty');
                    }

                    var relationWrapperData = req.body;
                    if (!relationWrapperData) {
                        return next('Error. No ' + relationType + '. data is empty');
                    }
                    if (!relationWrapperData.ref) {
                        return next('Error. No ' + relationType + ' target set. Cannot save/create relation.');
                    }
                    console.info('Saving ' + relationType + ' with source uuid: ' + relationSourceUUID);

                    var relRef = relationWrapperData.ref;
                    var relData = _.omit(relationWrapperData, ['ref', 'deleted', 'isDeleted']);
                    var relSourceID = relationSourceUUID;

                    if (!relData.relationUUID) {
                        relData.relationUUID = uuid.v4();
                        console.info('Creating a new ' + relationType + ' with uuid: ' + relData.relationUUID);
                    } else {
                        console.info('Saving ' + relationType + ' with uuid: ' + relData.relationUUID);
                    }

                    var relation = new RelationWrapper(relSourceID, relData, relRef);
                    var referenceTargetType = relation.getMetaInfo().referenceTargetType;

                    async.waterfall([
                        function (callback) {
                            crudRelationRepository.saveRelation(relation, callback);
                        },
                        function (savedRelation, callback) {

                            // rotate relation response if needed by the relation definition
                            var relRef = savedRelation.target;
                            var relSourceUUID = savedRelation.source.uuid;
                            if (referenceTargetType === false) {
                                relRef = savedRelation.source;
                                relSourceUUID = savedRelation.target.uuid;
                            }

                            var savedRelationWrapper = new RelationWrapper(relSourceUUID, savedRelation.relation, relRef);

                            return callback(null, savedRelationWrapper);
                        }
                    ], function (err, retVal) {
                        if (err) {
                            console.error('Cannot save ' + relation.getMetaInfo().relationType + '. ' + err);
                            return next(err);
                        }
                        console.info('Request for saving of ' + relation.getMetaInfo().relationType + ' for ' + relation.getMetaInfo().sourceType + ' ' + relationSourceUUID + ' successful. ' + retVal.length + ' relations saved');
                        next(null, retVal);
                    });

                },


                /**
                 * Removes existing Relation by given relationUUID
                 *
                 * @param req
                 * @param res
                 * @param next
                 */
                deleteRelation: function (req, res, next) {
                    var relationSourceUUID = req.params.uuid;
                    var relationUUID = req.params.relationUUID;

                    if (!relationSourceUUID) {
                        return next('Error. UUID of relation source is empty');
                    }

                    if (!relationUUID) {
                        return next('Error. UUID of relation is empty');
                    }

                    console.info('Deleting ' + relationType + ' with uuid: ' + relationUUID);

                    var relation = new RelationWrapper(relationSourceUUID, {relationUUID: relationUUID});
                    var referenceTargetType = relation.getMetaInfo().referenceTargetType;

                    async.waterfall([
                        function (callback) {
                            crudRelationRepository.deleteRelation(relation, callback);
                        },
                        function (deletedRelation, callback) {

                            // rotate relation response if needed by the relation definition
                            var relRef = deletedRelation.target;
                            var relSourceUUID = deletedRelation.source.uuid;
                            if (referenceTargetType === false) {
                                relRef = deletedRelation.source;
                                relSourceUUID = deletedRelation.target.uuid;
                            }

                            var deletedRelationWrapper = new RelationWrapper(relSourceUUID, deletedRelation.relation, relRef);

                            return callback(null, deletedRelationWrapper);
                        }
                    ], function (err, retVal) {
                        if (err) {
                            console.error('Cannot delete relation ' + relation.getMetaInfo().relationType + '. ' + err);
                            return next(err);
                        }
                        console.info('Request for delete of relation ' + relation.getMetaInfo().relationType + ' for ' + relation.getMetaInfo().sourceType + ' ' + relationSourceUUID + ' successful. ' + retVal.length + ' relations deleted');
                        next(null, retVal);
                    });
                }
            };

            return controller;

        }
    }
    ;


module.exports = CrudRelationControllerFactory;
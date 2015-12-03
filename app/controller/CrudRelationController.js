var uuid = require('node-uuid');
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

                            callback(null, retVal);
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



                    var relRef = relationWrapperData.ref;
                    var relData = _.omit(relationWrapperData, ['ref', 'relationUUID', 'deleted', 'isDeleted']);
                    var relSourceID = relationSourceUUID;


                    var relation = new RelationWrapper(relSourceID, relData, relRef);


                    if (!entityData.uuid) {
                        entityData.uuid = uuid.v1();
                        console.info('Creating a new ' + entityType + ' with uuid: ' + entityData.uuid);
                    } else {
                        console.info('Saving ' + entityType + ' with uuid: ' + entityData.uuid);
                    }
                    /**
                     * referenceTargetType = true means that the target of relation is a ref of the wrapper, else the source is the ref
                     */

                },


                /**
                 * Saves given entity
                 *
                 * @param req request
                 * @param res response
                 * @param next next callback
                 */
                /**  saveRelation: function (req, res, next) {

                    var entityData = req.body;

                    if (!entityData) {
                        return next('Error. No ' + entityType + ' data is empty');
                    }


                    if (!entityData.uuid) {
                        entityData.uuid = uuid.v1();
                        console.info('Creating a new ' + entityType + ' with uuid: ' + entityData.uuid);
                    } else {
                        console.info('Saving ' + entityType + ' with uuid: ' + entityData.uuid);
                    }

                    var entityWrapper = new EntityWrapper(entityData);


                    var handleValidatedEntity = function (err, validatedEntityWrapper) {
                        if (err) {
                            return next(err);
                        }
                        console.info(entityType + ' with uuid: ' + validatedEntityWrapper.uuid + ' is validated successfully. Continue with saving.');

                        crudRepository.saveEntity(entityType, validatedEntityWrapper, function (err, data) {
                            if (err) {
                                return next(err);
                            }

                            var savedEntityWrapper = new EntityWrapper(data);
                            return res.send(savedEntityWrapper);

                        });
                    };


                    if (!entityWrapper.validate) {
                        console.error('Skipping validation of entity type ' + entityType + ' no validator method (validate()) defined.');
                        handleValidatedEntity(null, entityWrapper);
                    } else {
                        entityWrapper.validate(handleValidatedEntity);
                    }


                }*/
                ,

                /**
                 * Removes existing Organization
                 * @param req
                 * @param res
                 * @param next
                 */
                deleteRelation: function (req, res, next) {
                    var entityUUID = req.params.uuid;

                    if (!entityUUID) {
                        return next('Error by deleting entity of type ' + entityType + '. uuid is empty or not set.');
                    }

                    console.info('Deleting ' + entityType + ' with uuid: ' + entityUUID);

                    crudRepository.deleteEntity(entityType, entityUUID, function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        return res.send(result);
                    });
                }
            };

            return controller;

        }
    }
    ;


module.exports = CrudRelationControllerFactory;
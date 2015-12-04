var uuid = require('node-uuid');
var relationMap = require('../../config/relationMap');
var CrudRepository = require('../model/CrudRepository');
var _ = require('underscore');
var crudRepository = new CrudRepository();

/**
 * Crud Controller is a factory to produce crud methods for business entities

 * @author Leonid Agranovskiy
 * @date  03.12.15.
 */


var CrudControllerFactory = {
    /**
     * Constructor for the method to retrieve entities
     * @param entityType type of the entity to provide crud functionality for
     */
    getCRUD: function (entityType) {

        var EntityWrapper = require('../model/' + entityType);

        var controller = {


            /**
             * Method to return Entity of given type with given uuid
             * @param req
             * @param res
             * @param next
             */
            getEntity: function (req, res, next) {

                var entityUUID = req.params.uuid;

                if (!entityUUID) {
                    return next('Error by getting entity of type ' + entityType + '. uuid is empty or not set.');
                }

                console.info('Getting ' + entityType + ' with uuid: ' + entityUUID);

                crudRepository.getEntity(entityType, entityUUID, function (err, data) {
                    if (err) {
                        return next(err);
                    }

                    if (!data) {
                        return next('Cannot find ' + entityType + ' for the uuid + ' + uuid);
                    }

                    var entityWrapperInstance = new EntityWrapper(data);
                    return res.send(entityWrapperInstance);

                });

            },

            /**
             * Returns a list of all entities of given type.
             *
             * @param req request
             * @param res response
             * @param next next callback
             */
            listEntity: function (req, res, next) {

                crudRepository.listEntity(entityType, function (err, entityRsArray) {
                    if (err) {
                        return next(err);
                    }
                    console.info('Getting all ' + entityType + '.');

                    var retVal = [];
                    _.each(entityRsArray, function (entityData) {
                        retVal.push(new EntityWrapper(entityData));
                    });

                    return res.send(retVal);

                });

            },
            /**
             * Saves given entity
             *
             * @param req request
             * @param res response
             * @param next next callback
             */
            saveEntity: function (req, res, next) {
                var entityData = req.body;

                if (!entityData) {
                    return next('Error. No ' + entityType + ' data is empty');
                }


                if (!entityData.uuid) {
                    entityData.uuid = uuid.v4();
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


            },

            /**
             * Removes existing Organization
             * @param req
             * @param res
             * @param next
             */
            deleteEntity: function (req, res, next) {
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
};


module.exports = CrudControllerFactory;
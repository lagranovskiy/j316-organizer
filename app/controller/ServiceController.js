var CrudRepository = require('../model/CrudRepository');
var crudRepository = new CrudRepository();
var Service = require('../model/Service');
var uuid = require('node-uuid');
var _ = require('underscore');
var relationMap = require('../../config/relationMap');
/**
 * Controller to provide service crud functionality
 * @constructor
 */
var ServiceController = function () {

    var controller = {

        /**
         * Returns a single Service by uuid
         * @param req
         * @param res
         * @param next
         */
        getService: function (req, res, next) {

            var serviceUUID = req.params.uuid;

            if (!serviceUUID) {
                return next('Error. uuid is empty');
            }

            console.info('Getting Service with uuid: ' + serviceUUID);
            crudRepository.getEntity(relationMap.objects.Service, serviceUUID, function (err, data) {
                if (err) {
                    return next(err);
                }

                if (!data) {
                    return next('Cannot find Service for the uuid + ' + uuid);
                }
                var service = new Service(data);
                return res.send(service);

            });

        },

        /**
         * Returns a list of Services
         *
         * @param req
         * @param res
         * @param next
         */
        listService: function (req, res, next) {
            crudRepository.listEntity(relationMap.objects.Service, function (err, serviceRsArray) {
                if (err) {
                    return next(err);
                }

                var retVal = [];
                _.each(serviceRsArray, function (serviceData) {
                    retVal.push(new Service(serviceData));
                });

                return res.send(retVal);

            });
        },


        /**
         * Saves Service
         *
         * @param req
         * @param res
         * @param next
         */
        saveService: function (req, res, next) {

            var serviceData = req.body;

            if (!serviceData) {
                return next('Error. Input is empty');
            }


            if (!serviceData.uuid) {
                serviceData.uuid = uuid.v1();
                console.info('Creating a new Service with uuid: ' + serviceData.uuid);
            } else {
                console.info('Saving Service with uuid: ' + serviceData.uuid);
            }

            var service = new Service(serviceData);

            service.validate(function (err, validatesServiceEntity) {
                if (err) {
                    return next(err);
                }
                console.info('Service with uuid: ' + serviceData.uuid + ' is validated successfully. Continue with saving.');

                crudRepository.saveEntity(relationMap.objects.Service, validatesServiceEntity, function (err, data) {
                    if (err) {
                        return next(err);
                    }

                    var updatedService = new Service(data);
                    return res.send(updatedService);

                });
            });


        },

        /**
         * Removes existing Service
         * @param req
         * @param res
         * @param next
         */
        deleteService: function (req, res, next) {

            if (!serviceUUID) {
                return next('Error. uuid is empty');
            }

            console.info('Deleting Service with uuid: ' + serviceUUID);
            crudRepository.deleteEntity(relationMap.objects.Service, serviceUUID, function (err, result) {
                if (err) {
                    return next(err);
                }

                return res.send(result);
            });
        }


    };

    return controller;
};
module.exports = new ServiceController();
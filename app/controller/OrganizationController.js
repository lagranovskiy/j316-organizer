var CrudRepository = require('../model/CrudRepository');
var crudRepository = new CrudRepository();
var Organization = require('../model/Organization');
var uuid = require('node-uuid');
var _ = require('underscore');

/**
 * Controller to provide Organization crud functionality
 * @constructor
 */
var ServiceController = function () {

    var controller = {

        /**
         * Returns a single Organization by uuid
         * @param req
         * @param res
         * @param next
         */
        getOrganization: function (req, res, next) {

            var organizationUUID = req.params.uuid;

            if (!organizationUUID) {
                return next('Error. uuid is empty');
            }

            console.info('Getting Organization with uuid: ' + organizationUUID);
            crudRepository.getEntity('Organization', organizationUUID, function (err, data) {
                if (err) {
                    return next(err);
                }

                if (!data) {
                    return next('Cannot find Organization for the uuid + ' + uuid);
                }
                var organization = new Organization(data);
                return res.send(organization);

            });

        },

        /**
         * Returns a list of Organizations
         *
         * @param req
         * @param res
         * @param next
         */
        listOrganization: function (req, res, next) {
            crudRepository.listEntity('Organization', function (err, organizationRsArray) {
                if (err) {
                    return next(err);
                }

                var retVal = [];
                _.each(organizationRsArray, function (organizationData) {
                    retVal.push(new Organization(organizationData));
                });

                return res.send(retVal);

            });
        },


        /**
         * Saves Organization
         *
         * @param req
         * @param res
         * @param next
         */
        saveOrganization: function (req, res, next) {

            var organizationData = req.body;

            if (!organizationData) {
                return next('Error. Input is empty');
            }


            if (!organizationData.uuid) {
                organizationData.uuid = uuid.v1();
                console.info('Creating a new Organization with uuid: ' + organizationData.uuid);
            } else {
                console.info('Saving Organization with uuid: ' + organizationData.uuid);
            }

            var organization = new Organization(organizationData);

            organization.validate(function (err, organizationValidatedData) {
                if (err) {
                    return next(err);
                }
                console.info('Organization with uuid: ' + organizationData.uuid + ' is validated successfully. Continue with saving.');

                crudRepository.saveEntity('Organization', organizationValidatedData, function (err, data) {
                    if (err) {
                        return next(err);
                    }

                    var updatedOrganization = new Organization(data);
                    return res.send(updatedOrganization);

                });
            });


        },

        /**
         * Removes existing Organization
         * @param req
         * @param res
         * @param next
         */
        deleteOrganization: function (req, res, next) {

            var organizationUUID = req.params.uuid;

            if (!organizationUUID) {
                return next('Error. uuid is empty');
            }


            console.info('Deleting Organization with uuid: ' + organizationUUID);
            crudRepository.deleteEntity('Organization', organizationUUID, function (err, result) {
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
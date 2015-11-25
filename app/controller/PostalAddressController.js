var CrudRepository = require('../model/CrudRepository');
var crudRepository = new CrudRepository();
var PostalAddress = require('../model/PostalAddress');
var uuid = require('node-uuid');
var _ = require('underscore');
var relationMap = require('../../config/relationMap');

/**
 * Controller to provide postal address crud functionality
 * @constructor
 */
var PersonController = function () {

    var controller = {

        /**
         * Returns a single Postall Address by uuid
         * @param req
         * @param res
         * @param next
         */
        getPostalAddress: function (req, res, next) {

            var postalAddressUUID = req.params.uuid;

            if (!postalAddressUUID) {
                return next('Error. uuid is empty');
            }

            console.info('Getting postal address with uuid: ' + postalAddressUUID);
            crudRepository.getEntity(relationMap.objects.PostalAddress, postalAddressUUID, function (err, data) {
                if (err) {
                    return next(err);
                }

                if (!data) {
                    return next('Cannot find postal address for the uuid + ' + uuid);
                }
                var postalAddress = new PostalAddress(data);
                return res.send(postalAddress);

            });

        },

        /**
         * Returns a list of PostalAddress
         *
         * @param req
         * @param res
         * @param next
         */
        listPostalAddress: function (req, res, next) {
            crudRepository.listEntity(relationMap.objects.PostalAddress, function (err, postalAddressRs) {
                if (err) {
                    return next(err);
                }

                var retVal = [];
                _.each(postalAddressRs, function (postalData) {
                    retVal.push(new PostalAddress(postalData));
                });

                return res.send(retVal);

            });
        },


        /**
         * Saves PostalAddress
         *
         * @param req
         * @param res
         * @param next
         */
        savePostalAddress: function (req, res, next) {

            var postalAddressData = req.body;

            if (!postalAddressData) {
                return next('Error. Input is empty');
            }


            if (!postalAddressData.uuid) {
                postalAddressData.uuid = uuid.v1();
                console.info('Creating a new postal address with uuid: ' + postalAddressData.uuid);
            } else {
                console.info('Saving postal address with uuid: ' + postalAddressData.uuid);
            }

            var postalAddress = new PostalAddress(postalAddressData);

            postalAddress.validate(function (err, validatedPostalAddress) {
                if (err) {
                    return next(err);
                }
                console.info('Postal address with uuid: ' + postalAddressData.uuid + ' is validated successfully. Continue with saving.');

                crudRepository.saveEntity(relationMap.objects.PostalAddress, validatedPostalAddress, function (err, data) {
                    if (err) {
                        return next(err);
                    }

                    var updatedPostalAddress = new PostalAddress(data);
                    return res.send(updatedPostalAddress);

                });
            });


        },

        /**
         * Removes existing PostalAddress
         * @param req
         * @param res
         * @param next
         */
        deletePostalAddress: function (req, res, next) {

            var postalUUID = req.params.uuid;

            if (!postalUUID) {
                return next('Error. uuid is empty');
            }


            console.info('Deleting address with uuid: ' + postalUUID);
            crudRepository.deleteEntity(relationMap.objects.PostalAddress, postalUUID, function (err, result) {
                if (err) {
                    return next(err);
                }

                return res.send(result);
            });
        }


    };

    return controller;
};
module.exports = new PersonController();
var PersonService = require('./../business/PersonService');
var _ = require('underscore');

/**
 * Controller to provide person crud functionality
 * @returns {{processSMS77Confirmation: Function}}
 * @constructor
 */
var PersonController = function () {

    var controller = {

        /**
         * Returns a single Person by id
         * @param req
         * @param res
         * @param next
         */
        findPerson:function(req,res,next) {

            var personUUID = req.params.uuid;

            if (!personUUID) {
                return next('Error. uuid is empty');
            }

            PersonService.findPerson(personUUID, function (err, result) {
                if (err) {
                    return next(err);
                }

                return res.send(result);
            });
        },

        /**
         * Returns a list of Persons
         *
         * @param req
         * @param res
         * @param next
         */
        listPersons:function(req,res,next) {
            PersonService.listPersons(function (err, result) {
                if (err) {
                    return next(err);
                }

                return res.send(result);
            });
        },


        /**
         * Creates a new person and returns the created instance
         * @param req
         * @param res
         * @param next
         */
        createPerson: function (req, res, next) {

            var personData = req.body;

            if (!personData) {
                return next('Error. Input is empty');
            }

            PersonService.createPerson(personData, function (err, result) {
                if (err) {
                    return next(err);
                }
                return res.send(result);
            });
        },

        /**
         * Saves already existing and updated person
         *
         * @param req
         * @param res
         * @param next
         */
        updatePerson: function (req, res, next) {

            var personData = req.body;

            if (!personData) {
                return next('Error. Input is empty');
            }

            PersonService.updatePerson(personData, function (err, result) {
                if (err) {
                    return next(err);
                }
                return res.send(result);
            });

        },

        /**
         * Removes existing person
         * @param req
         * @param res
         * @param next
         */
        deletePerson: function (req, res, next) {

            var personUUID = req.params.uuid;

            if (!personUUID) {
                return next('Error. uuid is empty');
            }

            PersonService.deletePerson(personUUID, function (err, result) {
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
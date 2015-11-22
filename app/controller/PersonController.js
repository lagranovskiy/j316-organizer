var CrudRepository = require('../model/CrudRepository');
var crudRepository = new CrudRepository();
var Person = require('../model/Person');
var uuid = require('node-uuid');
var _ = require('underscore');


/**
 * Controller to provide person crud functionality
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
        getPerson: function (req, res, next) {

            var personUUID = req.params.uuid;

            if (!personUUID) {
                return next('Error. uuid is empty');
            }


            if (!personUUID) {
                return callback('Cannot get a person with uuid null');
            }

            crudRepository.getEntity('Person', personUUID, function (err, data) {
                if (err) {
                    return next(err);
                }

                if (!data) {
                    return callback('Cannot find person for the uuid + ' + uuid);
                }
                var createdPerson = new Person(data);
                return res.send(createdPerson);

            });
        },

        /**
         * Returns a list of Persons
         *
         * @param req
         * @param res
         * @param next
         */
        listPersons: function (req, res, next) {

            crudRepository.listEntity('Person', function (err, personDataArray) {
                if (err) {
                    return next(err);
                }

                var retVal = [];
                _.each(personDataArray, function (personData) {
                    retVal.push(new Person(personData));
                });

                return res.send(retVal);

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

            if (!personData.uuid) {
                personData.uuid = uuid.v1();
            }

            var newPerson = new Person(personData);
            newPerson.validate(function (err, validatedPerson) {

                if (err) {
                    return next(err);
                }

                crudRepository.saveEntity('Person', validatedPerson, function (err, data) {
                    if (err) {
                        return next(err);
                    }

                    var createdPerson = new Person(data);
                    return res.send(createdPerson);

                });
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

            if (!personData.uuid) {
                return callback('Person can not be updated. uuid null');
            }

            var updatePerson = new Person(personData);

            updatePerson.validate(function (err, validatedPerson) {

                if (err) {
                    return next(err);
                }

                crudRepository.saveEntity('Person', validatedPerson, function (err, data) {
                    if (err) {
                        return next(err);
                    }

                    var updatedPerson = new Person(data);
                    return res.send(updatedPerson);

                });
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


            crudRepository.deleteEntity('Person', personUuid, function (err, data) {
                if (err) {
                    return next(err);
                }

                return res.send(data);

            });

        }


    };

    return controller;
};
module.exports = new PersonController();
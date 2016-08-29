var should = require('should');
var sinon = require('sinon');
var async = require('neo-async');
var _ = require('underscore');
var CrudEntityController = require('../../app/controller/CrudEntityController');

describe("Test Crud Entity Controller", function() {

    var testPersonData = {
        forename: 'Max',
        surname: 'Mustermann',
        familyState: 'SINGLE',
        dob: '01.01.2000',
        gender: 'MALE',
        email: 'info@agranovskiy.de',
        phone1: '061929879697',
        phone2: '0691665255',
        comment: 'Here we go'
    };


    describe("Test get entities", function() {

        it("Test that entity can be resolved after it was saved", function(done) {
            var controller = CrudEntityController.getCRUD('Person');
            var req = {
                body: testPersonData
            };


            async.waterfall([
                    function(callback) {
                        controller.saveEntity(req, {
                            send: function(data) {
                                should(data).exist;
                                callback(null, data);
                            }
                        }, function(err, data) {
                            if (err) {
                                return callback(err);
                            }
                            return callback(null, data);
                        });
                    },
                    function(savedPerson, callback) {
                        should(savedPerson).exist;
                        should(savedPerson.uuid).exist;

                        req = {
                            params: {
                                uuid: savedPerson.uuid
                            }
                        };


                        controller.getEntity(req, {
                            send: function(data) {
                                should(data).exist;
                                return callback(null, data);
                            }
                        }, function(err, data) {
                            if (err) {
                                return callback(err);
                            }
                            return callback(null, data);
                        });
                    }
                ],
                function(err, resolvedPerson) {
                    should(err == null).be.ok;
                    should(resolvedPerson.created).be.not.null;
                    return done(err);
                });


        });

        it("Test list entities", function(done) {
            var controller = CrudEntityController.getCRUD('Person');
            var req = {
                body: testPersonData
            };


            async.waterfall([
                    function(callback) {
                        controller.saveEntity(req, {
                            send: function(data) {
                                should(data).exist;
                                return callback(null, data);
                            }
                        }, function(err, data) {
                            if (err) {
                                return callback(err);
                            }
                            return callback(null, data);
                        });
                    },
                    function(savedPerson, callback) {
                        should(savedPerson).exist;
                        should(savedPerson.uuid).exist;

                        controller.listEntity(null, {
                            send: function(data) {
                                should(data).exist;
                                return callback(null, data, savedPerson);
                            }
                        }, function(err, data) {
                            if (err) {
                                return callback(err);
                            }
                            return callback(null, data);
                        });
                    }
                ],
                function(err, resolvedPersonArray, savedPerson) {
                    should(err == null).be.ok;
                    should(resolvedPersonArray.length).be.aboveOrEqual(1);
                    var itemFound = false;

                    // Search for recently saved item
                    _.each(resolvedPersonArray, function(person) {
                        if (savedPerson.uuid === person.uuid) {
                            itemFound = true;
                        }
                    });

                    should(itemFound === true).be.ok();
                    done(err);
                });


        });


    });


    describe("Test deleting of enitities", function() {

        it("Test item can be removed", function(done) {

            var controller = CrudEntityController.getCRUD('Person');
            var req = {
                body: testPersonData
            };

            async.waterfall([
                    function(callback) {
                        controller.saveEntity(req, {
                            send: function(data) {
                                return callback(null, data);
                            }
                        }, function(err, data) {
                            if (err) {
                                return callback(err);
                            }
                            return callback(err, data);
                        });
                    },
                    function(savedPerson, callback) {
                        should(savedPerson).exist;
                        should(savedPerson.uuid).exist;

                        req = {
                            params: {
                                uuid: savedPerson.uuid
                            }
                        };


                        controller.deleteEntity(req, {
                            send: function(data) {
                                should(data).exist;
                                should(data.deleted).be.ok();
                                callback(null, savedPerson);
                            }
                        }, function(err, data) {
                            if (err) {
                                return callback(err);
                            }
                            return callback(err, data);
                        });
                    },
                    function(deletedPerson, callback) {
                        // Try to resolve deleted person
                        controller.getEntity({
                            params: {
                                uuid: deletedPerson.uuid
                            }
                        }, {
                            send: function(data) {
                                should(data).be.not.ok();
                                return callback('Deleted entity could be resolved!!');
                            }
                        }, function(err) {
                            should(err).be.ok();
                            if (err) {
                                return callback(err);
                            }
                            return callback(null, true);
                        });
                    }
                ],
                function(err, deletedSuccessfull) {
                    should(err).be.not.ok();
                    should(deletedSuccessfull).be.ok();
                    return done(err);
                });
        });
    });

});
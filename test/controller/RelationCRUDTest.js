var should = require('should');
var sinon = require('sinon');
var async = require('neo-async');
var _ = require('underscore');
var relationMap = require('../../config/relationMap');
var CrudEntityController = require('../../app/controller/CrudEntityController');
var CrudRelationController = require('../../app/controller/CrudRelationController');


/**
 * Helper method to produce test data on the database
 * @param entityType type of the test entity
 *  * @param entityData data for the test entity
 */
function createPersistentEntity(entityType, entityData, callback) {
    var controller = CrudEntityController.getCRUD(entityType);
    async.waterfall([function (callback) {
        controller.saveEntity({body: entityData}, {
            send: function (person) {
                return callback(null, person);
            }
        }, function (err, data) {
            callback(err, data);
        })
    }], function (err, data) {
        if (err) {
            return callback(null);
        }
        return callback(null, data);
    });

}


describe("Test Crud Relation Controller", function () {

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

    var relationPersonData = {};

    var childPersonData = {
        forename: 'Leo',
        surname: 'Mustermann',
        familyState: 'SINGLE',
        dob: '01.01.2015',
        gender: 'MALE'
    };

    describe("Test processing of relations", function () {

        it("Test that relation can be resolved after it was saved", function (done) {
            var controller = CrudRelationController.getRelationCRUD(relationMap.bom.Person.PersonHasChild);


            async.waterfall([
                    function (callback) {
                        // create parent and child
                        async.parallel([
                                function (callbackPerson) {
                                    createPersistentEntity(relationMap.objects.Person, testPersonData, callbackPerson);
                                },
                                function (callbackPerson) {
                                    createPersistentEntity(relationMap.objects.Person, childPersonData, callbackPerson);
                                }],
                            function (err, arrayOfPersons) {
                                return callback(err, arrayOfPersons[0], arrayOfPersons[1])
                            });

                    },

                    function (parent, child, callback) {
                        // Save relation to resolve it in the next step
                        controller.saveRelation({
                            params: {uuid: parent.uuid},
                            body: {ref: child}
                        }, {
                            send: function (savedRelation) {
                                return callback(null, savedRelation);
                            }
                        }, function (err, savedRelation) {
                            return callback(err, savedRelation);
                        });
                    },

                    function (savedRelation, callback) {
                        // Try to resolve saved (known) relation over the relation source UUID

                        controller.getRelatedRelations({
                            params: {uuid: savedRelation.getMetaInfo().sourceUUID}
                        }, {
                            send: function (data) {
                                should(data).exist;
                                return callback(null, data);
                            }
                        }, function (err, data) {
                            if(err){
                                console.error(err);
                            }
                            return callback(err, data);
                        });
                    }
                ],
                function (err, relationsArray) {
                    should(err == null).be.ok();
                    should(relationsArray).have.property('length',1);
                    return done(err);
                });
        });
    });


    describe("Test deleting of relations", function (done) {

        var controller = CrudRelationController.getRelationCRUD(relationMap.bom.Person.PersonHasChild);


        async.waterfall([
                function (callback) {
                    // create parent and child
                    async.parallel([
                            function (callbackPerson) {
                                createPersistentEntity(relationMap.objects.Person, testPersonData, callbackPerson);
                            },
                            function (callbackPerson) {
                                createPersistentEntity(relationMap.objects.Person, childPersonData, callbackPerson);
                            }],
                        function (err, arrayOfPersons) {
                            return callback(err, arrayOfPersons[0], arrayOfPersons[1])
                        });

                },

                function (parent, child, callback) {
                    // Save relation to resolve it in the next step
                    controller.saveRelation({
                        params: {uuid: parent.uuid},
                        body: {ref: child}
                    }, {
                        send: function (savedRelation) {
                            return callback(null, savedRelation);
                        }
                    }, function (err, savedRelation) {
                        return callback(err, savedRelation);
                    });
                },

                function (savedRelation, callback) {
                    // Try to resolve saved (known) relation over the relation source UUID

                    controller.deleteRelation({
                        params: {
                            uuid: savedRelation.getMetaInfo().sourceUUID,
                            relationUUID: savedRelation.relationUUID
                        }
                    }, {
                        send: function (data) {
                            should(data).exist();
                            return callback(null, data);
                        }
                    }, function (err, data) {
                        console.error(err);
                        return callback(err, data);
                    });
                }
            ],
            function (err, relationsArray) {
                should(err).be.not.ok();
                should(relationsArray).exist;
                should(relationsArray.isDeleted).be.ok();
                return done(err);
            });
    });


});
var should = require('should');
var sinon = require('sinon');
var neo4j = require('neo4j');
var _ = require('underscore');
var CrudRelationRepository = require('../../app/model/CrudRelationRepository');
var PersonHasChild = require('../../app/model/relation/PersonHasChild');

describe("Test Crud Entity Relation Repository", function () {

    var sandbox;


    beforeEach(function () {
        sandbox = sinon.sandbox.create();

    });

    afterEach(function () {
        sandbox.restore();
    });

    var testPersonData = {
        id: 12,
        uuid: 'Person123',
        forename: 'Max',
        surname: 'Mustermann',
        familyState: 'SINGLE',
        dob: '01.01.2000',
        gender: 'MALE'
    };

    var relationPersonData = {
        id: 11,
        relationUUID: 'ChildRelation123'
    };

    var childPersonData = {
        id: 10,
        uuid: 'Person124',
        forename: 'Leo',
        surname: 'Mustermann',
        familyState: 'SINGLE',
        dob: '01.01.2015',
        gender: 'MALE'
    };

    describe("Test get entities", function () {

        it("Test that entity returns all relations correctly", function (done) {

            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                should(data).have.property('sourceUUID', 'Person123');
                callback(null, [{
                    source: {data: testPersonData},
                    relation: {data: relationPersonData},
                    target: {data: childPersonData}
                }]);
            });

            var crudRelationRepository = new CrudRelationRepository();

            var relation = new PersonHasChild('Person123');

            crudRelationRepository.getRelated(relation, function (err, result) {
                should(err).be.null;

                should(result).be.array;
                should(result.length).be.equal(1);
                should(result[0].source).have.property('uuid', 'Person123');
                should(result[0].relation).have.property('relationUUID', 'ChildRelation123');
                should(result[0].target).have.property('uuid', 'Person124');
                done();
            })
        });

        it("Test that entity returns nothing if no relations exist", function (done) {

            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, []);
            });

            var crudRelationRepository = new CrudRelationRepository();

            var relation = new PersonHasChild('Person123');

            crudRelationRepository.getRelated(relation, function (err, result) {
                should(err).be.null;

                should(result).be.array;
                should(result.length).be.equal(0);
                done();
            })
        });

    });

    describe("Test saving of relation", function () {
        it("Test that relation can be saved", function (done) {

            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {

                should(data).have.property('sourceUUID', 'Person123');
                should(data).have.property('targetUUID', 'Person124');
                should(data).have.property('relationUUID', 'ChildRelation123');

                callback(null, [{
                    source: {data: testPersonData},
                    relation: {data: relationPersonData},
                    target: {data: childPersonData}
                }]);
            });

            var crudRelationRepository = new CrudRelationRepository();


            var relation = new PersonHasChild('Person123', relationPersonData, childPersonData);

            crudRelationRepository.saveRelation(relation, function (err, result) {
                should(err).be.null;

                should(result.source).have.property('uuid', 'Person123');
                should(result.relation).have.property('relationUUID', 'ChildRelation123');
                should(result.target).have.property('uuid', 'Person124');
                done();
            })
        });

    });

    describe("Test removing of relations", function () {

        it("Test that relation can be remove", function (done) {

            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {

                should(data).have.property('relationUUID', 'ChildRelation123');

                callback(null, [{
                    source: {data: testPersonData},
                    relation: {data: relationPersonData},
                    target: {data: childPersonData}
                }]);
            });

            var crudRelationRepository = new CrudRelationRepository();


            var relation = new PersonHasChild('Person123', relationPersonData, childPersonData);

            crudRelationRepository.deleteRelation(relation, function (err, result) {
                should(err == null).be.ok();

                should(result.source).have.property('uuid', 'Person123');
                should(result.relation).have.property('relationUUID', 'ChildRelation123');
                should(result.target).have.property('uuid', 'Person124');
                done();
            })
        });

    });
});
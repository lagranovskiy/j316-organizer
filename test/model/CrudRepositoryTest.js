var should = require('should');
var sinon = require('sinon');
var neo4j = require('neo4j');
var _ = require('underscore');
var CrudRepository = require('../../app/model/CrudRepository');

describe("Test Crud Entity Repository", function () {

    var sandbox;


    beforeEach(function () {
        sandbox = sinon.sandbox.create();

    });

    afterEach(function () {
        sandbox.restore();
    });

    var testPersonData = {
        id: 12,
        uuid: '1234',
        forename: 'Max',
        surname: 'Mustermann',
        familyState: 'SINGLE',
        dob: '01.01.2000',
        gender: 'MALE'
    };

    describe("Test get entity", function () {



        it("Test that entity returns 1 result correctly", function (done) {

            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                should(data).have.property('uuid', '1234');
                callback(null, [{entity: {data: testPersonData}}]);
            });

            var crudRepository = new CrudRepository();
            crudRepository.getEntity('Person', '1234', function (err, result) {
                should(err).be.null;
                should(result).have.property('uuid', '1234');
                done();
            })
        });

        it("Test that repository returns error if more then one entity match query", function (done) {

            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                should(data).have.property('uuid', '1234');
                callback(null, [{entity: {data: testPersonData}}, {entity: {data: testPersonData}}]);
            });

            var crudRepository = new CrudRepository();
            crudRepository.getEntity('Person', '1234', function (err, result) {
                should(err).not.be.null;
                should(result).be.null;
                done();
            })
        });


        it("Test that repository returns error if no entity match query", function (done) {

            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                should(data).have.property('uuid', '1234');
                callback(null, []);
            });

            var crudRepository = new CrudRepository();
            crudRepository.getEntity('Person', '1234', function (err, result) {
                should(err).not.be.null;
                should(result).be.null;
                done();
            })
        });
    });

    describe("Test list entities", function () {
        it("Test that list returns correctly", function () {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                should(data).be.null;
                callback(null, [{entity: {data: testPersonData}}, {entity: {data: testPersonData}}]);
            });

            var crudRepository = new CrudRepository();
            crudRepository.listEntity('Person', function (err, result) {
                should(err).be.null;
                should(result).not.be.undefined;
                should(result).not.be.null;
                should(result.length).be.exactly(2);
                done();
            })
        });

        it("Test that no deleted entities returned", function () {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                should(query.indexOf('isDeleted = false')).be.aboveOrEqual(0);
                callback(null, [{entity: {data: testPersonData}}, {entity: {data: testPersonData}}]);
            });

            var crudRepository = new CrudRepository();
            crudRepository.listEntity('Person', function (err, result) {
                should(err).be.null;
                should(result).not.be.undefined;
                should(result).not.be.null;
                should(result.length).be.exactly(2);
                done();
            })
        });
    });

    describe("Test save entity", function () {
        it("Test entity can be created", function () {


            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                should(data).have.property('uuid','1234');
                should(data).have.property('entityData');
                should(data.entityData.forename).be.equal('Max');
                callback(null, [{entity: {data: testPersonData}}]);
            });

            var crudRepository = new CrudRepository();
            crudRepository.saveEntity('Person', testPersonData, function (err, result) {
                should(err).be.null;
                should(result).have.propery('uuid','1234');
                done();
            })
        });


    });

    describe("Test delete entity", function () {
        it("Test entity can be deleted", function () {

            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                should(data).have.property('uuid','1234');
                should(query.indexOf('SET entity.isDeleted=true')).be.aboveOrEqual(0);
                callback(null, [{entity: {data: testPersonData}}]);
            });

            var crudRepository = new CrudRepository();
            crudRepository.deleteEntity('Person', '1234', function (err, result) {
                should(err).be.null;
                should(result).have.propery('uuid','1234');
                done();
            })
        });

        it("Test error if no entity found to be deleted", function () {

            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                should(data).have.property('uuid','1234');
                should(query.indexOf('SET entity.isDeleted=true')).be.aboveOrEqual(0);
                callback(null, []);
            });

            var crudRepository = new CrudRepository();
            crudRepository.deleteEntity('Person', '1234', function (err, result) {
                should(err).not.be.null;
                should(result).be.undefined;
                done();
            })
        });


    });

});
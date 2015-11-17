var async = require('neo-async'),
    Person = require('./Person'),
    _ = require('underscore'),
    config = require('../../config/config'),
    neo4j = require('neo4j'),
    db = new neo4j.GraphDatabase(config.neo4j);

function PersonRepository() {
}


/**
 * Creates a new person
 * @param person
 * @param retValCallback
 * @returns {*}
 */
PersonRepository.prototype.createPerson = function(person, retValCallback){
    if (!person) {
        return callback('Cannot create person. Invalid args.');
    }

    var query = [
        "CREATE (person:Person{projectData})",
        "RETURN person"
    ].join('\n');

    var params = {
        projectData: person
    };

    async.waterfall([
        function(callback) {
            db.query(query, params, callback);
        },
        function(results, callback) {
            if (results.length !== 1) {
                return retValCallback('Cannot create person with given properties.');
            }

            return callback(null, results[0].person.data);
        }
    ], retValCallback);
};

/**
 * finds a person by uuid
 * @param person uuid
 * @param retValCallback
 * @returns {*}
 */
PersonRepository.prototype.findPerson = function(uuid, retValCallback){
    if (!uuid) {
        return callback('Cannot create person. Invalid args.');
    }

    var query = [
        "MATCH (person:Person)",
        "WHERE person.uuid = {uuid}",
        "RETURN person"
    ].join('\n');

    var params = {
        uuid: uuid
    };

    async.waterfall([
        function(callback) {
            db.query(query, params, callback);
        },
        function(results, callback) {
            if (results.length !== 1) {
                return retValCallback('Cannot find person with given properties.');
            }

            return callback(null, results[0].person.data);
        }
    ], retValCallback);
};


/**
 * returns a list of all persons
 *
 * @param person uuid
 * @param retValCallback
 * @returns {*}
 */
PersonRepository.prototype.findPersons = function(retValCallback){

    var query = [
        "MATCH (person:Person)",
        "RETURN person"
    ].join('\n');


    async.waterfall([
        function(callback) {
            db.query(query, null, callback);
        },
        function(results, callback) {

            var retVal = [];
            _.each(results, function (person) {
                retVal.push(person.person.data);
            });

            return callback(null, retVal);
        }
    ], retValCallback);
};

/**
 * Updates person to the given state
 * @param user
 * @param callback
 */
PersonRepository.prototype.updatePerson = function (person, callback) {
    if (!person) {
        return callback('Cannot update person. Invalid args.');
    }

    async.waterfall([function (callback) {
        db.getNodeById(person.id, callback);
    }, function (personNode, callback) {
        _.extend(personNode.data, person.data);
        personNode.save(callback);
    }, function (updatedPerson, callback) {
        callback(null, new Person(updatedPerson.id, updatedPerson.data));
    }], callback);
};


/**
 * PersonRepository.prototype.listPersons -  Returns a list of all person objects saved in system
 *
 * @param  {type} retValCallback description
 * @return {type}                description
 */
PersonRepository.prototype.listPersons = function (retValCallback) {
    var query = [
        "MATCH (person:Person)",
        "RETURN person"
    ]
        .join('\n');

    async.waterfall([
        function (callback) {
            db.query(query, {}, callback);
        },
        function (results, callback) {
            var personList = [];
            _.each(results, function (result) {
                personList.push(new Person(result.person.id, result.person.data));
            });

            callback(null, personList);
        }
    ], retValCallback);
};



module.exports = PersonRepository;
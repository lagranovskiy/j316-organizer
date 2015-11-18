var PersonRepository = require('../model/PersonRepository');
var personRepository = new PersonRepository();
var Person = require('../model/Person');
var uuid = require('node-uuid');
var _ = require('underscore');

var PersonService = function () {
};


/**
 * Creates a new person instance
 *
 * @param rqData
 * @param callback
 */
PersonService.prototype.createPerson = function (personData, callback) {
    if (!personData) {
        return callback('Cannot create a person null');
    }

    if (!personData.uuid) {
        personData.uuid = uuid.v1();
    }

    var newPerson = new Person(personData);
    newPerson.validate(function (err, validatedPerson) {

        if (err) {
            return callback(err);
        }

        personRepository.createPerson(validatedPerson, function (err, data) {
            if (err) {
                return callback(err);
            }

            var createdPerson = new Person(data);
            callback(null, createdPerson);

        });
    });


};

/**
 * Updates a existing person instance
 *
 * @param personData person updated info
 * @param callback
 */
PersonService.prototype.updatePerson = function (personData, callback) {
    if (!personData) {
        return callback('Cannot create a person null');
    }

    if (!personData.uuid) {
        return callback('Person can not be updated. uuid null');
    }

    var updatePerson = new Person(personData);

    updatePerson.validate(function (err, validatedPerson) {

        if (err) {
            return callback(err);
        }

        personRepository.updatePerson(validatedPerson, function (err, data) {
            if (err) {
                return callback(err);
            }

            var updatedPerson = new Person(data);
            callback(null, updatedPerson);

        });
    });

};


/**
 * Deletes a person from db by given uuid
 *
 * @param personUuid
 * @param callback
 * @returns {*}
 */
PersonService.prototype.deletePerson = function (personUuid, callback) {
    if (!personUuid) {
        return callback('Cannot delete a person null');
    }

    personRepository.deletePerson(personUuid, function (err, data) {
        if (err) {
            return callback(err);
        }

        callback(null, data);

    });

};


/**
 * Creates a new person instance
 *
 * @param uuid uid of the person
 * @param callback
 */
PersonService.prototype.findPerson = function (uuid, callback) {
    if (!uuid) {
        return callback('Cannot get a person with uuid null');
    }

    personRepository.findPerson(uuid, function (err, data) {
        if (err) {
            return callback(err);
        }

        if (!data) {
            return callback('Cannot find person for the uuid + ' + uuid);
        }
        var createdPerson = new Person(data);
        return callback(null, createdPerson);

    });

};


/**
 * Creates a new person instance
 *
 * @param callback
 */
PersonService.prototype.listPersons = function (callback) {
    personRepository.findPersons(function (err, personDataArray) {
        if (err) {
            return callback(err);
        }

        var retVal = [];
        _.each(personDataArray, function (personData) {
            retVal.push(new Person(personData));
        });

        return callback(null, retVal);

    });

};


module.exports = new PersonService();
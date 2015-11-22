var util = require('util'),
    Entity = require('./Entity'),
    urlMap = require('../../config/urlMap'),
    extend = require('object-extend');

function validatePerson(person, callback) {
    var retVal = [];
    if (!person.forename) {
        retVal.push('Person must have a forename');
    }
    if (!person.surname) {
        retVal.push('Person must have a surname');
    }

    if (!person.gender) {
        retVal.push('Person must have a gender');
    }
    if (retVal.length > 0) {
        callback(retVal);
    } else {
        callback(null, person);
    }
}

/**
 * Person data entity
 **/
var Person = function (personData) {
    var data = {};

    if (personData) {
        extend(data, personData);
    }


    return extend(Person.super_(data), {

        /**
         * Forename of the person
         */
        get forename() {
            return data.forename;
        },

        /**
         * Surname of person
         */
        get surname() {
            return data.surname;
        },

        /**
         * Returns the family state of the person
         * @returns {*}
         */
        get familyState() {
            return data.familyState;
        },


        /**
         * Birthday of person
         */
        get dob() {
            return data.dob;
        },

        /**
         * GoHome day of person
         */
        get dod() {
            return data.dod;
        },

        /**
         * Person gender
         * @returns {*}
         */
        get gender() {
            return data.gender;
        },

        /**
         * Email of person
         */
        get email() {
            return data.email;
        },


        /**
         * Contact phone1
         */
        get phone1() {
            return data.phone1;
        },

        /**
         * Contact phone2
         */
        get phone2() {
            return data.phone2;
        },

        /**
         * Contact mobile
         */
        get mobilePhone() {
            return data.mobilePhone;
        },

        /**
         * Indicates if the person is currently active
         * @returns {*}
         */
        get isActiveMember() {
            return data.isActiveMember;
        },

        /**
         * Returns the day the person became active member
         * @returns {*}
         */
        get isActiveMemberSince() {
            return data.isActiveMemberSince;
        },

        /**
         * Returns the day the person was excluded or gone home and not the active member anymore
         * @returns {*}
         */
        get wasActiveMemberTill() {
            return data.wasActiveMemberTill;
        },


        /**
         * Returns the comment to the person
         * @returns {*}
         */
        get comment() {
            return data.comment;
        },

        /**
         * Validates current person and returns array of failures or the object
         * @param callback
         */
        validate: function (callback) {
            validatePerson(this, callback);
        },


        /**
         * Returns urls to the person relations
         * @returns {*}
         */
        get extra() {
            if (data.uuid) {
                return urlMap.getUrlMap(urlMap.person, {uuid: data.uuid});
            }
            return null;
        }


    });
};

util.inherits(Person, Entity);

module.exports = Person;
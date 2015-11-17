var util = require('util'),
    Entity = require('./Entity'),
    extend = require('object-extend');

/**
 * Person data entity
 **/
var Person = function(personData) {
    var data = {};

    if (personData) {
        extend(data, personData);
    }


    return extend(Person.super_(personData.uuid), {

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
        }


    });
};

util.inherits(Person, Entity);

module.exports = Person;
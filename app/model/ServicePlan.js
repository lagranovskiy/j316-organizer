var util = require('util'),
    Entity = require('./Entity'),
    moment = require('moment'),
    extend = require('object-extend');

function validateServicePlan(servicePlan, callback) {
    var retVal = [];
    if (!servicePlan.planName) {
        retVal.push('Service Plan must have a name');
    }

    if (!servicePlan.planStart || !servicePlan.planEnd) {
        retVal.push('Service Plan must have start end and dates');
    }

    if (servicePlan.planStart && servicePlan.planEnd) {
        var startMoment = moment(servicePlan.planStart, 'DD.MM.YYYY');
        var endMoment = moment(servicePlan.planEnd, 'DD.MM.YYYY');
        if (!startMoment.isBefore(endMoment)) {
            retVal.push('Service Plan start date must be set before the end date');
        }
    }

    if (retVal.length > 0) {
        return callback(retVal);
    } else {
        return callback(null, servicePlan);
    }
}

/**
 * Service Plan describes how a service can be organized on different locations in the time by multiple participant groups
 **/
var ServicePlan = function (servicePlanData) {
    var data = {};

    if (servicePlanData) {
        extend(data, servicePlanData);
    }


    return extend(ServicePlan.super_(data), {

        /**
         * Returns the planName
         *
         * @returns {*}
         */
        get planName() {
            return data.planName;
        },

        /**
         * Returns the date plan starts
         * @returns {*}
         */
        get planStart() {
            return data.planStart;
        },

        /**
         * Returns the date planEnds
         * @returns {*}
         */
        get planEnd() {
            return data.planEnd;
        },


        /**
         * Returns array of event Dates
         * @returns {*}
         */
        get eventDates() {
            return data.eventDates;
        },

        /**
         * Returns eventRecurringDays
         * @returns {*}
         */
        get eventRecurringDays() {
            return data.eventRecurringDays;
        },

        /**
         * Returns eventStartTime
         * @returns {*}
         */
        get eventStartTime() {
            return data.eventStartTime;
        },

        /**
         * Returns eventEndTime
         * @returns {*}
         */
        get eventEndTime() {
            return data.eventEndTime;
        },


        /**
         * Returns the plan document data as stringified JSON Object
         * @returns {*}
         */
        get planJSON() {
            return data.planJSON;
        },


        /**
         * Validates current service plan and returns array of failures or the object
         * @param callback
         */
        validate: function (callback) {
            validateServicePlan(this, callback);
        }


    });
};

util.inherits(ServicePlan, Entity);

module.exports = ServicePlan;
var uuid = require('node-uuid');
var relationMap = require('../../config/relationMap');
var CrudRepository = require('../model/CrudRepository');
var _ = require('underscore');
var async = require('neo-async');
var crudRepository = new CrudRepository();

var j316Adapter = require('../adapter/J316NotificatorAdapter');

var ServicePlan = require('../model/ServicePlan');
var Person = require('../model/Person');

/**
 * Controller to wrap notification persistence and logic

 * @author Leonid Agranovskiy
 * @date  03.12.15.
 */
var PlanNotificationController = function () {

    var controller = {

        /**
         * Start plan notifications
         *
         * @param req
         * @param res
         * @param next
         * @return {*}
         */
        generatePlanNotifications: function (req, res, next) {
            var planUUID = req.params.planUUID;

            // Resolve Plan
            async.parallel([
                function (callback) {
                    crudRepository.getEntity('ServicePlan', planUUID, callback)
                },
                function (planData, callback) {
                    var servicePlan = new ServicePlan(planData);
                    var parsedGroupArray = JSON.parse(servicePlan.planJSON);

                    if (!parsedGroupArray) {
                        return callback('Cannot process plan. json parse error');
                    }

                    var notificationData = {
                        planUUID: servicePlan.uuid,
                        planName: servicePlan.planName,
                        eventDates: servicePlan.eventDates,
                        groups: [],
                        calender: {
                            notificationCal: servicePlan.notificationCal,
                            eventStartTime: servicePlan.eventStartTime,
                            eventEndTime: servicePlan.eventEndTime
                        },
                        email: {
                            notificationEmail: servicePlan.notificationEmail,
                            smsText: servicePlan.smsText
                        },
                        sms: {
                            notificationSMS: servicePlan.notificationSMS,
                            smsText: servicePlan.smsText
                        }


                    };

                    _.forEach(parsedGroupInfo, function (groupInfo) {


                        _.forEach(groupInfo.sections, function (sectionInfo) {
                            var calGroup = {
                                groupName: groupInfo.name,
                                location: groupInfo.address.location,
                                besetzung: sectionInfo.besetzung,
                                participants: []
                            };


                            async.map(sectionInfo.participants, function (participantRef, callBack) {
                                crudRepository.getEntity('Person', participantRef.participantUUID, callBack);
                            }, function (err, results) {

                                _.forEach(results, function (personData) {
                                    calGroup.participants.push(new Person(personData));
                                });

                            });


                            notificationData.groups.push(calGroup);

                        });

                    });

                    callback(null, notificationData);

                }
            ], function (err, notificationData) {
                if (err) {
                    return res.status(500).send('Problem by notification generation: ' + err);
                }

                return res.status(200).send(notificationData);
                // Send notifications

            });


        },

        /**
         * Returns active plan notifications
         *
         * @param req
         * @param res
         * @param next
         * @return {*}
         */
        getPlanNotifications: function (req, res, next) {

            var planUUID = req.params.planUUID;
            if (!planUUID) {
                return res.status(500).send('No PlanUUID set');
            }

            j316Adapter.getPlanNotifications(planUUID, null, function (err, data) {
                if (err) {
                    return res.status(500).send(err);
                }
                return res.status(200).send(data);
            });

        },


        /**
         * Returns active plan notifications
         *
         * @param req
         * @param res
         * @param next
         * @return {*}
         */
        getPersonNotifications: function (req, res, next) {
            var personUUID = req.params.personUUID;
            if (!personUUID) {
                return res.status(500).send('No Person UUID set');
            }

            j316Adapter.getPlanNotifications(null, personUUID, function (err, data) {
                if (err) {
                    return res.status(500).send(err);
                }
                return res.status(200).send(data);
            });
        },


        /**
         * Cancel all plan person notifications
         * @param req
         * @param res
         * @param next
         * @return {*}
         */
        cancelPersonPlanNotifications: function (req, res, next) {
            var planUUID = req.params.planUUID;
            var personUUID = req.params.personUUID;
            if (!planUUID && !personUUID) {
                return res.status(500).send('No PlanUUID set or PersonUUID not set');
            }

            j316Adapter.removePlanNotifications(planUUID, personUUID, function (err, data) {
                if (err) {
                    return res.status(500).send(err);
                }
                return res.status(200).send(data);
            });
        }

    };

    return controller;

};


module.exports = new PlanNotificationController();
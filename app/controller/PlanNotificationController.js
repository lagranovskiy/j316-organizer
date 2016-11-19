var uuid = require('node-uuid');
var relationMap = require('../../config/relationMap');
var CrudRepository = require('../model/CrudRepository');
var _ = require('underscore');
var async = require('neo-async');
var crudRepository = new CrudRepository();

var j316Adapter = require('../adapter/J316NotificatorAdapter')();
var notificationBusiness = require('../business/NotificationBusiness')();

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
            async.waterfall([
                // Fetch plan first
                function (callback) {
                    crudRepository.getEntity('ServicePlan', planUUID, callback)
                },
                // Prepare request for the notification business
                function (planData, callback) {
                    var servicePlan = new ServicePlan(planData);
                    var parsedGroupArray = JSON.parse(servicePlan.planJSON);

                    if (!parsedGroupArray) {
                        return callback('Cannot process plan. json parse error');
                    }

                    var notificationRq = {
                        servicePlan: servicePlan,
                        servicePlanGroups: parsedGroupArray,
                        participantsMap: {}
                    };


                    // Fetch persons that are participated to the plan according to the serialized info on service plan
                    var resolveCallArray = [];
                    _.forEach(parsedGroupArray, function (groupInfo) {
                        _.forEach(groupInfo.sections, function (sectionInfo) {
                            _.forEach(sectionInfo.participants, function (participantRef) {
                                resolveCallArray.push(function (callbackParticipant) {
                                    crudRepository.getEntity('Person', participantRef.participantUUID, callbackParticipant);
                                })
                            })
                        });
                    });


                    async.parallel(resolveCallArray, function (err, fetchedParticipants) {
                        if (err) {
                            return console.error('Error by fetching a person');
                        }
                        _.forEach(fetchedParticipants, function (personData) {
                            if (personData) {
                                notificationRq.participantsMap[personData.uuid] = new Person(personData);
                            }
                        });

                        callback(null, notificationRq);
                    })


                },
                // Start Notification Business to calculate and process notification logic
                function (notificationRq, callback) {

                    var notificationPlanRequest = notificationBusiness.createPlanNotificationRequest(notificationRq);

                    notificationBusiness.generatePlanNotifications(notificationPlanRequest, callback);

                },
                // send notificastion to the j316-notification module
                function (notificationArray, callback) {
                    var j316callArray = [];
                    _.each(notificationArray, function (notificationItem) {
                        j316callArray.push(function (callCallback) {
                            j316Adapter.scheduleNotification(notificationItem, callCallback);
                        })
                    });
                    async.parallelLimit(j316callArray, 5, callback);
                }
            ], function (err, notificationProcessResponse) {
                if (err) {
                    return res.status(500).send('Problem by notification generation: ' + err);
                }

                console.info('Preparation for sending completed..  start sending');

                return res.status(200).send(notificationProcessResponse);
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
var _ = require('underscore');
var async = require('neo-async');
var moment = require('moment');

/**
 * Business Unit that stores the calculation logic for plan->notification processing
 * @return {{}}
 * @constructor
 */
var NotificationBusiness = function () {

    function randomIntInc(low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    }

    /**
     * Resolves a startTime and returns moment for it
     * @param dateMoment date moment
     * @param timeDef time moment
     */
    var getParsedTimeMoment = function (dateMoment, timeDef) {
        var retVal = dateMoment.clone();

        if (timeDef.indexOf(":") == -1) {
            console.error(timeDef + ' is not a valid time like 10:00');
            return dateMoment;
        }

        var hoursParsed = timeDef.split(":")[0] * 1;
        var minutesParsed = timeDef.split(":")[1] * 1;

        retVal.set('hours', hoursParsed);
        retVal.set('minutes', minutesParsed);
        retVal.set('seconds', 0);

        return retVal;
    }

    /**
     * Generates array of event dates from start and endDates
     * @param startDate start of the plan (incl)
     * @param endDate end of the plan (incl)
     * @param reccurrance reccurance days
     */
    var generateEventDates = function (startDate, endDate, reccurrance) {
        var eventDates = [];
        var dateIterator = moment(startDate, 'DD.MM.YYYY');
        var endDateMoment = moment(endDate, 'DD.MM.YYYY');

        if (!dateIterator.isSameOrBefore(endDateMoment)) {
            console.error('Cannot generate event dates according to the given plan start and end params');
            return [];
        }

        while (dateIterator.isSameOrBefore(endDateMoment)) {
            eventDates.push(dateIterator.clone());
            dateIterator.add(reccurrance, 'days');
        }

        return eventDates;
    };

    /**
     * Creates array of dates where innerjoin to the besetzungArray is matching
     * @param eventDates array of moments passing to the plan
     * @param besetzungArray array of booleans to get dates from
     * @return {Array}
     */
    var mapBesetzteTermine = function (eventDates, besetzungArray) {
        if (!eventDates || !besetzungArray) {
            console.error('Cannot process besetzte Termine because dates or besetzung is not set correctly');
            return [];
        }

        if (eventDates.length == 0 || besetzungArray.length == 0) {
            console.error('Cannot process besetzte Termine because dates or besetzung is empty');
            return [];
        }

        if (eventDates.length > besetzungArray.length) {
            console.error('eventDates array is bigger then given besetzung array.. we cut it.');
        }

        var retVal = [];
        for (var terminIndex = 0; terminIndex < eventDates.length; terminIndex++) {
            if (besetzungArray[terminIndex] === true) {
                retVal.push(eventDates[terminIndex])
            }
        }

        return retVal;
    };

    /**
     * createNotificationElement
     *
     * Creates a new element that can be sent to notification module
     *
     * @param dueDate scheduling date of event (send day/ event date according to the type)
     * @param subject subject to be used (title of event/ subject of email / SMS No impact)
     * @param message message to be sent (description of event/ body of mail/ text of sms)
     * @param recipientName name of recipient
     * @param recipientEmail email of recipient
     * @param recipientMobile mobile of recipient
     * @param notificationType type of notificaition 'sms', 'email', 'cal'
     * @param personUUID uuid of recipient -> referenceId
     * @param planUUID uuid of a plan -> category
     * @param groupUUID uuid of a group -> category
     * @return {{scheduledDate: *, subject: *, message: *, recipient: {name: *, email: *, mobile: *}, notificationType: *, referenceId: *, category: *[]}}
     */
    function createNotificationElement(dueDate, subject, message, recipientName, recipientEmail, recipientMobile, eventLocation, eventStartTime, eventEndTime, notificationType, personUUID, planUUID, groupUUID, sectionUUID) {

        return {
            scheduledDate: moment(dueDate).toISOString(),
            subject: subject,
            message: message,
            recipient: {
                name: recipientName,
                email: recipientEmail,
                mobile: recipientMobile
            },
            eventData: {
                location: eventLocation,
                eventStart: eventStartTime,
                eventEnd: eventEndTime
            },
            notificationType: notificationType,
            referenceId: personUUID,
            category: [planUUID, groupUUID, sectionUUID]
        };
    };

    return {

        /**
         * Creates a new request as it is needed for the notification processing
         *
         * @param requestData request data in form:
         *           {
                        servicePlan: servicePlan,
                        servicePlanGroups: parsedGroupArray,
                        participantsMap: {}
                    };
         * @return {{plan: *}}
         */
        createPlanNotificationRequest: function (requestData) {
            var retVal = {
                planUUID: requestData.servicePlan.uuid,
                planName: requestData.servicePlan.planName,
                groups: [],
                calender: {
                    notificationCal: requestData.servicePlan.notificationCal,
                    eventStartTime: requestData.servicePlan.eventStartTime,
                    eventEndTime: requestData.servicePlan.eventEndTime
                },
                email: {
                    notificationEmail: requestData.servicePlan.notificationEmail,
                    emailText: requestData.servicePlan.emailText,
                    emailSubject: requestData.servicePlan.emailSubject
                },
                sms: {
                    notificationSMS: requestData.servicePlan.notificationSMS,
                    smsText: requestData.servicePlan.smsText
                }
            };

            retVal.eventDates = generateEventDates(
                requestData.servicePlan.planStart,
                requestData.servicePlan.planEnd,
                requestData.servicePlan.eventRecurringDays);

            _.forEach(requestData.servicePlanGroups, function (groupInfo) {
                _.forEach(groupInfo.sections, function (sectionInfo) {
                    var calGroup = {
                        groupUUID: groupInfo.uuid,
                        sectionUUID: sectionInfo.uuid,
                        groupName: groupInfo.name,
                        location: groupInfo.address.location,
                        besetzung: sectionInfo.besetzung,
                        participants: []
                    };

                    _.forEach(sectionInfo.participants, function (participantRef) {
                        var participant = requestData.participantsMap[participantRef.participantUUID];
                        if (participant) {
                            calGroup.participants.push(participant);
                        }
                    });

                    retVal.groups.push(calGroup);

                });

            });

            return retVal;
        },


        /**
         * Creates single notification items according to the request data
         *
         * @param planRequestData
         * @param callback
         */
        generatePlanNotifications: function (planRequestData, callback) {

            if (!planRequestData) {
                return callback('No valid request data is provided')
            }

            var notificationsArray = [];

            // Terate over every notification group and start notification for all dates where the group is in charge
            _.forEach(planRequestData.groups, function (singleGroup) {
                var notificationTerminArray = mapBesetzteTermine(planRequestData.eventDates, singleGroup.besetzung);
                _.forEach(notificationTerminArray, function (termin) {
                    var notificationTermin = termin.clone().add(-2, 'days');
                    if (notificationTermin.isBefore(moment())) {
                        return;
                    }

                    if (planRequestData.calender.notificationCal) {
                        _.forEach(singleGroup.participants, function (participant) {
                            if (participant.notificationCal && participant.email) {

                                var eventStartTime = getParsedTimeMoment(termin, planRequestData.calender.eventStartTime);
                                var eventEndTime = getParsedTimeMoment(termin, planRequestData.calender.eventEndTime);

                                // Prevent google to get in panic by so many events at very short time
                                var randomDelay = randomIntInc(1, 72);

                                var notification = createNotificationElement(
                                    moment().add(randomDelay, 'hours'), // Cal events schould be sent immediately
                                    planRequestData.planName,
                                    singleGroup.groupName, // Currently by event is group name the description-summary
                                    participant.forename + ' ' + participant.surname,
                                    participant.email,
                                    null,
                                    singleGroup.location,
                                    eventStartTime,
                                    eventEndTime,
                                    'cal',
                                    participant.uuid,
                                    planRequestData.planUUID,
                                    singleGroup.groupUUID,
                                    singleGroup.sectionUUID);

                                // TODO: Change that multiple event participants become guest of the same event and not n:n
                                notificationsArray.push(notification);
                            }
                        });
                    }

                    if (planRequestData.email.notificationEmail) {
                        _.forEach(singleGroup.participants, function (participant) {
                            if (participant.notificationEmail && participant.email) {
                                var notificationTermin = termin.clone().add(-2, 'days');
                                var notification = createNotificationElement(
                                    notificationTermin,
                                    planRequestData.email.emailSubject,
                                    planRequestData.email.emailText,
                                    participant.forename + ' ' + participant.surname,
                                    participant.email,
                                    null,
                                    null,
                                    null,
                                    null,
                                    'email',
                                    participant.uuid,
                                    planRequestData.planUUID,
                                    singleGroup.groupUUID,
                                    singleGroup.sectionUUID);

                                // TODO: Change that multiple event participants become guest of the same event and not n:n
                                notificationsArray.push(notification);
                            }
                        });
                    }

                    if (planRequestData.sms.notificationSMS) {
                        _.forEach(singleGroup.participants, function (participant) {
                            if (participant.notificationSMS && participant.mobilePhone) {
                                var notificationTermin = termin.clone().add(-2, 'days');
                                var notification = createNotificationElement(
                                    notificationTermin,
                                    null,
                                    planRequestData.sms.smsText,
                                    participant.forename + ' ' + participant.surname,
                                    null,
                                    participant.mobilePhone,
                                    null,
                                    null,
                                    null,
                                    'sms',
                                    participant.uuid,
                                    planRequestData.planUUID,
                                    singleGroup.groupUUID,
                                    singleGroup.sectionUUID);

                                notificationsArray.push(notification);
                            }
                        });
                    }
                });
            });

            return callback(null, notificationsArray);
        }




    };
};


module.exports = NotificationBusiness;
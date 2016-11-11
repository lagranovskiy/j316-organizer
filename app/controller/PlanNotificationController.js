var uuid = require('node-uuid');
var relationMap = require('../../config/relationMap');
var CrudRepository = require('../model/CrudRepository');
var _ = require('underscore');
var crudRepository = new CrudRepository();

var j316Adapter = require('../adapter/J316NotificatorAdapter');


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
                var planUUID = req.params.entityUUID;

                // Resolve Plan
                // Resolve Notification Configs
                // Resolve Participants
                // Calculate notifications
                // Send notifications

                return res.send({result: 'ok'});


                /**
                 *
                 *  requestify.post(notificationAPI.sms77.endpoint, {}, {
                        params: {
                            u: notificationAPI.sms77.username,
                            p: notificationAPI.sms77.apiToken,
                            type: notificationAPI.sms77.smsType,
                            from: notificationAPI.sms77.senderSMS,
                            text: smsRq.message,
                            to: smsRq.mobile,
                            return_msg_id: 1,
                            debug: notificationAPI.sms77.debugMode
                        }
                    }).then(function (response) {

                        var data = response.body.split('\n')
                        var resultCode = data[0];
                        if (response.getCode() == 200 && resultCode === '100') {

                            callback(null, {
                                resultCode: resultCode,
                                messageId: data[1]
                            });

                        } else {
                            callback('Error code: ' + response.body);
                        }
                    });
                 */
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

                var planUUID = req.params.entityUUID;
                if (!planUUID) {
                    return res.send('No PlanUUID set');
                }

                j316Adapter.getPlanNotifications(null, null, function (err, data) {
                    if(err){
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
                return res.send({result: 'ok'});
            },

            /**
             * Cancel all plan notifications
             * @param req
             * @param res
             * @param next
             * @return {*}
             */
            cancelPlanNotifications: function (req, res, next) {
                return res.send({result: 'ok'});
            },

            /**
             * Cancel all plan notifications
             * @param req
             * @param res
             * @param next
             * @return {*}
             */
            cancelPersonPlanNotifications: function (req, res, next) {
                return res.send({result: 'ok'});
            }


        };

        return controller;

};


module.exports = new PlanNotificationController();
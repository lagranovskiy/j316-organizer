var _ = require('underscore');
var requestify = require('requestify');
var config = require('../../config/config');

/**
 * Controller to wrap notification persistence and logic

 * @author Leonid Agranovskiy
 * @date  11.11.16.
 */
var J316NotificationAdapter = function () {

    return {


        /**
         * Returns active plan notifications
         *
         * @param notification notification
         * @param callback callback
         * @return {*}
         */
        scheduleNotification: function (notification, callback) {
            requestify.post(config.j316NotificatorURI + 'notification?apiToken=' + config.j316NotificatorAPIToken, notification, {
                cache: {cache: false}
            })
            // We dont send error to allow parall execution.
                .then(function (response) {
                    var res = response.getBody();
                    if (response.getCode() == 200) {
                        console.info('Notification created successfully');
                        return callback(null, {success: true, result: res, request: notification});
                    } else {
                        return callback(null, {
                            success: false,
                            errorMessage: response.getCode(),
                            request: notification
                        });
                    }
                })
                .fail(function (response) {
                    console.error('Cannot communicate with j316-notificator api: ' + JSON.stringify(response))
                    return callback(null, {success: false, errorMessage: response.message, request: notification});
                });
        },


        /**
         * Returns active plan notifications
         *
         * @param callback callback
         * @param categoryUUID  categoryUUID
         * @param referenceUUID referenceUUID
         * @return {*}
         */
        getPlanNotifications: function (categoryUUID, referenceUUID, callback) {
            if (categoryUUID && referenceUUID) {
                return callback('Cannot query category and reference together. Please decide you for one of them');
            }

            var suffix = '';
            if (categoryUUID) {
                suffix += 'category/' + categoryUUID;
            } else if (referenceUUID) {
                suffix += 'reference/' + referenceUUID;
            }
            requestify.get(config.j316NotificatorURI + 'notification/' + suffix + '?apiToken=' + config.j316NotificatorAPIToken)
                .then(function (response) {
                    var res = response.getBody();
                    if (response.getCode() == 200) {
                        return callback(null, res);
                    } else {
                        return callback('Error code: ' + response.body);
                    }
                })
                .fail(function (response) {
                    console.error('Cannot communicate with j316-notificator api: ' + JSON.stringify(response))
                    return callback(null, {success: false, errorMessage: response.message});
                });
        },


        /**
         * Remove plan notifications
         *
         * @param callback callback
         * @param categoryUUID  categoryUUID
         * @param referenceUUID referenceUUID
         * @return {*}
         */
        removePlanNotifications: function (categoryUUID, referenceUUID, callback) {
            if (categoryUUID && referenceUUID) {
                return callback('Cannot query category and reference together. Please decide you for one of them');
            }

            var removeRequest = {
                category: categoryUUID,
                referenceId: referenceUUID,
                isSent: true
            };

            requestify.delete(config.j316NotificatorURI + 'notification?apiToken=' + config.j316NotificatorAPIToken, removeRequest)
                .then(function (response) {
                    var res = response.getBody();
                    if (response.getCode() == 200) {
                        return callback(null, res);
                    } else {
                        return callback('Error code: ' + response.body);
                    }
                })
                .fail(function (response) {
                    console.error('Cannot communicate with j316-notificator api: ' + JSON.stringify(response))
                    return callback(null, {success: false, errorMessage: response.message});
                });
        }

    };

};


module.exports = J316NotificationAdapter;
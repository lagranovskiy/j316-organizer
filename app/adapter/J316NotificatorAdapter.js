var _ = require('underscore');
var requestify = require('requestify');

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
         * @param callback callback
         * @return {*}
         */
        scheduleNotification: function (callback) {
            var notification = {
                scheduledDate: '2016-07-29T13:00:00.000Z',
                subject: 'Test',
                message: 'Hello World',
                recipient: {
                    name: 'Leonid',
                    email: 'test@agranovskiy.de',
                    mobile: '017617870248'
                },
                notificationType: 'EMAIL',
                referenceId: 'qweetrwefwf',
                category: ['234234234234', 'Plan1234Q1']
            };

            requestify.post('https://j316-notificator.herokuapp.com/notification')
                .then(function (response) {
                    var res = response.getBody();
                    if (response.getCode() == 200) {
                        return callback(null, res);
                    } else {
                        return callback('Error code: ' + response.body);
                    }
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

            var suffix = '/';
            if (categoryUUID) {
                suffix += 'category/' + categoryUUID;
            } else if (referenceUUID) {
                suffix += 'reference/' + referenceUUID;
            }
            requestify.get('https://j316-notificator.herokuapp.com/notification' + suffix)
                .then(function (response) {
                    var res = response.getBody();
                    if (response.getCode() == 200) {
                        return callback(null, res);
                    } else {
                        return callback('Error code: ' + response.body);
                    }
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

            requestify.delete('https://j316-notificator.herokuapp.com/notification', removeRequest)
                .then(function (response) {
                    var res = response.getBody();
                    if (response.getCode() == 200) {
                        return callback(null, res);
                    } else {
                        return callback('Error code: ' + response.body);
                    }
                });
        }

    };

};


module.exports = J316NotificationAdapter;
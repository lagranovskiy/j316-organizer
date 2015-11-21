var PersonService = require('./../business/PersonService');
var _ = require('underscore');

/**
 * Controller to provide person relation crud functionality
 * @returns {{processSMS77Confirmation: Function}}
 * @constructor
 */
var PersonRelationController = function () {

    var controller = {

        /**
         * Returns the whole list of person relations
         * @param req
         * @param res
         * @param next
         */
        getPersonRelations:function(req,res,next) {

            var personUUID = req.params.uuid;

            if (!personUUID) {
                return next('Error. uuid is empty');
            }

            PersonService.findPerson(personUUID, function (err, result) {
                if (err) {
                    return next(err);
                }

                return res.send(result);
            });
        },




    };

    return controller;
};
module.exports = new PersonRelationController();
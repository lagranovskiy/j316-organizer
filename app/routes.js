var crudControllerFactory = require('./controller/CrudControllerFactory');
var crudRelationControllerFactory = require('./controller/CrudRelationControllerFactory');

var servicePlanController = crudControllerFactory.getCRUD('ServicePlan');
var planNotificationController = require('./controller/PlanNotificationController');

var personController = crudControllerFactory.getCRUD('Person');

var personHasChildRelationController = crudRelationControllerFactory.getRelationCRUD('PersonHasChild');
var personIsHousekeeperOfPostalAddressRelationController = crudRelationControllerFactory.getRelationCRUD('PersonIsHousekeeperOfPostalAddress');
var personIsMarriedWithRelationController = crudRelationControllerFactory.getRelationCRUD('PersonIsMarriedWith');
var personIsRelatedToRelationController = crudRelationControllerFactory.getRelationCRUD('PersonIsRelatedTo');
var personParticipateInServiceRelationController = crudRelationControllerFactory.getRelationCRUD('PersonParticipateInService');
var personHasParentRelationController = crudRelationControllerFactory.getRelationCRUD('PersonHasParent');
var personIsResponsibleForServiceRelationController = crudRelationControllerFactory.getRelationCRUD('PersonIsResponsibleForService');
var personIsMemberOfOrganizationRelationController = crudRelationControllerFactory.getRelationCRUD('PersonMemberOfOrganization');

var serviceController = crudControllerFactory.getCRUD('Service');

var serviceParticipatedPersonRelationController = crudRelationControllerFactory.getRelationCRUD('ServiceParticipatedPerson');

var organizationController = crudControllerFactory.getCRUD('Organization');

var organizationActiveMemberRelationController = crudRelationControllerFactory.getRelationCRUD('OrganizationActiveMember');
var organizationHasLocationRelationController = crudRelationControllerFactory.getRelationCRUD('OrganizationHasLocation');
var organizationInactiveMemberRelationController = crudRelationControllerFactory.getRelationCRUD('OrganizationInactiveMember');
var organizationProvidesServiceRelationController = crudRelationControllerFactory.getRelationCRUD('OrganizationProvidesService');

var postalAddressController = crudControllerFactory.getCRUD('PostalAddress');

var jwt = require('express-jwt');

var config = require('../config/config');

module.exports = function (router) {


    var jwtCheck = jwt({
        secret: new Buffer(config.auth0secret, 'base64'),
        audience: config.auth0audience
    });

    var errorHandler = function (err, req, res, next) {
        console.error(err.stack);

        res.status(500).json({
            text: 'Internal error',
            error: err
        });
    };
    router.use(errorHandler);

    router.all('*', function (req, res, next) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
        res.header("Access-Control-Allow-Credentials", true);
        next();
    });

    /**
     * Operations of Service Plans
     */

    router.get('/serviceplan', jwtCheck, servicePlanController.listEntity);
    router.get('/serviceplan/:entityUUID',jwtCheck, servicePlanController.getEntity);

    router.post('/serviceplan',jwtCheck, servicePlanController.saveEntity);
    router.put('/serviceplan',jwtCheck, servicePlanController.saveEntity);
    router.delete('/serviceplan/:entityUUID',jwtCheck, servicePlanController.deleteEntity);

    /**
     *  Operations on notifications
     */
    router.post('/serviceplan/:planUUID/notifications/start',jwtCheck, planNotificationController.generatePlanNotifications);
    router.get('/serviceplan/:planUUID/notifications',jwtCheck, planNotificationController.getPlanNotifications);
    router.get('/person/:personUUID/notifications', jwtCheck,planNotificationController.getPersonNotifications);
    router.delete('/serviceplan/:planUUID/notifications',jwtCheck, planNotificationController.cancelPersonPlanNotifications);
    router.delete('/serviceplan/:planUUID/person/:personUUID/notifications',jwtCheck, planNotificationController.cancelPersonPlanNotifications);
    router.delete('/person/:personUUID/notifications',jwtCheck, planNotificationController.cancelPersonPlanNotifications);

    /**
     * Operations for person lists
     */
    router.get('/person',jwtCheck, personController.listEntity);
    /**
     * Operations for a single person
     */
    router.get('/person/:entityUUID',jwtCheck, personController.getEntity);
    router.post('/person',jwtCheck, personController.saveEntity);
    router.put('/person',jwtCheck, personController.saveEntity);
    router.delete('/person/:entityUUID',jwtCheck, personController.deleteEntity);

    /**
     * Person Relation Services
     */

    router.get('/person/:sourceUUID/child',jwtCheck, personHasChildRelationController.getRelatedRelations);
    router.put('/person/:sourceUUID/child', jwtCheck,personHasChildRelationController.saveRelation);
    router.delete('/person/:sourceUUID/child/:relationUUID',jwtCheck, personHasChildRelationController.deleteRelation);


    router.get('/person/:sourceUUID/address',jwtCheck, personIsHousekeeperOfPostalAddressRelationController.getRelatedRelations);
    router.put('/person/:sourceUUID/address',jwtCheck, personIsHousekeeperOfPostalAddressRelationController.saveRelation);
    router.delete('/person/:sourceUUID/address/:relationUUID',jwtCheck, personIsHousekeeperOfPostalAddressRelationController.deleteRelation);

    router.get('/person/:sourceUUID/marriage',jwtCheck, personIsMarriedWithRelationController.getRelatedRelations);
    router.put('/person/:sourceUUID/marriage',jwtCheck, personIsMarriedWithRelationController.saveRelation);
    router.delete('/person/:sourceUUID/marriage/:relationUUID',jwtCheck, personIsMarriedWithRelationController.deleteRelation);

    router.get('/person/:sourceUUID/relation',jwtCheck, personIsRelatedToRelationController.getRelatedRelations);
    router.put('/person/:sourceUUID/relation',jwtCheck, personIsRelatedToRelationController.saveRelation);
    router.delete('/person/:sourceUUID/relation/:relationUUID',jwtCheck, personIsRelatedToRelationController.deleteRelation);

    router.get('/person/:sourceUUID/parent',jwtCheck, personHasParentRelationController.getRelatedRelations);
    router.put('/person/:sourceUUID/parent',jwtCheck, personHasParentRelationController.saveRelation);
    router.delete('/person/:sourceUUID/parent/:relationUUID',jwtCheck, personHasParentRelationController.deleteRelation);

    router.get('/person/:sourceUUID/engagement',jwtCheck, personParticipateInServiceRelationController.getRelatedRelations);
    router.put('/person/:sourceUUID/engagement',jwtCheck, personParticipateInServiceRelationController.saveRelation);
    router.delete('/person/:sourceUUID/engagement/:relationUUID',jwtCheck, personParticipateInServiceRelationController.deleteRelation);

    router.get('/person/:sourceUUID/responsibility',jwtCheck, personIsResponsibleForServiceRelationController.getRelatedRelations);
    router.put('/person/:sourceUUID/responsibility',jwtCheck, personIsResponsibleForServiceRelationController.saveRelation);
    router.delete('/person/:sourceUUID/responsibility/:relationUUID',jwtCheck, personIsResponsibleForServiceRelationController.deleteRelation);

    router.get('/person/:sourceUUID/membership',jwtCheck, personIsMemberOfOrganizationRelationController.getRelatedRelations);
    router.put('/person/:sourceUUID/membership',jwtCheck, personIsMemberOfOrganizationRelationController.saveRelation);
    router.delete('/person/:sourceUUID/membership/:relationUUID',jwtCheck, personIsMemberOfOrganizationRelationController.deleteRelation);

    /**
     * Operations for a single Postal Address
     */
    router.get('/postal',jwtCheck, postalAddressController.listEntity);
    router.get('/postal/:entityUUID',jwtCheck, postalAddressController.getEntity);
    router.put('/postal',jwtCheck, postalAddressController.saveEntity);
    router.delete('/postal/:entityUUID',jwtCheck, postalAddressController.deleteEntity);

    /**
     * Operations for a single Service
     */
    router.get('/service',jwtCheck, serviceController.listEntity);
    router.get('/service/:entityUUID',jwtCheck, serviceController.getEntity);
    router.put('/service',jwtCheck, serviceController.saveEntity);
    router.delete('/service/:entityUUID',jwtCheck, serviceController.deleteEntity);

    router.get('/service/:sourceUUID/participant',jwtCheck, serviceParticipatedPersonRelationController.getRelatedRelations);
    router.put('/service/:sourceUUID/participant',jwtCheck, serviceParticipatedPersonRelationController.saveRelation);
    router.delete('/service/:sourceUUID/participant/:relationUUID',jwtCheck, serviceParticipatedPersonRelationController.deleteRelation);

    /**
     * Operations for a single Organization
     */
    router.get('/organization',jwtCheck, organizationController.listEntity);
    router.get('/organization/:entityUUID',jwtCheck, organizationController.getEntity);
    router.put('/organization',jwtCheck, organizationController.saveEntity);
    router.delete('/organization/:entityUUID',jwtCheck, organizationController.deleteEntity);

    router.get('/organization/:sourceUUID/activemember',jwtCheck, organizationActiveMemberRelationController.getRelatedRelations);
    router.put('/organization/:sourceUUID/activemember',jwtCheck, organizationActiveMemberRelationController.saveRelation);
    router.delete('/organization/:sourceUUID/activemember/:relationUUID',jwtCheck, organizationActiveMemberRelationController.deleteRelation);

    router.get('/organization/:sourceUUID/inactivemember',jwtCheck, organizationInactiveMemberRelationController.getRelatedRelations);
    router.put('/organization/:sourceUUID/inactivemember',jwtCheck, organizationInactiveMemberRelationController.saveRelation);
    router.delete('/organization/:sourceUUID/inactivemember/:relationUUID',jwtCheck, organizationInactiveMemberRelationController.deleteRelation);

    router.get('/organization/:sourceUUID/location',jwtCheck, organizationHasLocationRelationController.getRelatedRelations);
    router.put('/organization/:sourceUUID/location',jwtCheck, organizationHasLocationRelationController.saveRelation);
    router.delete('/organization/:sourceUUID/location/:relationUUID',jwtCheck, organizationHasLocationRelationController.deleteRelation);

    router.get('/organization/:sourceUUID/service',jwtCheck, organizationProvidesServiceRelationController.getRelatedRelations);
    router.put('/organization/:sourceUUID/service',jwtCheck, organizationProvidesServiceRelationController.saveRelation);
    router.delete('/organization/:sourceUUID/service/:relationUUID',jwtCheck, organizationProvidesServiceRelationController.deleteRelation);


};

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

var config = require('../config/config');

module.exports = function (router) {


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
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
        res.header("Access-Control-Allow-Credentials", true);
        next();
    });

    /**
     * Operations of Service Plans
     */

    router.get('/serviceplan', servicePlanController.listEntity);
    router.get('/serviceplan/:entityUUID', servicePlanController.getEntity);

    router.post('/serviceplan', servicePlanController.saveEntity);
    router.put('/serviceplan', servicePlanController.saveEntity);
    router.delete('/serviceplan/:entityUUID', servicePlanController.deleteEntity);

    /**
     *  Operations on notifications
     */
    router.post('/serviceplan/:planUUID/notifications/start', planNotificationController.generatePlanNotifications);
    router.get('/serviceplan/:planUUID/notifications', planNotificationController.getPlanNotifications);
    router.get('/person/:personUUID/notifications', planNotificationController.getPersonNotifications);
    router.delete('/serviceplan/:planUUID/notifications', planNotificationController.cancelPersonPlanNotifications);
    router.delete('/serviceplan/:planUUID/person/:personUUID/notifications', planNotificationController.cancelPersonPlanNotifications);
    router.delete('/person/:personUUID/notifications', planNotificationController.cancelPersonPlanNotifications);

    /**
     * Operations for person lists
     */
    router.get('/person', personController.listEntity);
    /**
     * Operations for a single person
     */
    router.get('/person/:entityUUID', personController.getEntity);
    router.post('/person', personController.saveEntity);
    router.put('/person', personController.saveEntity);
    router.delete('/person/:entityUUID', personController.deleteEntity);

    /**
     * Person Relation Services
     */

    router.get('/person/:sourceUUID/child', personHasChildRelationController.getRelatedRelations);
    router.put('/person/:sourceUUID/child', personHasChildRelationController.saveRelation);
    router.delete('/person/:sourceUUID/child/:relationUUID', personHasChildRelationController.deleteRelation);


    router.get('/person/:sourceUUID/address', personIsHousekeeperOfPostalAddressRelationController.getRelatedRelations);
    router.put('/person/:sourceUUID/address', personIsHousekeeperOfPostalAddressRelationController.saveRelation);
    router.delete('/person/:sourceUUID/address/:relationUUID', personIsHousekeeperOfPostalAddressRelationController.deleteRelation);

    router.get('/person/:sourceUUID/marriage', personIsMarriedWithRelationController.getRelatedRelations);
    router.put('/person/:sourceUUID/marriage', personIsMarriedWithRelationController.saveRelation);
    router.delete('/person/:sourceUUID/marriage/:relationUUID', personIsMarriedWithRelationController.deleteRelation);

    router.get('/person/:sourceUUID/relation', personIsRelatedToRelationController.getRelatedRelations);
    router.put('/person/:sourceUUID/relation', personIsRelatedToRelationController.saveRelation);
    router.delete('/person/:sourceUUID/relation/:relationUUID', personIsRelatedToRelationController.deleteRelation);

    router.get('/person/:sourceUUID/parent', personHasParentRelationController.getRelatedRelations);
    router.put('/person/:sourceUUID/parent', personHasParentRelationController.saveRelation);
    router.delete('/person/:sourceUUID/parent/:relationUUID', personHasParentRelationController.deleteRelation);

    router.get('/person/:sourceUUID/engagement', personParticipateInServiceRelationController.getRelatedRelations);
    router.put('/person/:sourceUUID/engagement', personParticipateInServiceRelationController.saveRelation);
    router.delete('/person/:sourceUUID/engagement/:relationUUID', personParticipateInServiceRelationController.deleteRelation);

    router.get('/person/:sourceUUID/responsibility', personIsResponsibleForServiceRelationController.getRelatedRelations);
    router.put('/person/:sourceUUID/responsibility', personIsResponsibleForServiceRelationController.saveRelation);
    router.delete('/person/:sourceUUID/responsibility/:relationUUID', personIsResponsibleForServiceRelationController.deleteRelation);

    router.get('/person/:sourceUUID/membership', personIsMemberOfOrganizationRelationController.getRelatedRelations);
    router.put('/person/:sourceUUID/membership', personIsMemberOfOrganizationRelationController.saveRelation);
    router.delete('/person/:sourceUUID/membership/:relationUUID', personIsMemberOfOrganizationRelationController.deleteRelation);

    /**
     * Operations for a single Postal Address
     */
    router.get('/postal', postalAddressController.listEntity);
    router.get('/postal/:entityUUID', postalAddressController.getEntity);
    router.put('/postal', postalAddressController.saveEntity);
    router.delete('/postal/:entityUUID', postalAddressController.deleteEntity);

    /**
     * Operations for a single Service
     */
    router.get('/service', serviceController.listEntity);
    router.get('/service/:entityUUID', serviceController.getEntity);
    router.put('/service', serviceController.saveEntity);
    router.delete('/service/:entityUUID', serviceController.deleteEntity);

    router.get('/service/:sourceUUID/participant', serviceParticipatedPersonRelationController.getRelatedRelations);
    router.put('/service/:sourceUUID/participant', serviceParticipatedPersonRelationController.saveRelation);
    router.delete('/service/:sourceUUID/participant/:relationUUID', serviceParticipatedPersonRelationController.deleteRelation);

    /**
     * Operations for a single Organization
     */
    router.get('/organization', organizationController.listEntity);
    router.get('/organization/:entityUUID', organizationController.getEntity);
    router.put('/organization', organizationController.saveEntity);
    router.delete('/organization/:entityUUID', organizationController.deleteEntity);

    router.get('/organization/:sourceUUID/activemember', organizationActiveMemberRelationController.getRelatedRelations);
    router.put('/organization/:sourceUUID/activemember', organizationActiveMemberRelationController.saveRelation);
    router.delete('/organization/:sourceUUID/activemember/:relationUUID', organizationActiveMemberRelationController.deleteRelation);

    router.get('/organization/:sourceUUID/inactivemember', organizationInactiveMemberRelationController.getRelatedRelations);
    router.put('/organization/:sourceUUID/inactivemember', organizationInactiveMemberRelationController.saveRelation);
    router.delete('/organization/:sourceUUID/inactivemember/:relationUUID', organizationInactiveMemberRelationController.deleteRelation);

    router.get('/organization/:sourceUUID/location', organizationHasLocationRelationController.getRelatedRelations);
    router.put('/organization/:sourceUUID/location', organizationHasLocationRelationController.saveRelation);
    router.delete('/organization/:sourceUUID/location/:relationUUID', organizationHasLocationRelationController.deleteRelation);

    router.get('/organization/:sourceUUID/service', organizationProvidesServiceRelationController.getRelatedRelations);
    router.put('/organization/:sourceUUID/service', organizationProvidesServiceRelationController.saveRelation);
    router.delete('/organization/:sourceUUID/service/:relationUUID', organizationProvidesServiceRelationController.deleteRelation);

    /**
     * Test if the caller gave the apiToken in the apiToken query param.
     *
     * @param req
     * @param res
     * @param next
     */
    function authorize(req, res, next) {

        if (!req.query.apiToken) {
            res.sendStatus(401);
            return next('No API_TOKEN sent. Cannot process');
        }
        if (req.query.apiToken !== config.apiToken) {
            res.sendStatus(401);
            return next('Token API_TOKEN is invalid. Cannot process');
        }

        next();
    }

};

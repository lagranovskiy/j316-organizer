var crudControllerFactory = require('./controller/CrudControllerFactory');
var crudRelationControllerFactory = require('./controller/CrudRelationControllerFactory');

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

module.exports = function(app) {


    var errorHandler = function(err, req, res, next) {
        console.error(err.stack);

        res.status(500).json({
            text: 'Internal error',
            error: err
        });
    };
    app.use(errorHandler);


    app.all('*', function(req, res, next) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
        res.header("Access-Control-Allow-Credentials", true);
        next();
    });


    /**
     * Operations for peson lists
     */
    app.get('/person', personController.listEntity);
    /**
     * Operations for a single person
     */
    app.get('/person/:entityUUID', personController.getEntity);
    app.post('/person', personController.saveEntity);
    app.put('/person', personController.saveEntity);
    app.delete('/person/:entityUUID', personController.deleteEntity);

    /**
     * Person Relation Services
     */

    app.get('/person/:sourceUUID/child', personHasChildRelationController.getRelatedRelations);
    app.put('/person/:sourceUUID/child', personHasChildRelationController.saveRelation);
    app.delete('/person/:sourceUUID/child/:relationUUID', personHasChildRelationController.deleteRelation);


    app.get('/person/:sourceUUID/address', personIsHousekeeperOfPostalAddressRelationController.getRelatedRelations);
    app.put('/person/:sourceUUID/address', personIsHousekeeperOfPostalAddressRelationController.saveRelation);
    app.delete('/person/:sourceUUID/address/:relationUUID', personIsHousekeeperOfPostalAddressRelationController.deleteRelation);

    app.get('/person/:sourceUUID/marriage', personIsMarriedWithRelationController.getRelatedRelations);
    app.put('/person/:sourceUUID/marriage', personIsMarriedWithRelationController.saveRelation);
    app.delete('/person/:sourceUUID/marriage/:relationUUID', personIsMarriedWithRelationController.deleteRelation);

    app.get('/person/:sourceUUID/relation', personIsRelatedToRelationController.getRelatedRelations);
    app.put('/person/:sourceUUID/relation', personIsRelatedToRelationController.saveRelation);
    app.delete('/person/:sourceUUID/relation/:relationUUID', personIsRelatedToRelationController.deleteRelation);

    app.get('/person/:sourceUUID/parent', personHasParentRelationController.getRelatedRelations);
    app.put('/person/:sourceUUID/parent', personHasParentRelationController.saveRelation);
    app.delete('/person/:sourceUUID/parent/:relationUUID', personHasParentRelationController.deleteRelation);

    app.get('/person/:sourceUUID/engagement', personParticipateInServiceRelationController.getRelatedRelations);
    app.put('/person/:sourceUUID/engagement', personParticipateInServiceRelationController.saveRelation);
    app.delete('/person/:sourceUUID/engagement/:relationUUID', personParticipateInServiceRelationController.deleteRelation);

    app.get('/person/:sourceUUID/responsibility', personIsResponsibleForServiceRelationController.getRelatedRelations);
    app.put('/person/:sourceUUID/responsibility', personIsResponsibleForServiceRelationController.saveRelation);
    app.delete('/person/:sourceUUID/responsibility/:relationUUID', personIsResponsibleForServiceRelationController.deleteRelation);

    app.get('/person/:sourceUUID/membership', personIsMemberOfOrganizationRelationController.getRelatedRelations);
    app.put('/person/:sourceUUID/membership', personIsMemberOfOrganizationRelationController.saveRelation);
    app.delete('/person/:sourceUUID/membership/:relationUUID', personIsMemberOfOrganizationRelationController.deleteRelation);

    /**
     * Operations for a single Postal Address
     */
    app.get('/postal', postalAddressController.listEntity);
    app.get('/postal/:entityUUID', postalAddressController.getEntity);
    app.put('/postal', postalAddressController.saveEntity);
    app.delete('/postal/:entityUUID', postalAddressController.deleteEntity);

    /**
     * Operations for a single Service
     */
    app.get('/service', serviceController.listEntity);
    app.get('/service/:entityUUID', serviceController.getEntity);
    app.put('/service', serviceController.saveEntity);
    app.delete('/service/:entityUUID', serviceController.deleteEntity);

    app.get('/service/:sourceUUID/participant', serviceParticipatedPersonRelationController.getRelatedRelations);
    app.put('/service/:sourceUUID/participant', serviceParticipatedPersonRelationController.saveRelation);
    app.delete('/service/:sourceUUID/participant/:relationUUID', serviceParticipatedPersonRelationController.deleteRelation);

    /**
     * Operations for a single Organization
     */
    app.get('/organization', organizationController.listEntity);
    app.get('/organization/:entityUUID', organizationController.getEntity);
    app.put('/organization', organizationController.saveEntity);
    app.delete('/organization/:entityUUID', organizationController.deleteEntity);

    app.get('/organization/:sourceUUID/activemember', organizationActiveMemberRelationController.getRelatedRelations);
    app.put('/organization/:sourceUUID/activemember', organizationActiveMemberRelationController.saveRelation);
    app.delete('/organization/:sourceUUID/activemember/:relationUUID', organizationActiveMemberRelationController.deleteRelation);
    
    app.get('/organization/:sourceUUID/inactivemember', organizationInactiveMemberRelationController.getRelatedRelations);
    app.put('/organization/:sourceUUID/inactivemember', organizationInactiveMemberRelationController.saveRelation);
    app.delete('/organization/:sourceUUID/inactivemember/:relationUUID', organizationInactiveMemberRelationController.deleteRelation);

    app.get('/organization/:sourceUUID/location', organizationHasLocationRelationController.getRelatedRelations);
    app.put('/organization/:sourceUUID/location', organizationHasLocationRelationController.saveRelation);
    app.delete('/organization/:sourceUUID/location/:relationUUID', organizationHasLocationRelationController.deleteRelation);

    app.get('/organization/:sourceUUID/service', organizationProvidesServiceRelationController.getRelatedRelations);
    app.put('/organization/:sourceUUID/service', organizationProvidesServiceRelationController.saveRelation);
    app.delete('/organization/:sourceUUID/service/:relationUUID', organizationProvidesServiceRelationController.deleteRelation);

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
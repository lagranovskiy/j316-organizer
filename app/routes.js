var crudControllerFactory = require('./controller/CrudControllerFactory');
var crudRelationControllerFactory = require('./controller/CrudRelationControllerFactory');

var personController =  crudControllerFactory.getCRUD('Person');

var personHasChildRelationController = crudRelationControllerFactory.getRelationCRUD('PersonHasChild');
var personIsHousekeeperOfPostalAddressRelationController = crudRelationControllerFactory.getRelationCRUD('PersonIsHousekeeperOfPostalAddress');
var personIsMarriedWithRelationController = crudRelationControllerFactory.getRelationCRUD('PersonIsMarriedWith');
var personIsRelatedToRelationController = crudRelationControllerFactory.getRelationCRUD('PersonIsRelatedTo');
var personParticipateInServiceRelationController = crudRelationControllerFactory.getRelationCRUD('PersonParticipateInService');
var personHasParentRelationController = crudRelationControllerFactory.getRelationCRUD('PersonHasParent');
var personIsResponsibleForServiceRelationController = crudRelationControllerFactory.getRelationCRUD('PersonIsResponsibleForService');
var personIsMemberOfOrganizationRelationController = crudRelationControllerFactory.getRelationCRUD('PersonMemberOfOrganization');

var serviceController =  crudControllerFactory.getCRUD('Service');
var organizationController =  crudControllerFactory.getCRUD('Organization');
var postalAddressController =  crudControllerFactory.getCRUD('PostalAddress');

var config = require('../config/config');

module.exports = function (app) {


    var errorHandler = function (err, req, res, next) {
        console.error(err.stack);

        res.status(500).json({
            text: 'Internal error',
            error: err
        });
    };
    app.use(errorHandler);


    app.all('*', function (req, res, next) {
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
   
    app.get('/person/:sourceUUID/relations/child', personHasChildRelationController.getRelatedRelations);
    app.put('/person/:sourceUUID/relation/child', personHasChildRelationController.saveRelation);
    app.delete('/person/:sourceUUID/relation/:relationUUID/child', personHasChildRelationController.deleteRelation);

    
    app.get('/person/:sourceUUID/relations/address', personIsHousekeeperOfPostalAddressRelationController.getRelatedRelations);
    app.put('/person/:sourceUUID/relations/address', personIsHousekeeperOfPostalAddressRelationController.saveRelation);
    app.delete('/person/:sourceUUID/relations/:relationUUID/address', personIsHousekeeperOfPostalAddressRelationController.deleteRelation);

    app.get('/person/:sourceUUID/relations/marriage', personIsMarriedWithRelationController.getRelatedRelations);
    app.put('/person/:sourceUUID/relations/marriage', personIsMarriedWithRelationController.getRelatedRelations);
    app.delete('/person/:sourceUUID/relations/:relationUUID/marriage', personIsMarriedWithRelationController.getRelatedRelations);

    app.get('/person/:sourceUUID/relations/relatedPerson', personIsRelatedToRelationController.getRelatedRelations);
    app.put('/person/:sourceUUID/relations/relatedPerson', personIsRelatedToRelationController.getRelatedRelations);
    app.delete('/person/:sourceUUID/relations/:relationUUID/relatedPerson', personIsRelatedToRelationController.getRelatedRelations);

    app.get('/person/:sourceUUID/relations/parent', personHasParentRelationController.getPersonHasParent);
    app.put('/person/:sourceUUID/relations/parent', personHasParentRelationController.getPersonHasParent);
    app.delete('/person/:sourceUUID/relations/:relationUUID/parent', personHasParentRelationController.getPersonHasParent);

    app.get('/person/:sourceUUID/relations/engagement', personParticipateInServiceRelationController.getRelatedRelations);
    app.put('/person/:sourceUUID/relations/engagement', personParticipateInServiceRelationController.getRelatedRelations);
    app.delete('/person/:sourceUUID/relations/:relationUUID/engagement', personParticipateInServiceRelationController.getRelatedRelations);

    app.get('/person/:sourceUUID/relations/responsibility', personIsResponsibleForServiceRelationController.getPersonIsResponsibleForService);
    app.put('/person/:sourceUUID/relations/responsibility', personIsResponsibleForServiceRelationController.getPersonIsResponsibleForService);
    app.delete('/person/:sourceUUID/relations/:relationUUID/responsibility', personIsResponsibleForServiceRelationController.getPersonIsResponsibleForService);

    app.get('/person/:sourceUUID/relations/membership', personIsMemberOfOrganizationRelationController.getPersonMemberOfOrganization);
    app.put('/person/:sourceUUID/relations/membership', personIsMemberOfOrganizationRelationController.getPersonMemberOfOrganization);
    app.delete('/person/:sourceUUID/relations/:relationUUID/membership', personIsMemberOfOrganizationRelationController.getPersonMemberOfOrganization);

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


    /**
     * Operations for a single Organization
     */
    app.get('/organization', organizationController.listEntity);
    app.get('/organization/:entityUUID', organizationController.getEntity);
    app.put('/organization', organizationController.saveEntity);
    app.delete('/organization/:entityUUID', organizationController.deleteEntity);


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
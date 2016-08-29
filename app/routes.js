var personController = require('./controller/PersonController');
var personRelationController = require('./controller/PersonRelationController');
var postalAddressController = require('./controller/PostalAddressController');
var serviceController = require('./controller/ServiceController');
var organizationController = require('./controller/OrganizationController');
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
    app.get('/person', personController.listPersons);

    /**
     * Operations for a single person
     */
    app.get('/person/:uuid', personController.getPerson);
    app.post('/person', personController.createPerson);
    app.put('/person', personController.updatePerson);
    app.delete('/person/:uuid', personController.deletePerson);

    /**
     * Person Relation Services
     */
    
    app.get('/person/:uuid/relations/address', personRelationController.getPersonIsHousekeeperOfPostalAddress);
    app.put('/person/:uuid/relation/address', personRelationController.putPersonIsHousekeeperOfPostalAddress);
    app.get('/person/:uuid/relations/marriage', personRelationController.getPersonIsMarriedWith);
    app.put('/person/:uuid/relation/marriage', personRelationController.putPersonIsMarriedWith);
    app.get('/person/:uuid/relations/relatedPerson', personRelationController.getPersonIsRelatedTo);
    app.put('/person/:uuid/relation/relatedPerson', personRelationController.putPersonIsRelatedTo);
    app.get('/person/:uuid/relations/child', personRelationController.getPersonHasChild);
    app.put('/person/:uuid/relation/child', personRelationController.putPersonHasChild);
    app.get('/person/:uuid/relations/parent', personRelationController.getPersonHasParent);
    app.put('/person/:uuid/relation/parent', personRelationController.putPersonHasParent);
    app.get('/person/:uuid/relations/engagement', personRelationController.getPersonParticipateInService);
    app.put('/person/:uuid/relation/engagement', personRelationController.putPersonParticipateInService);
    app.get('/person/:uuid/relations/responsibility', personRelationController.getPersonIsResponsibleForService);
    app.put('/person/:uuid/relation/responsibility', personRelationController.putPersonIsResponsibleForService);
    app.get('/person/:uuid/relations/membership', personRelationController.getPersonMemberOfOrganization);
    app.put('/person/:uuid/relation/membership', personRelationController.putPersonMemberOfOrganization);
    app.delete('/relation/:uuid', personRelationController.deletePersonRelation);

    /**
     * Operations for a single Postal Address
     */
    app.get('/postal', postalAddressController.listPostalAddress);
    app.get('/postal/:uuid', postalAddressController.getPostalAddress);
    app.put('/postal', postalAddressController.savePostalAddress);
    app.delete('/postal/:uuid', postalAddressController.deletePostalAddress);

    /**
     * Operations for a single Service
     */
    app.get('/service', serviceController.listService);
    app.get('/service/:uuid', serviceController.getService);
    app.put('/service', serviceController.saveService);
    app.delete('/service/:uuid', serviceController.deleteService);


    /**
     * Operations for a single Organization
     */
    app.get('/organization', organizationController.listOrganization);
    app.get('/organization/:uuid', organizationController.getOrganization);
    app.put('/organization', organizationController.saveOrganization);
    app.delete('/organization/:uuid', organizationController.deleteOrganization);


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
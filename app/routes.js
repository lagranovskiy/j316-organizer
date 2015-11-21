var personController = require('./controller/PersonController');
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
    app.get('/person/:uuid', personController.findPerson);
    app.post('/person', personController.createPerson);
    app.put('/person', personController.updatePerson);
    app.delete('/person/:uuid', personController.deletePerson);

    /**
     * Person Relation Services
     */
    app.get('/person/:uuid/relations', personController.findPerson);
    app.get('/person/:uuid/relations/address', personController.findPerson);
    app.get('/person/:uuid/relations/marriage', personController.findPerson);
    app.get('/person/:uuid/relations/relatedPerson', personController.findPerson);
    app.get('/person/:uuid/relations/child', personController.findPerson);
    app.get('/person/:uuid/relations/parent', personController.findPerson);
    app.get('/person/:uuid/relations/engagement', personController.findPerson);
    app.get('/person/:uuid/relations/responsibility', personController.findPerson);

    app.put('/person/:uuid/relation/address', personController.updatePerson);
    app.put('/person/:uuid/relation/marriage', personController.updatePerson);
    app.put('/person/:uuid/relation/relatedPerson', personController.updatePerson);
    app.get('/person/:uuid/relations/child', personController.findPerson);
    app.put('/person/:uuid/relation/parent', personController.updatePerson);
    app.put('/person/:uuid/relation/engagement', personController.updatePerson);
    app.put('/person/:uuid/relation/responsibility', personController.updatePerson);

    app.delete('/person/:uuid/relation/address', personController.updatePerson);
    app.delete('/person/:uuid/relation/marriage', personController.updatePerson);
    app.delete('/person/:uuid/relation/relatedPerson', personController.updatePerson);
    app.delete('/person/:uuid/relations/child', personController.findPerson);
    app.delete('/person/:uuid/relation/parent', personController.updatePerson);
    app.delete('/person/:uuid/relation/engagement', personController.updatePerson);
    app.delete('/person/:uuid/relation/responsibility', personController.updatePerson);


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
var async = require('neo-async'),
    Person = require('./Person'),
    _ = require('underscore'),
    config = require('../../config/config'),
    neo4j = require('neo4j'),
    db = new neo4j.GraphDatabase(config.neo4j);

function CrudRepository() {
}


/**
 * Returns a entity  given type and uuid
 *
 * @param entityType entityType
 * @param uuid uuid
 * @param retValCallback
 */
CrudRepository.prototype.getEntity = function (entityType, uuid, retValCallback) {

    console.info('Repository: Resolving ' + entityType + ' with uuid ' + uuid);
    var query = [
        'MATCH (entity:' + entityType + '{uuid: {uuid}})',
        //'WHERE entity.isDeleted = false OR entity.isDeleted IS NULL',
        'RETURN entity'
    ].join('\n');

    var params = {
        uuid: uuid
    };

    async.waterfall([
        function (callback) {
            db.query(query, params, callback);
        },
        function (results, callback) {
            if (!results || results.length != 1) {
                return callback('Cannot resolve ' + entityType + ' by uuid: ' + uuid + '.');
            }
            console.info('Repository: Resolving ' + entityType + ' with uuid ' + uuid + ' completed.');
            return callback(null, results[0].entity.data);
        }
    ], retValCallback);
};

/**
 * Returns a list of all saved entities of given type
 *
 * @param retValCallback
 * @returns {*}
 */
CrudRepository.prototype.listEntity = function (entityType, retValCallback) {
    console.info('Repository: Listing of all ' + entityType + '.');
    var query = [
        'MATCH (entity:' + entityType + ')',
        'WHERE entity.isDeleted = false OR entity.isDeleted IS NULL',
        'RETURN entity'
    ].join('\n');


    async.waterfall([
        function (callback) {
            db.query(query, null, callback);
        },
        function (results, callback) {

            var retVal = [];
            _.each(results, function (entitiyRs) {
                retVal.push(entitiyRs.entity.data);
            });
            console.info('Repository: Listing of all ' + entityType + ' completed.');
            return callback(null, retVal);
        }
    ], retValCallback);
};


/**
 * Creates or saves existing entity. Returns the data of the saved entity
 *
 *@param entityType type of entity
 * @param entityData data for saving
 * @param retValCallback
 * @returns {*}
 */
CrudRepository.prototype.saveEntity = function (entityType, entityData, retValCallback) {
    console.info('Repository: Saving of ' + entityType + ' with uuid ' + entityData.uuid);
    entityData.isDeleted = false;
    entityData = _.omit(entityData, 'extra');

    var query = [
        'MERGE (entity:' + entityType + '{uuid:{uuid}})',
        'ON MATCH SET entity={entityData}, entity.lastSeen = timestamp()',
        'ON CREATE SET entity={entityData}, entity.created = timestamp(), entity.lastSeen = timestamp()',
        'RETURN entity'
    ].join('\n');

    var param = {
        uuid: entityData.uuid,
        entityData: entityData
    };

    async.waterfall([
        function (callback) {
            db.query(query, param, callback);
        },
        function (entityDataArray, callback) {

            if (!entityDataArray || entityDataArray.length != 1) {
                return callback('Cannot update entity. Unknown problem happened.');
            }
            console.info('Repository: Saving of ' + entityType + ' with uuid ' + entityData.uuid + ' completed.');
            return callback(null, entityDataArray[0].entity.data);
        }
    ], retValCallback);
};


/**
 * Deletes Entity. Marks it as deleted
 * @param entityType entityType
 * @param uuid uuid
 * @param retValCallback
 */
CrudRepository.prototype.deleteEntity = function (entityType, uuid, retValCallback) {
    console.info('Repository: Deleting of ' + entityType + ' with uuid ' + uuid);
    if (!uuid) {
        return retValCallback('Cannot update entity. Invalid args.');
    }

    var query = [
        'MATCH (entity:' + entityType + '{ uuid:{uuid}})',
        'OPTIONAL MATCH (entity)-[relation]-()',
        'WHERE entity.isDeleted=false OR entity.isDeleted IS NULL',
        'SET entity.isDeleted=true, entity.deleted=timestamp()',
        'SET relation.isDeleted=true, relation.deleted=timestamp()',
        'RETURN entity'
    ].join('\n');

    var params = {
        uuid: uuid
    };

    async.waterfall([function (callback) {
        db.query(query, params, callback);
    }, function (entityData, callback) {

        if (!entityData || entityData.length != 1) {
            return callback('Cannot delete ' + entityType + ' with uuid ' + uuid + '. Not found');
        }

        return callback(null, {uuid: uuid, deleted: true});
    }], function (err, info) {
        if (err) {
            return retValCallback('Cannot delete ' + entityType + ' with uuid ' + uuid + ' : ' + err);
        }
        console.info('Repository: Deleting of ' + entityType + ' with uuid ' + uuid + ' completed.');
        return retValCallback(null, info);

    });
};


module.exports = CrudRepository;
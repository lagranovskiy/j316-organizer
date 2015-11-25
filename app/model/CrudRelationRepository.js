var async = require('neo-async'),
    Person = require('./Person'),
    _ = require('underscore'),
    config = require('../../config/config'),
    neo4j = require('neo4j'),
    db = new neo4j.GraphDatabase(config.neo4j);

function CrudRelationRepository() {
}


/**
 * Returns a all relations of given type to the given target type from source with given uuid
 *
 * @param entityType entityType
 * @param uuid uuid
 * @param retValCallback
 */
CrudRelationRepository.prototype.getRelationByUUID = function (relationType, uuid, retValCallback) {

    console.info('Resolving ' + relationType + ' relation with uuid ' + uuid);
    var query = [
        'MATCH (source) - [relation:' + relationType + ' {uuid: {uuid}}] -> (target))',
        'WHERE (source.isDeleted = false OR source.isDeleted IS NULL)',
        'AND (target.isDeleted = false OR target.isDeleted IS NULL)',
        'RETURN source, relation, target'
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
                return callback('Cannot resolve ' + relationType + ' by uuid: ' + uuid + '.');
            }
            console.info('Resolving ' + relationType + ' with uuid ' + uuid + ' completed.');

            var retVal = {
                source: results[0].source.data,
                relation: results[0].relation.data,
                relationType: relationType,
                target: results[0].target.data
            };

            return callback(null, retVal);
        }
    ], retValCallback);
};

/**
 * Returns all relations from source to target (undirected) with source uuid = uuid
 * @param sourceType type of source object
 * @param sourceUUID uuid of the source object
 * @param relationType type of relation
 * @param targetType type of target
 * @param retValCallback callback
 */
CrudRelationRepository.prototype.getRelationBySourceAndType = function (sourceType, sourceUUID, relationType, targetType, retValCallback) {
    console.info('Listing of all relations of type' + relationType + ' between ' + sourceType + '(uuid:' + sourceUUID + ') and ' + targetType + '.');

    var query = [
        'MATCH (source:' + sourceType + ' {uuid: {uuid}})-[relation:' + relationType + ']-(target:' + targetType + ')',
        'WHERE (source.isDeleted = false OR source.isDeleted IS NULL)',
        'AND (target.isDeleted = false OR target.isDeleted IS NULL)',
        'RETURN source, relation, target'
    ].join('\n');

    var params = {
        uuid: uuid
    };


    async.waterfall([
        function (callback) {
            db.query(query, params, callback);
        },
        function (results, callback) {

            var retVal = [];
            _.each(results, function (relationRs) {
                retVal.push({
                    source: relationRs.source.data,
                    relation: relationRs.relation.data,
                    relationType: relationType,
                    target: relationRs.target.data
                });
            });
            console.info('Listing of all ' + relationType + ' between ' + sourceType + '(uuid:' + sourceUUID + ') and ' + targetType + ' completed.');
            return callback(null, retVal);
        }
    ], retValCallback);
};


/**
 * Creates or saves relation between two typed entities identified by uuid with relation data as association
 *
 * @param sourceType the source type
 * @param sourceUUID uuid of source
 * @param relationData relation data of source
 * @param relationType type of relation
 * @param targetType target type
 * @param targetUUID target uuid
 * @param retValCallback
 */
CrudRelationRepository.prototype.saveRelation = function (sourceType, sourceUUID, relationType, relationData, targetType, targetUUID, retValCallback) {
    console.info('Saving relation of type' + relationType + ' between ' + sourceType + '(uuid:' + sourceUUID + ') and ' + targetType + '.');

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
            console.info('Saving of ' + entityType + ' with uuid ' + entityData.uuid + ' completed.');
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
CrudRelationRepository.prototype.deleteEntity = function (entityType, uuid, retValCallback) {
    console.info('Deleting of ' + entityType + ' with uuid ' + uuid);
    if (!uuid) {
        return callback('Cannot update entity. Invalid args.');
    }

    var query = [
        'MATCH (entity:' + entityType + '{ uuid:{uuid}})',
        'WHERE entity.isDeleted=false OR entity.isDeleted IS NULL',
        'SET entity.isDeleted=true, entity.deleted=timestamp()',
        'RETURN entity'
    ].join('\n');

    var params = {
        uuid: uuid
    };

    async.waterfall([function (callback) {
        db.query(query, params, callback);
    }, function (entityData, callback) {

        if (!entityData || entityData.length != 1) {
            return callback('Cannot delete ' + entityType + ' with uuid ' + uuid + ' . Not found');
        }

        callback(null, entityType + ' with uuid ' + uuid + ' removed.');
    }], function (err, info) {
        if (err) {
            return retValCallback('Cannot delete ' + entityType + ' with uuid ' + uuid + ' : ' + err);
        }
        console.info('Deleting of ' + entityType + ' with uuid ' + uuid + 'completed.');
        return retValCallback(null, info);

    });
};


module.exports = CrudRelationRepository;
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
 * @param relation relation
 * @param retValCallback
 */
CrudRelationRepository.prototype.getRelated = function (relation, retValCallback) {
    var meta = relation.getMetaInfo();

    console.info('Resolving related relations of type' + meta.relationType + ' between ' + meta.sourceType + ' (' + meta.sourceUUID + ') and ' + meta.targetType + ' (' + meta.targetUUID + ') ');
    var query = [
        'MATCH (source:' + meta.sourceType + ') - [relation:' + meta.relationType + '] -' + (!meta.ignoreDirection ? '>' : '') + ' (target:' + meta.targetType + '))',
        'WHERE (relation.isDeleted = false OR relation.isDeleted IS NULL)',
        'AND (source.isDeleted = false OR source.isDeleted IS NULL)',
        'AND (target.isDeleted = false OR target.isDeleted IS NULL)',
        'AND (source.uuid = {sourceUUID} OR {sourceUUID} IS NULL)',
        'AND (target.uuid = {targetUUID} OR {sourceUUID} IS NULL)',
        'RETURN source, relation, target'
    ].join('\n');

    var params = {
        sourceUUID: meta.sourceUUID,
        targetUUID: meta.targetUUID
    };

    async.waterfall([
        function (callback) {
            db.query(query, params, callback);
        },
        function (results, callback) {

            if (!results || results.length != 1) {
                return callback('Cannot resolve  relation ' + meta.relationType + ' between ' + meta.sourceType + ' (' + meta.sourceUUID + ') and ' + meta.targetType + ' (' + meta.targetUUID + ') ');
            }

            var retVal = [];
            _.each(results, function (relationRs) {
                retVal.push({
                    source: relationRs.source.data,
                    relation: relationRs.relation.data,
                    target: relationRs.target.data
                });
            });

            console.info('Resolving related relations of type' + meta.relationType + ' between ' + meta.sourceType + ' (' + meta.sourceUUID + ') and ' + meta.targetType + ' (' + meta.targetUUID + ') completed.');

            return callback(null, retVal);
        }
    ], retValCallback);
};


/**
 * Creates or saves relation between two typed entities identified by uuid with relation data as association
 *
 * @param relation relation definition to be saved
 * @param retValCallback
 */
CrudRelationRepository.prototype.saveRelation = function (relation, retValCallback) {
    var meta = relation.getMetaInfo();
    /**
     *     var meta = {
                sourceType: sourceType,
                sourceUUID: sourceUUID,
                relationType: relationType,
                targetType: targetType,
                targetUUID: targetUUID,
                ignoreDirection: ignoreDirection
            };
     */
    console.info('Saving relation of relation' + meta.relationType + ' (' + relation.uuid + ') between ' + meta.sourceType + '(uuid:' + meta.sourceUUID + ') and ' + meta.targetType + '(uuid:' + meta.targetUUID + ')');

    relation.isDeleted = false;

    var query = [
        'MATCH (source:' + meta.sourceType + '{uuid:{sourceUUID}}), (target:' + meta.targetType + '{uuid:{targetUUID}}), ',
        'MERGE (source)-[relation:' + meta.relationType + '{uuid:{relationUUID}})]-' + (!meta.ignoreDirection ? '>' : '') + '(target)',
        'ON MATCH SET relation={relationData}, relation.lastSeen = timestamp()',
        'ON CREATE SET relation={relationData}, relation.created = timestamp(), relation.lastSeen = timestamp()',
        'RETURN source, relation, target'
    ].join('\n');

    var param = {
        sourceUUID: meta.sourceUUID,
        targetUUID: meta.targetUUID,
        relationUUID: relation.uuid,
        relationData: relation
    };

    async.waterfall([
        function (callback) {
            db.query(query, param, callback);
        },
        function (entityDataArray, callback) {

            if (!entityDataArray || entityDataArray.length != 1) {
                return callback('Cannot update relation. Unknown problem happened.');
            }
            console.info('Saving of relation' + meta.relationType + ' (' + relation.uuid + ') between ' + meta.sourceType + '(uuid:' + meta.sourceUUID + ') and ' + meta.targetType + '(uuid:' + meta.targetUUID + ') completed');

            return callback(null, {
                source: entityDataArray[0].source.data,
                relation: entityDataArray[0].relation.data,
                target: entityDataArray[0].target.data
            });
        }
    ], retValCallback);
};


/**
 * Deletes relation. Marks it as deleted
 * @param relation relation definition to be removed. relation uuid is mandatory
 * @param retValCallback
 */
CrudRelationRepository.prototype.deleteRelation = function (relation, retValCallback) {

    var meta = relation.getMetaInfo();
    /**
     *     var meta = {
                sourceType: sourceType,
                sourceUUID: sourceUUID,
                relationType: relationType,
                targetType: targetType,
                targetUUID: targetUUID,
                ignoreDirection: ignoreDirection
            };
     */


    console.info('Deleting relation' + meta.relationType + ' (' + relation.uuid + ') between ' + meta.sourceType + '(uuid:' + meta.sourceUUID + ') and ' + meta.targetType + '(uuid:' + meta.targetUUID + ') completed');

    if (!relation.uuid) {
        return retValCallback('Cannot delete entity. Invalid args.');
    }

    var query = [
        'MATCH (source:' + meta.sourceType + ')-[relation:' + meta.relationType + '{uuid:{relationUUID}}]-' + (!meta.ignoreDirection ? '>' : '') + '(target:' + meta.targetType + '), ',
        'WHERE relation.isDeleted=false OR relation.isDeleted IS NULL',
        'SET entity.isDeleted=true, entity.deleted=timestamp()',
        'RETURN source, relation, target'
    ].join('\n');

    var params = {
        relationUUID: relation.uuid
    };

    async.waterfall([function (callback) {
        db.query(query, params, callback);
    }, function (entityData, callback) {

        if (!entityData || entityData.length != 1) {
            return callback('Cannot delete ' + meta.relationType + ' with uuid ' + relation.uuid + ' . Not found');
        }

        callback(null, {
            source: entityData[0].source.data,
            relation: entityData[0].relation.data,
            target: entityData[0].target.data
        });
    }], function (err, info) {
        if (err) {
            return retValCallback(err);
        }
        console.info('Deleting of ' + meta.relationType + ' with uuid ' + relation.uuid + ' completed.');
        return retValCallback(null, info);

    });
};


module.exports = CrudRelationRepository;
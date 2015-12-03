/**
 * Represents a identifiable Relation
 *
 * @param relationUUID uuid of the relation
 * @param ref referenced (asked) object. It depends of the answered question what kind of object is referenced. It can be target or source object according to special relation
 * @param sourceType type of the source object
 * @param relationType type of the relation
 * @param targetType type of the target object
 * @param sourceUUID uuid of the source or 'null'
 * @param targetUUID uuid of the target or 'null'
 * @param ignoreDirection if true, the direction is not defined
 * @param referenceTargetType if true, then ref is filled with entity = target type, if false with source type
 * @returns {{relationUUID, ref, getMetaInfo: Function}}
 * @constructor
 */
function Relation(data, ref, sourceType, relationType, targetType, sourceUUID, targetUUID, ignoreDirection, referenceTargetType) {


    return {

        /**
         * Returns a unique identifier of the relation
         */
        get relationUUID() {
            return data.relationUUID;
        },

        /**
         * Returns the reference of the relation as a entity
         */
        get ref() {
            return !ref ? {} : ref;
        },

        /**
         * Returns the date as a relation first deleted
         */
        get deleted() {
            return !data.deleted ? null : data.deleted;
        },

        /**
         * Indicates if relation is marked as deleted
         * @returns {*|boolean}
         */
        get isDeleted() {
            return !data.isDeleted ? false : data.isDeleted;
        },

        /**
         * Returns the information about relation
         *
         * @returns {{sourceType: *, sourceUUID: *, relationType: *, targetType: *, targetUUID: *}}
         */
        getMetaInfo: function () {
            var meta = {
                sourceType: sourceType,
                sourceUUID: sourceUUID,
                relationType: relationType,
                targetType: targetType,
                targetUUID: targetUUID,
                ignoreDirection: ignoreDirection,
                referenceTargetType: referenceTargetType
            };

            return meta;
        }
    };
}

module.exports = Relation;
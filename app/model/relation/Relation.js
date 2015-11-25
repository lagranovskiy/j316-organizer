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
 * @returns {{relationUUID, ref, getMetaInfo: Function}}
 * @constructor
 */
function Relation(relationUUID, ref, sourceType, relationType, targetType, sourceUUID, targetUUID, ignoreDirection) {


    return {

        /**
         * Returns a unique identifier of the relation
         */
        get relationUUID() {
            return relationUUID;
        },

        /**
         * Returns the reference of the relation as a entity
         */
        get ref() {
            return ref;
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
                ignoreDirection: ignoreDirection
            };

            return meta;
        }
    };
}

module.exports = Relation;
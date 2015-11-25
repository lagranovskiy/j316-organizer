/**
 * Represents a identifiable Relation
 *
 * @param {Object} node Object as read from the database.
 * @returns {Tag}
 * @constructor
 */
function Relation(uuid, ref, sourceType, relationType, targetType, invertRelation) {


    return {

        /**
         * Returns a unique identifier of the relation
         */
        get uuid() {
            return uuid;
        },

        /**
         * Returns the reference of the relation as a entity
         */
        get ref() {
            return ref;
        },

        getMetaInfo: function () {
            var meta = {
                sourceType: sourceType,
                relationType: relationType,
                targetType: targetType
            };

            if (invertRelation && invertRelation === true) {
                meta.sourceType = targetType;
                meta.targetType = sourceType;
            }

            return meta;
        }
    };
}

module.exports = Relation;
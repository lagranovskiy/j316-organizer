/**
 * Represents a identifiable Relation
 *
 * @param {Object} node Object as read from the database.
 * @returns {Tag}
 * @constructor
 */
function Relation(uuid, ref) {


    return {
        /**
         * Returns a unique identifier of the entity
         */
        get uuid() {
            return uuid;
        },

        /**
         * Returns the reference of the relation
         */
        get ref() {
            return ref;
        }
    };
}

module.exports = Relation;
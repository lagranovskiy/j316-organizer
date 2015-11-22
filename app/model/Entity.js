/**
 * Represents a identifiable entity
 *
 * @param {Object} node Object as read from the database.
 * @returns {Tag}
 * @constructor
 */
function Entity(data) {

    return {
        /**
         * Returns a unique identifier of the entity
         */
        get uuid() {
            return data.uuid;
        },

        /**
         * Returns the date as a entity first created
         */
        get created() {
            return data.created;
        },

        /**
         * Returns the date as a entity first created
         */
        get lastSeen() {
            return data.lastSeen;
        },

        /**
         * Returns the date as a entity first created
         */
        get deleted() {
            return data.deleted;
        },

        /**
         * Indicates if entity is marked as deleted
         * @returns {*|boolean}
         */
        get isDeleted() {
            return data.isDeleted;
        }
    };
}

module.exports = Entity;
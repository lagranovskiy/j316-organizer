/**
 * Represents a identifiable entity
 *
 * @param {Object} node Object as read from the database.
 * @returns {Tag}
 * @constructor
 */
function Entity(uuid, createdDate) {

    if (!createdDate) {
        createdDate = new Date();
    }

    return {
        /**
         * Returns a unique identifier of the entity
         */
        get uuid() {
            return uuid;
        },

        /**
         * Returns the date as a entity first created
         */
        get createdDate() {
            return createdDate;
        }
    };
}

module.exports = Entity;
var relationMap = {

    objects: {
        Person: 'Person',
        Service: 'Service',
        Organization: 'Organization',
        PostalAddress: 'PostalAddress'
    },
    relations: {
        Organization: {
            HAS_ACTIVE_MEMBER: 'HAS_ACTIVE_MEMBER',
            HAS_INACTIVE_MEMBER: 'HAS_INACTIVE_MEMBER',
            HAS_LOCATION: 'HAS_LOCATION',
            PROVIDES_SERVICE: 'PROVIDES_SERVICE'
        },
        Person: {
            IS_MARRIED_WITH:'IS_MARRIED_WITH',
            HAS_CHILD:'HAS_CHILD',
            PARTICIPATE_IN:'PARTICIPATE_IN',
            IS_RESPONSIBLE_FOR:'IS_RESPONSIBLE_FOR',
            IS_RELATED_TO:'IS_RELATED_TO',
            HOUSEKEEPER_OF:'HOUSEKEEPER_OF'
        },
        Service: {
            IS_PARENT_SERVICE_OF:'IS_PARENT_SERVICE_OF'
        },
        PostalAddress: {}
    }
};

module.exports = relationMap;

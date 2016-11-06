var relationMap = {

    objects: {
        Person: 'Person',
        Service: 'Service',
        Organization: 'Organization',
        PostalAddress: 'PostalAddress',
        ServicePlan: 'ServicePlan'
    },
    relations: {
        Organization: {
            HAS_ACTIVE_MEMBER: 'HAS_ACTIVE_MEMBER',
            HAS_INACTIVE_MEMBER: 'HAS_INACTIVE_MEMBER',
            HAS_LOCATION: 'HAS_LOCATION',
            PROVIDES_SERVICE: 'PROVIDES_SERVICE'
        },
        Person: {
            IS_MARRIED_WITH: 'IS_MARRIED_WITH',
            HAS_CHILD: 'HAS_CHILD',
            PARTICIPATE_IN: 'PARTICIPATE_IN',
            IS_RESPONSIBLE_FOR: 'IS_RESPONSIBLE_FOR',
            IS_RELATED_TO: 'IS_RELATED_TO',
            HOUSEKEEPER_OF: 'HOUSEKEEPER_OF'
        },
        Service: {
            IS_PARENT_SERVICE_OF: 'IS_PARENT_SERVICE_OF'
        },
        PostalAddress: {}
    },
    bom: {
        Organization: {
            OrganizationActiveMember: 'OrganizationActiveMember',
            OrganizationHasLocation: 'OrganizationHasLocation',
            OrganizationInactiveMember: 'OrganizationInactiveMember',
            OrganizationProvidesService: 'OrganizationProvidesService'
        },
        Person: {
            PersonHasChild: 'PersonHasChild',
            PersonHasParent: 'PersonHasParent',
            PersonIsHousekeeperOfPostalAddress: 'PersonIsHousekeeperOfPostalAddress',
            PersonIsMarriedWith: 'PersonIsMarriedWith',
            PersonIsRelatedTo: 'PersonIsRelatedTo',
            PersonIsResponsibleForService: 'PersonIsResponsibleForService',
            PersonMemberOfOrganization: 'PersonMemberOfOrganization',
            PersonParticipateInService: 'PersonParticipateInService'
        },
        Service: {
            ServiceParticipatedPerson: 'ServiceParticipatedPerson'
        },
        PostalAddress: {}
    }
};

module.exports = relationMap;

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);
let reactions = [
    {
        reaction: {
            id: 'woman-swimming',
            name: 'Woman Swimming',
            colons: ':woman-swimming::skin-tone-4:',
            emoticons: [],
            unified: '1f3ca-1f3fd-200d-2640-fe0f',
            skin: 4,
            native: '🏊🏽‍♀️'
        },
        reacted: false,
        persons: [
            {
                name: 'Viktor Busko',
                id: 1
            },
            {
                name: 'John Dow',
                id: 2
            },
            {
                name: 'Oleg Pershai',
                id: 3
            }
        ]
    },
    {
        reaction: {
            id: 'santa',
            name: 'Father Christmas',
            colons: ':santa::skin-tone-3:',
            text: '',
            emoticons: [],
            skin: 3,
            native: '🎅🏼'
        },
        reacted: false,
        persons: [
            {
                name: 'Viktor Busko',
                id: 1
            },
            {
                name: 'Oleg Pershai',
                id: 3
            }
        ]
    }
];

mock.onGet('/award-service/v1/award/123456/reactions').reply(200, reactions);
mock.onPost('/award-service/v1/award/123456/reaction').reply(function(config) {
    const foundReaction = reactions.find(
        reaction => reaction.reaction.colons === JSON.parse(config.data).colons
    );

    if (!foundReaction) {
        reactions.push({
            reaction: JSON.parse(config.data),
            reacted: true,
            persons: [
                {
                    name: 'John Doe',
                    id: 8
                }
            ]
        });
    } else {
        if (foundReaction.reacted === false) {
            foundReaction.reacted = true;
            foundReaction.persons.push({
                name: 'John Doe',
                id: 8
            });
        }
    }

    return [200, reactions];
});
mock.onDelete('/award-service/v1/award/123456/reaction').reply(function(
    config
) {
    const foundReaction = reactions.find(
        reaction => reaction.reaction.colons === JSON.parse(config.data).colons
    );

    if (foundReaction.persons.length === 1) {
        reactions = reactions.filter(
            reaction =>
                reaction.reaction.colons !== foundReaction.reaction.colons
        );
    } else {
        foundReaction.reacted = false;
        foundReaction.persons = foundReaction.persons.filter(
            person => person.name !== 'John Doe'
        );
    }

    return [200, reactions];
});

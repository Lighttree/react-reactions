import reactionApi from './api/reactionApi';

function getReactions({ belongsTo, entityId, personId }) {
    return reactionApi
        .findAllByHostEntityId({
            belongsTo,
            entityId,
            personId
        })
        .then(reactions => Promise.resolve(makeExtendedReactions(reactions, personId)));
}

function updateReaction({
    belongsTo,
    entityId,
    personId,
    reaction,
    onBeforeUpdate = () => {}
}) {
    let updateRequest;
    onBeforeUpdate();

    if (isReacted(reaction, personId)) {
        updateRequest = reactionApi.deleteReaction({
            belongsTo,
            entityId,
            personId,
            reaction
        });
    } else {
        updateRequest = reactionApi.postReaction({
            belongsTo,
            entityId,
            personId,
            reaction
        });
    }

    return updateRequest.then(reactions =>
        Promise.resolve(makeExtendedReactions(reactions, personId))
    );
}

function makeExtendedReactions(reactions, personId) {
    return reactions.map(reaction => {
        return { ...reaction, reacted: isReacted(reaction, personId) };
    });
}

function isReacted(reaction, personId) {
    return (
        reaction.persons
            .map(person => person.id.toString())
            .indexOf(personId.toString()) !== -1
    );
}

/**
 * Converts plain Emoji object to Reaction by adding required fields.
 * @param {Object} emoji Emoji object from emoji-mart.
 */
function convertToReaction(emoji) {
    return {
        reaction: emoji,
        persons: []
    };
};

export default { getReactions, updateReaction, isReacted, convertToReaction };

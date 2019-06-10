import reactionApi from './api/reactionApi';

function getReactions({ belongsTo, entityId, personId }) {
    return reactionApi
        .findAllByHostEntityId({
            belongsTo,
            entityId,
            personId
        })
        .then(reactions =>
            Promise.resolve(makeExtendedReactions(reactions, personId))
        );
}

function updateReaction({ belongsTo, entityId, personId, reaction }) {
    let updateRequest;

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
}

/**
 * @note Experemental feature.
 * This is to improve UX of Reactions. It updates Reactions collection state,
 * `before` it actually recieve response from backend. This allows UI to respond
 * faster. It has a lot of unstable behavior.
 * @param {Number} personId current user identifier.
 * @param {Array} reactions Reactions collection.
 * @param {Object} reaction Currently selected reaction.
 */
function unstable_optimisticUpdate(personId, reactions, reaction) {
    const reactionIndex = reactions.indexOf(reaction);
    const existentReaction = reactionIndex !== -1;

    if (!existentReaction) {
        return [...reactions, reaction];
    }

    if (reaction.reacted) {
        if (reaction.persons.length === 1) {
            reactions.splice(reactionIndex, 1);
        } else {
            reaction.reacted = false;
            reaction.persons.filter(person => person.id !== personId);
        }
    } else {
        reaction.reacted = true;
    }

    return reactions;
}

export default {
    getReactions,
    updateReaction,
    isReacted,
    convertToReaction,
    unstable_optimisticUpdate
};

import axios from 'axios';

/**
 * Generic error handler.
 * @param {Error} error axios request error object.
 */
function handleError(error) {
    // eslint-disable-next-line no-console
    console.error('Reactions API error |', error);
    throw error;
}

const reactionApi = {
    /**
     * Returns list of all Reactions for Host Entity.
     * @param {Object} params request params.
     * @param {'award' | 'comment'} params.belongsTo type of entity reactions belongs to.
     * @param {Number} params.entityId host entity idetifier.
     * @param {Number} params.personId current logged in user id.
     */
    findAllByHostEntityId({ belongsTo, entityId, personId }) {
        return axios
            .get(`/award-service/v1/${belongsTo}/${entityId}/reactions`, {
                params: {
                    personId
                }
            })
            .then(response => {
                return Promise.resolve(response.data);
            })
            .catch(handleError);
    },

    /**
     * Posts new reaction for particular Host Entity.
     * @param {Object} params request params.
     * @param {'award' | 'comment'} params.belongsTo type of entity reactions belongs to.
     * @param {Number} params.entityId host entity identifier.
     * @param {Number} params.personId current logged in user id.
     * @param {Object} params.reaction reaction object.
     * @see https://github.com/missive/emoji-mart#examples-of-emoji-object
     */
    postReaction({ belongsTo, entityId, personId, reaction }) {
        return axios
            .post(
                `/award-service/v1/${belongsTo}/${entityId}/reaction`,
                reaction.reaction,
                {
                    params: {
                        personId
                    }
                }
            )
            .then(response => {
                return Promise.resolve(response.data);
            })
            .catch(handleError);
    },

    /**
     * Deletes reaction from particular Host Entity.
     * @param {Object} params request params.
     * @param {'award' | 'comment'} params.belongsTo type of entity reactions belongs to.
     * @param {Number} params.entityId comment identifier.
     * @param {Number} params.personId current logged in user id.
     * @param {Object} params.reaction emoji object.
     * @see https://github.com/missive/emoji-mart#examples-of-emoji-object
     */
    deleteReaction({ belongsTo, entityId, personId, reaction }) {
        return axios
            .delete(`/award-service/v1/${belongsTo}/${entityId}/reaction`, {
                data: reaction.reaction,
                params: {
                    personId
                }
            })
            .then(response => {
                return Promise.resolve(response.data);
            })
            .catch(handleError);
    }
};

export default reactionApi;

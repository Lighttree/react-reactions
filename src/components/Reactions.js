import React, { useState, useEffect } from 'react';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import { Popover, PopoverDisclosure, usePopoverState } from 'reakit/Popover';

import reactionApi from '../services/api/reactionApi';
import '../services/api/reactionMock';
import './Reactions.css';
import ReactionBar from './ReactionBar';

export default function Reactions({ belongsTo, entityId, personId }) {
    const [reactions, setReactions] = useState([]);
    const popover = usePopoverState();
    useEffect(() => {
        reactionApi
            .findAllByHostEntityId({
                belongsTo,
                entityId,
                personId
            })
            .then(data => {
                setReactions(data);
            });
    }, [belongsTo, entityId, personId]);

    /**
     * Updates Reactions in list.
     * @param {Object} reaction currently selected Reaction.
     */
    const handleReactionsSelect = reaction => {
        let reactionsUpdate;

        if (reaction.reacted) {
            reactionsUpdate = reactionApi.deleteReaction({
                belongsTo,
                entityId,
                personId,
                reaction
            });
        } else {
            reactionsUpdate = reactionApi.postReaction({
                belongsTo,
                entityId,
                personId,
                reaction
            });
        }

        reactionsUpdate.then(data => {
            setReactions(data);
        });
    };

    /**
     * Converts plain Emoji object to Reaction by adding required fields.
     * @param {Object} emoji Emoji object from emoji-mart.
     */
    const convertToReaction = emoji => {
        return {
            reaction: emoji,
            reacted: undefined,
            persons: []
        };
    };

    return (
        <div>
            <ReactionBar
                reactions={reactions}
                onReactionClick={handleReactionsSelect}
                onAddClick={popover.toggle}
            >
                <PopoverDisclosure
                    {...popover}
                    className="reaction-group reaction-bar__item reaction-bar__add"
                >
                    Add reaction
                </PopoverDisclosure>
            </ReactionBar>
            <Popover
                {...popover}
                aria-label="Reaction picker"
                className="reaction-picker"
            >
                <Picker
                    onSelect={emoji => {
                        handleReactionsSelect(convertToReaction(emoji));
                    }}
                />
            </Popover>
        </div>
    );
}

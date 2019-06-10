import React, { useState, useEffect } from 'react';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import { Popover, PopoverDisclosure, usePopoverState } from 'reakit/Popover';
import 'focus-visible';

import reactionService from '../services/reactionService';
import './Reactions.css';
import ReactionBar from './ReactionBar';
import customEmojis from './customEmojis';

export default function Reactions({ belongsTo, entityId, personId }) {
    const [reactions, setReactions] = useState([]);
    const popover = usePopoverState();
    useEffect(() => {
        reactionService
            .getReactions({
                belongsTo,
                entityId,
                personId
            })
            .then(data => {
                setReactions(data);
            });
    }, [belongsTo, entityId, personId]);

    const updateReaction = (reaction, onBeforeUpdate = () => {}) => {
        reactionService
            .updateReaction({
                belongsTo,
                entityId,
                personId,
                reaction,
                onBeforeUpdate
            })
            .then(data => {
                setReactions(data);
            });
    };

    return (
        <div>
            <ReactionBar
                reactions={reactions}
                personId={personId}
                onReactionClick={updateReaction}
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
                    custom={customEmojis}
                    onSelect={emoji => {
                        updateReaction(
                            reactionService.convertToReaction(emoji),
                            popover.hide
                        );
                    }}
                />
            </Popover>
        </div>
    );
}

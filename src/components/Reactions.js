import React, { useState, useEffect } from 'react';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import Popover from '@material-ui/core/Popover';
import 'focus-visible';

import reactionService from '../services/reactionService';
import './Reactions.css';
import ReactionBar from './ReactionBar';
import customEmojis from './customEmojis';

export default function Reactions({ belongsTo, entityId, personId }) {
    const [reactions, setReactions] = useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
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
        onBeforeUpdate();
        setReactions(
            reactionService.unstable_optimisticUpdate(
                personId,
                reactions,
                reaction
            )
        );

        reactionService
            .updateReaction({
                belongsTo,
                entityId,
                personId,
                reaction
            })
            .then(data => {
                setReactions(data);
            });
    };

    function handleClose() {
        setAnchorEl(null);
    }

    const open = Boolean(anchorEl);

    return (
        <ReactionBar
            reactions={reactions}
            personId={personId}
            onReactionClick={updateReaction}
        >
            <button
                onClick={e => setAnchorEl(e.currentTarget)}
                className="reaction-group reaction-bar__item reaction-bar__add"
            >
                Add reaction
            </button>
            <Popover
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
            >
                <Picker
                    custom={customEmojis}
                    onSelect={emoji => {
                        updateReaction(
                            reactionService.convertToReaction(emoji),
                            setAnchorEl(null)
                        );
                    }}
                />
            </Popover>
        </ReactionBar>
    );
}

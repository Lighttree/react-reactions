import React from 'react';
import { Emoji } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

import './ReactionGroup.css';

export default function ReactionGroup({ reaction, onReactionClick }) {
    const handleClick = () => {
        onReactionClick && onReactionClick(reaction);
    };

    return (
        <button type="button" className={`reaction-group ${reaction.reacted ? 'reaction-group--reacted' : ''}`} onClick={handleClick}>
            <Emoji emoji={reaction.reaction} size={16} />
            <span className="reaction-group__count">
                {reaction.persons.length}
            </span>
        </button>
    );
}

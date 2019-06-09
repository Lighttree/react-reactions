import React, { useState } from 'react';
import { Tooltip, TooltipReference, useTooltipState } from 'reakit/Tooltip';

import ReactionGroup from './ReactionGroup';
import './ReactionBar.css';

/**
 * Format persons collection to show information in reaction tooltip.
 * Who reacted with particular reaction.
 * @param {Array} persons array.
 */
function formatTooltipInfo(persons) {
    if (persons.length === 2) {
        return persons.map(person => person.name).join(' and ');
    }

    return persons.map(person => person.name).join(', ');
}

export default function ReactionBar({ reactions, onReactionClick, children }) {
    const tooltip = useTooltipState();
    const [hoveredReaction, setHoveredReaction] = useState(null);

    const handleReactionClick = reaction => {
        onReactionClick && onReactionClick(reaction);
    };

    return (
        <React.Fragment>
            <div className="reaction-bar">
                <Tooltip {...tooltip} className="reaction-tooltip">
                    {hoveredReaction &&
                        formatTooltipInfo(hoveredReaction.persons)}
                </Tooltip>
                {reactions.map(reaction => {
                    return (
                        <TooltipReference
                            {...tooltip}
                            key={reaction.reaction.colons}
                            className="reaction-bar__item"
                            onMouseEnter={() => setHoveredReaction(reaction)}
                            onMouseLeave={() => setHoveredReaction(null)}
                        >
                            <ReactionGroup
                                key={reaction.reaction.colons}
                                reaction={reaction}
                                onReactionClick={handleReactionClick}
                            />
                        </TooltipReference>
                    );
                })}
                {children}
            </div>
        </React.Fragment>
    );
}

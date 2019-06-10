import React, { useState } from 'react';
import { Tooltip, TooltipReference, useTooltipState } from 'reakit/Tooltip';

import ReactionGroup from './ReactionGroup';
import './ReactionBar.css';

export default function ReactionBar({
    reactions,
    onReactionClick,
    personId,
    children
}) {
    const tooltip = useTooltipState();
    const [hoveredReaction, setHoveredReaction] = useState(null);

    const handleReactionClick = reaction => {
        onReactionClick && onReactionClick(reaction);
    };

    /**
     * Format persons collection to show information in reaction tooltip.
     * Who reacted with particular reaction.
     * @param {Array} persons array.
     */
    function formatTooltipInfo(persons, personId) {
        const names = persons.map(person =>
            person.id.toString() === personId ? 'You' : person.name
        );
        return names.join(', ').replace(/, ([^,]*)$/, ' and $1');
    }

    return (
        <React.Fragment>
            <div className="reaction-bar">
                <Tooltip {...tooltip} className="reaction-tooltip">
                    {hoveredReaction &&
                        formatTooltipInfo(hoveredReaction.persons, personId)}
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

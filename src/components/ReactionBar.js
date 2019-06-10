import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import ReactionGroup from './ReactionGroup';
import './ReactionBar.css';

export default function ReactionBar({
    reactions,
    onReactionClick,
    personId,
    children
}) {
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
        <div className="reaction-bar">
            {reactions.map(reaction => {
                return (
                    <Tooltip
                        placement="top"
                        title={formatTooltipInfo(reaction.persons, personId)}
                        key={reaction.reaction.colons}
                    >
                        <ReactionGroup
                            reaction={reaction}
                            className="reaction-bar__item"
                            onReactionClick={handleReactionClick}
                        />
                    </Tooltip>
                );
            })}
            {children}
        </div>
    );
}

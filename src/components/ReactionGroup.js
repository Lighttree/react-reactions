import React from 'react';
import { Emoji } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

import './ReactionGroup.css';

class ReactionGroup extends React.Component {
    handleClick = e => {
        this.props.onReactionClick &&
            this.props.onReactionClick(this.props.reaction, e);
    };

    render() {
        // eslint-disable-next-line no-unused-vars
        const { reaction, onReactionClick, className, ...rest } = this.props;

        let classNames = [
            'reaction-group',
            reaction.reacted ? 'reaction-group--reacted' : '',
            className
        ].join(' ');

        return (
            <button
                {...rest}
                type="button"
                className={classNames}
                onClick={this.handleClick}
            >
                <Emoji emoji={reaction.reaction} size={16} />
                <span className="reaction-group__count">
                    {reaction.persons.length}
                </span>
            </button>
        );
    }
}

export default ReactionGroup;

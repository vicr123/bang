import React from 'react';

class Tooltip extends React.Component {
    render() {
        return <div class="tooltipContainer">
            <div class="tooltip">
                <div class="tooltipText">{this.props.text}</div>
            </div>
            {this.props.children}
        </div>
    }
}

export default Tooltip;
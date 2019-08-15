import React from 'react';

class Component extends React.Component {
    className() {
        let classes = [];
        classes.push("placeholderComponent");
        classes.push(this.props.extraClassNames);
        return classes.join(" ");
    }
    
    render() {
        return <div style={this.props.style} className={this.className()}>This is an unimplemented component. If you see this, report a bug immediately. !!! IMPLEMENT ME !!!</div>
    }
}

export default Component;
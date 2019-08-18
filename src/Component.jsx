import React from 'react';
// Placeholder component that appears when a component is yet to be implemented
class Component extends React.Component {
    /* 
    * Initializes the styling for the component 
    * @return {String} of class names  
    */
    className() {
        let classes = [];
        classes.push("placeholderComponent");
        // pushes extraClassNames from the parent Component
        classes.push(this.props.extraClassNames);
        return classes.join(" ");
    }
    
    render() {
        return <div style={this.props.style} className={this.className()}>This is an unimplemented component. If you see this, report a bug immediately. !!! IMPLEMENT ME !!!</div>
    }
}

export default Component;
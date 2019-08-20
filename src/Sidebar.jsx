import React from 'react';
import Component from './Component';
import placeholderLogo from './assets/placeholderLogo.png';


// Component that renders the logo 
class SidebarHeader extends Component {

    render(){
        return (<img className="placeholderLogo" src={placeholderLogo} alt="logo"></img>);
    }
}

// Sidebar elements 
class SidebarItem extends Component {
    /** 
    * Maintains CSS classes for the Component
    * @return {String} string containing CSS classes separated by spaces
    */
    className() {
        let classes = [];
        classes.push("listItem");
        
        if (this.props.selected) {
            classes.push("selected");
        }
        
        return classes.join(" ");
    }
    
    render() {
        return <div className={this.className()} onClick={this.props.onClick}>
            {this.props.text}
        </div>
    }
}

// Renders sidebar elements 
class Sidebar extends Component {

    render() {
        let isSelected = (stateName) => {
            if (this.props.currentState === stateName) {
                console.log("Got state")
                return true;
            } else {
                return false;
            }
        };
        
        return <div className="sidebar scrollable">
            <SidebarHeader />
            <SidebarItem text="Trending" stateName="trending" selected={isSelected("trending")} onClick={() => this.props.onChangeView("trending")} />
            <SidebarItem text="Leaderboard" stateName="leaderboard" selected={isSelected("leaderboard")} onClick={() => this.props.onChangeView("leaderboard")} />
            <div style={{"flex-grow": "1"}} />
            <SidebarItem text="About" stateName="about" selected={isSelected("about")} onClick={() => this.props.onChangeView("about")} />
            <SidebarItem text="User" stateName="user" selected={isSelected("user")} onClick={() => this.props.onChangeView("user")} />
        </div>
    }
}

export default Sidebar;
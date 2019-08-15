import React from 'react';
import Component from './Component';

class SidebarHeader extends Component {
    
}

class SidebarItem extends Component {
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
        
        return <div className="sidebar">
            <SidebarHeader />
            <SidebarItem text="Trending" stateName="trending" selected={isSelected("trending")} onClick={() => this.props.onChangeView("trending")} />
            <SidebarItem text="Leaderboard" stateName="leaderboard" selected={isSelected("leaderboard")} onClick={() => this.props.onChangeView("leaderboard")} />
        </div>
    }
}

export default Sidebar;
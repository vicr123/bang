import React from 'react';
import Component from './Component';

class SidebarHeader extends Component {
    
}

class SidebarItem extends Component {
    render() {
        return <div className="listItem">
            {this.props.text}
        </div>
    }
}

class Sidebar extends Component {
    render() {
        return <div className="sidebar">
            <SidebarHeader />
            <SidebarItem text="Trending" />
            <SidebarItem text="Leaderboard" />
        </div>
    }
}

export default Sidebar;
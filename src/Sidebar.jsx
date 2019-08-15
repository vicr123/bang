import React from 'react';

class SidebarItem extends React.Component {
    render() {
        return <div className="listItem">
            {this.props.text}
        </div>
    }
}

class Sidebar extends React.Component {
    render() {
        return <div className="sidebar">
            <div className="padded" style={{"font-size": "20pt"}}>
                !bang
            </div>
            <SidebarItem text="Trending" />
            <SidebarItem text="Leaderboard" />
        </div>
    }
}

export default Sidebar;
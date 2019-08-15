import React from 'react';
import './App.css';

import Sidebar from './Sidebar';

class App extends React.Component {
    render() {
        return <div className="appContainer">
            <Sidebar />
        </div>
    }
}

export default App;

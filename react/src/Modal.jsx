/*******************************************
 * 
 *   This file is adapted from theWeb by Victor Tran:
 *   https://github.com/vicr123/theweb/blob/master/internal-pages/theweb/src/modal.jsx
 *   The copyright message is below:
 *
 *   theWeb - Web Browser
 *   Copyright (C) 2019 Victor Tran
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Account from './account/Account';
import Fetch from './fetch';
import LoginHandler from './LoginHandler';

let modalShown = false;
let ModalUnmountHandler = () => {
    Modal.unmount();
}

/*
//This class handles modals that appear when clicking buttons unde
*/

class Modal extends React.Component {
    constructor(props) {
        super(props);
    }
    
    /*
        componentDidMount() called when the modal appears
        componentWillUnmount() called when the modal disappears
    */

    componentDidMount() {
        LoginHandler.on("loginDetailsChanged", ModalUnmountHandler);
    }
    
    componentWillUnmount() {
        LoginHandler.removeListener("loginDetailsChanged", ModalUnmountHandler);
    }
    

    // Reders title of the Modal    
    renderTitle() {
        if (this.props.title) {
            return <h1>{this.props.title}</h1>
        } else {
            return null;
        }
    }
    // Renders Close button of Modal
    renderCloseButton() {
        if (this.props.cancelable) {
            return <button className="closeButton">×</button>
        } else {
            return null;
        }
    }
    
    render() {
        let backgroundClickHandler = () => {
            if (this.props.cancelable) Modal.unmount();
        }
        
        let dummyHandler = (e) => {
            e.stopPropagation();
        };
        
        return <div className="modalBackground" onClick={backgroundClickHandler}>
            {this.renderCloseButton()}
            <div className="modalBox" style={{"width": this.props.width}} onClick={dummyHandler} >
                <div className="modalBoxContainer" style={{"width": this.props.width}}>
                    {this.renderTitle()}
                    <div>
                        {this.props.children}
                    </div>
                </div>
            </div>
        </div>
    }
    
    // Used to call modal.
    static mount(jsx) {
        if (modalShown) Modal.unmount();
        ReactDOM.render(jsx, document.getElementById('modalContainer'));
        modalShown = true;
    }
    
    // Used to uncall modal.
    static unmount() {
        ReactDOM.render(null, document.getElementById('modalContainer'));
        modalShown = false;
    }

    //Checks if the user is logged in. If not, display log in screen as a modal
    static checkLoggedIn() {
        let token = localStorage.getItem("loginToken");
		if (token == null) {
            //Ask the user to log in
            
            Modal.mount(<Modal cancelable={true} width={500}>
                <Account isInModal={true} />
            </Modal>)
            return false;
        } else {
            //We're logged in
            return true;
        }
    }
}

export default Modal;
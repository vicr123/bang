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

let modalShown = false;

class Modal extends React.Component {
    constructor(props) {
        super(props);
    }
    
    iconFromTheme(iconName) {
        return "theweb://sysicons/?width=16&height=16&icons=" + encodeURIComponent("sys:" + iconName)
    }
    
    renderLeftElements() {
        if (this.props.cancelable) {
            return <div className="headerButton" onClick={Modal.unmount}>
                <img key="image" src={this.iconFromTheme("go-previous")} />
            </div>
        }
    }
    
    renderRightElements() {
        let elements = [];
        
        for (let button of this.props.buttons) {
            let icon;
            let clickHandler;
            if (button === "ok") {
                icon = "dialog-ok";
                clickHandler = this.props.onOk;
            } else if (button === "no") {
                icon = "dialog-cancel";
                clickHandler = this.props.onNo;
            } else {
                continue;
            }
            
            elements.push(<div key={button} className="headerButton" onClick={clickHandler}>
                <img key="image" src={this.iconFromTheme(icon)} />
            </div>)
        }
        
        return elements;
    }
    
    render() {
        let backgroundClickHandler = () => {
            if (this.props.cancelable) Modal.unmount();
        }
        
        let dummyHandler = (e) => {
            e.stopPropagation();
        };
        
        return <div className="modalBackground" onClick={backgroundClickHandler}>
                <div className="modalBox" style={{"width": this.props.width}} onClick={dummyHandler} >
                    <h1>{this.props.title}</h1>
                    <div>
                        {this.props.children}
                    </div>
                </div>
            </div>
    }
    
    // <Header title={this.props.title} leftElements={this.renderLeftElements()} rightElements={this.renderRightElements()}/>


    static mount(jsx) {
        ReactDOM.render(jsx, document.getElementById('modalContainer'));
        modalShown = true;
    }
    
    static unmount() {
        ReactDOM.render(null, document.getElementById('modalContainer'));
        modalShown = false;
    }
}

export default Modal;
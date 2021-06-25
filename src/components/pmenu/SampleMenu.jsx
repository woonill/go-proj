import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
    ContextMenu,
    MenuItem,
    ContextMenuTrigger,
  } from "react-contextmenu";



export default class SimpleMenu extends Component {
    constructor(props) {
        super(props);

        this.state = { logs: []};
    }

    handleClick = (e, data) => {
        console.log(e)
        this.setState(({ logs }) => ({
            logs: [`Clicked on menu ${data.item}`, ...logs]
        }));
    }

    render() {

        let menuId = uuidv4();

        return (
            <div>
                <div className='well'>right click to see the menu</div>
                <ContextMenuTrigger id={menuId} holdToDisplay={1000}>
                {this.props.children}

                </ContextMenuTrigger>
                <ContextMenu id={menuId}>
                    <MenuItem  onClick={this.handleClick} data={{ item: 'item 1' }}>Menu Item 1</MenuItem>
                    <MenuItem  bonClick={this.handleClick} data={{ item: 'item 2' }}>Menu Item 2</MenuItem>
                    <MenuItem  divider />
                    <MenuItem onClick={this.handleClick} data={{ item: 'item 3' }}>Menu Item 3</MenuItem>
                </ContextMenu>
            </div>
        );
    }
}

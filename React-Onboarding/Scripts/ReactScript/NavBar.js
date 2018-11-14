import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Menu } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

export class NavMenu extends Component {
    state = { activeItem: '' }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        const { activeItem } = this.state;

        return ( 
            <Menu inverted>
                <Menu.Item
                    name='Customer'
                    content='Customer'
                    active={activeItem === 'Customer'}
                    onClick={this.handleItemClick}
                    href='/Customer/Index' />
                <Menu.Item
                    name='Product'
                    content='Product'
                    active={activeItem === 'Product'}
                    onClick={this.handleItemClick}
                    href='/Product/Index' />
                <Menu.Item
                    name='Store'
                    content='Store'
                    active={activeItem === 'Store'}
                    onClick={this.handleItemClick}
                    href='/Store/Index' />
                <Menu.Item
                    name='Sales'
                    content='Sales'
                    active={activeItem === 'Sales'}
                    onClick={this.handleItemClick}
                    href='/Sales/Index' />
            </Menu>
        )
    }
}

ReactDOM.render(
    <NavMenu />,
    document.getElementById('navroot')
);
//export default NavMenu;
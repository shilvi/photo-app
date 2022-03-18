import React from 'react';

class NavBar extends React.Component {

    componentDidMount() {
        // fetch navbar and then set the state...
    }

    render () {
        return (
            <nav className="main-nav">
                <h1>{this.props.title}</h1>
                <ul>
                    <li><a href="/api">API Docs</a></li>
                    <li><span>{this.props.username}</span></li>
                    <li><a href="/logout">Sign out</a></li>
                </ul>
            </nav>
        );
    }
}

export default NavBar;

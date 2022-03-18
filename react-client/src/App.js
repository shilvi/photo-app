import React from 'react';
import NavBar from './components/NavBar';
import Profile from './components/Profile';
import Stories from './components/Stories';
import Suggestions from './components/Suggestions';
import Posts from './components/Posts';
import { getHeaders } from './utils';

class App extends React.Component {

    state = {
        profile: null
    }

    componentDidMount() {
        // fetch posts and then set the state...
        fetch('/api/profile', {
                // authentication headers added using 
                // getHeaders() function from src/utils.js
                headers: getHeaders(),
            })
            .then(response => response.ok ? response : Promise.reject(response))
            .then(response => response.json())
            .then(data => {
                this.setState({ profile: data })
            })
    }

    render () {
        return (
            <div>

            <NavBar title='Photo App' username={this.state.profile?.username} />

            <aside>
                <Profile profile={this.state.profile} />
                <Suggestions />
            </aside>

            <main className='content'>
                <Stories />
                <Posts />
            </main>

            </div>
        );
    }
}

export default App;
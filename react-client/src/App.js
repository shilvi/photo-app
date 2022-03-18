import React from 'react';
import NavBar from './components/NavBar';
import Profile from './components/Profile';
import Stories from './components/Stories';
import Suggestions from './components/Suggestions';
import Posts from './components/Posts';

class App extends React.Component {

    render () {
        return (
            <div>

            <NavBar title='Photo App' username='webdev' />

            <aside>
                <Profile />
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
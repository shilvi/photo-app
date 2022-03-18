import React from 'react';

class Profile extends React.Component {

    state = {
        profile: null
    }

    componentDidMount() {
        // fetch profile and then set the state...
    }

    render () {
        if (!this.state.profile) {
            return (
                <div>Before profile fetched from server</div>
            );
        }
        return (
            <header>
                Profile
                {/* Navigation Links */}
            </header>
        );
    }
}

export default Profile;

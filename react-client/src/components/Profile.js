import React from 'react';

class Profile extends React.Component {

    render () {
        if (!this.props.profile) {
            return (
                <div>Before profile fetched from server</div>
            );
        }
        return (
            <header>
                <div>
                    <img className="pic" src={this.props.profile.thumb_url}
                        alt={`Profile Pic for ${this.props.profile.username}`} />
                    <h2>{this.props.profile.username}</h2>
                </div>
            </header>
        );
    }
}

export default Profile;

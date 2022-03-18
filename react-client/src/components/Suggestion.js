import React from 'react';
import { getHeaders } from '../utils';

class Suggestion extends React.Component {

    state = {
        follow_id: null
    }

    toggleFollow = this.toggleFollow.bind(this)
    toggleFollow(e) {
        if (this.state.follow_id) {
            this.unfollow();
        } else {
            this.follow();
        }
    }

    follow = this.follow.bind(this)
    follow() {
        // issue fetch request and then afterwards update state for the suggestion:
        fetch(`/api/following/`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({'user_id': this.props.suggestion.id})
            })
            .then(response => response.ok ? response : Promise.reject(response))
            .then(response => response.json())
            .then(data => {
                this.setState({follow_id: data.id})
            })
    }

    unfollow = this.unfollow.bind(this)
    unfollow() {
        // issue fetch request and then afterwards update state for the suggestion:
        fetch(`/api/following/${this.state.follow_id}`, {
                method: 'DELETE',
                headers: getHeaders()
            })
            .then(response => response.ok ? this.setState({follow_id: null}) : Promise.reject(response))
    }

    render () {
        const suggestion = this.props.suggestion
        return (
            <section>
                <img className="pic" src={suggestion.thumb_url} alt={`Profile Pic for ${suggestion.username}`} />
                <div>
                    <p>{suggestion.username}</p>
                    <p>suggested for you</p>
                </div>
                <div>
                    <button className={`link following ${this.state.follow_id ? 'active' : ''}`}
                            role="switch" aria-label="Follow"
                            aria-checked={this.state.follow_id ? 'true' : 'false'}
                            onClick={this.toggleFollow}>
                        {this.state.follow_id ? 'unfollow' : 'follow'}
                    </button>
                </div>
            </section>
        );
    }
}

export default Suggestion;

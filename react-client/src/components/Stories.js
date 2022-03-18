import React from 'react';
import { getHeaders } from '../utils';

class Stories extends React.Component {

    state = {
        stories: null
    }

    componentDidMount() {
        // fetch stories and then set the state...
        fetch('/api/stories', {
                // authentication headers added using 
                // getHeaders() function from src/utils.js
                headers: getHeaders(),
            })
            .then(response => response.ok ? response : Promise.reject(response))
            .then(response => response.json())
            .then(data => {
                this.setState({ stories: data })
            })
    }

    render () {
        if (!this.state.stories) {
            return (
                <div>Before stories fetched from server</div>
            );
        }
        return (
            <header className="stories">
                {
                this.state.stories.map(story => (
                    <div key={'story-' + story.id}>
                        <img src={story.user.thumb_url} className="pic" alt={`profile pic for ${story.user.username}`} />
                        <p>{story.user.username}</p>
                    </div>
                ))
                }
            </header>
        );
    }
}

export default Stories;

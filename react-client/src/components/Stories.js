import React from 'react';

class Stories extends React.Component {

    state = {
        stories: null
    }

    componentDidMount() {
        // fetch stories and then set the state...
    }

    render () {
        if (!this.state.stories) {
            return (
                <div>Before stories fetched from server</div>
            );
        }
        return (
            <header className="stories">
                Stories
                {/* Stories */}
            </header>
        );
    }
}

export default Stories;

import React from 'react';

class Suggestions extends React.Component {

    state = {
        suggestions: null
    }

    componentDidMount() {
        // fetch suggestions and then set the state...
    }

    render () {
        if (!this.state.suggestions) {
            return (
                <div>Before suggestions fetched from server</div>
            );
        }
        return (
            <div className="suggestions">
                <p className="suggestion-text">Suggestions for you</p>
                <div>
                    Suggestions
                    {/* Suggestions */}
                </div>
            </div>
        );
    }
}

export default Suggestions;

import React from 'react';
import Suggestion from './Suggestion';
import { getHeaders } from '../utils';

class Suggestions extends React.Component {

    state = {
        suggestions: null
    }

    componentDidMount() {
        // fetch suggestions and then set the state...
        fetch('/api/suggestions', {
                headers: getHeaders(),
            })
            .then(response => response.ok ? response : Promise.reject(response))
            .then(response => response.json())
            .then(data => {
                this.setState({
                    suggestions: data
                })
            })
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
                    {
                    this.state.suggestions.map(suggestion => {
                        return <Suggestion suggestion={suggestion} key={'suggestion-' + suggestion.id} />
                    })
                    }
                </div>
            </div>
        );
    }
}

export default Suggestions;

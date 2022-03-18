import React from 'react';
import Post from './Post';
import { getHeaders } from '../utils';

class Posts extends React.Component {

    state = {
        posts: null
    }

    componentDidMount() {
        // fetch posts and then set the state...
        fetch('/api/posts', {
                // authentication headers added using 
                // getHeaders() function from src/utils.js
                headers: getHeaders(),
            })
            .then(response => response.ok ? response : Promise.reject(response))
            .then(response => response.json())
            .then(data => {
                this.setState({ posts: data })
            })
    }

    render () {
        if (!this.state.posts) {
            return (
                <div>Before posts fetched from server</div>
            );
        }
        return (
            <div id="posts">
                {
                this.state.posts.map(post => {
                    return <Post post={post} key={'post-' + post.id} />
                })
                }
            </div>
        );
    }
}

export default Posts;

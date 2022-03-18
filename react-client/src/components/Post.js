import React from 'react';
import LikeButton from './LikeButton';
import BookmarkButton from './BookmarkButton';
import { getAccessTokenCookie } from '../utils';

class Post extends React.Component {

    state = {
        post: null
    }

    componentDidMount() {
        this.setState({ post: this.props.post })
    }

    requeryPost = this.requeryPost.bind(this)
    requeryPost() {
        fetch(`/api/posts/${this.state.post.id}`, {
                headers: { 'Authorization': 'Bearer ' + getAccessTokenCookie() }
            })
            .then(response => response.ok ? response : Promise.reject(response))
            .then(response => response.json())
            .then(data => {
                this.setState({
                    post: data
                })
            })
    }

    render () {
        const post = this.state.post
        if (!post) return <section></section>
        return (
            <section className="card">
                <div className="header">
                    <h3>{ post.user.username }</h3>
                    <i className="fa fa-dots"></i>
                </div>

                <img 
                    src={ post.image_url } 
                    alt={'Image posted by ' +  post.user.username } 
                    width="300" 
                    height="300" />

                <div className="info">
                    <div className="buttons">
                        <div>
                            <LikeButton
                                postId={post.id}
                                likeId={post.current_user_like_id}
                                requeryPost={this.requeryPost} />
                        </div>
                        <BookmarkButton
                            postId={post.id}
                            bookmarkId={post.current_user_bookmark_id}
                            requeryPost={this.requeryPost} />
                    </div>
                    <div className="likes">
                        <p><b>{post.likes.length} likes</b></p>
                    </div>
                    <p>{ post.caption }</p>
                </div>
            </section>
        );
    }
}

export default Post;

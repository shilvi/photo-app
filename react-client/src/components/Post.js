import React from 'react';
import LikeButton from './LikeButton';
import BookmarkButton from './BookmarkButton';
import Comments from './Comments';
import AddComment from './AddComment';
import { getHeaders } from '../utils';

class Post extends React.Component {

    state = {
        post: null
    }

    componentDidMount() {
        this.setState({ post: this.props.post })
    }

    requeryPost = this.requeryPost.bind(this)
    requeryPost() {
        const headers = getHeaders()
        delete headers['Content-Type']
        fetch(`/api/posts/${this.state.post.id}`, {
                headers: headers
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
                            <button className="link" style={{color: 'darkgreen'}} aria-label="Comment">
                                <i className="far fa-comment"></i>
                            </button>
                            <button className="link" style={{color: 'black'}} aria-label="Send"
                                onClick={() => { alert('This feature is not implemented yet') }}>
                                <i className="far fa-paper-plane"></i>
                            </button>
                        </div>
                        <BookmarkButton
                            postId={post.id}
                            bookmarkId={post.current_user_bookmark_id}
                            requeryPost={this.requeryPost} />
                    </div>
                    <div className="likes">
                        <p><b>{post.likes.length} likes</b></p>
                    </div>
                    <div className="caption">
                        <p><strong>{post.user.username}</strong> {post.caption}</p>
                    </div>
                    <Comments comments={post.comments} />
                    <div className="timestamp">
                        <p>{post.display_time}</p>
                    </div>
                </div>
                <AddComment
                    postId={post.id}
                    requeryPost={this.requeryPost} />
            </section>
        );
    }
}

export default Post;

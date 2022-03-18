import React from 'react';
import { getHeaders } from '../utils';

class LikeButton extends React.Component {  

    toggleLike = this.toggleLike.bind(this)
    toggleLike(e) {
        if (this.props.likeId) {
            this.unlike();
        } else {
            this.like();
        }
    }

    like = this.like.bind(this)
    like() {
        // issue fetch request and then afterwards requery for the post:
        fetch(`/api/posts/${this.props.postId}/likes/`, {
                method: 'POST',
                headers: getHeaders()
            })
            .then(response => response.ok ? this.props.requeryPost() : Promise.reject(response))
    }

    unlike = this.unlike.bind(this)
    unlike() {
        // issue fetch request and then afterwards requery for the post:
        fetch(`/api/posts/${this.props.postId}/likes/${this.props.likeId}`, {
                method: 'DELETE',
                headers: getHeaders()
            })
            .then(response => response.ok ? this.props.requeryPost() : Promise.reject(response))
    }

    render () {
        const likeId = this.props.likeId
        return (
            <button role="switch"
                className="like" 
                aria-label="Like Button" 
                aria-checked={likeId ? true : false}
                onClick={this.toggleLike}>
                <i className={likeId ? 'fas fa-heart' : 'far fa-heart'}></i>
            </button>
        )
    }
}

export default LikeButton;

import React from 'react';
import { getHeaders } from '../utils';

class BookmarkButton extends React.Component {  

    toggleBookmark = this.toggleBookmark.bind(this)
    toggleBookmark(e) {
        if (this.props.bookmarkId) {
            this.unbookmark();
        } else {
            this.bookmark();
        }
    }

    bookmark = this.bookmark.bind(this)
    bookmark() {
        // issue fetch request and then afterwards requery for the post:
        fetch(`/api/bookmarks/`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({'post_id': this.props.postId})
            })
            .then(response => response.ok ? this.props.requeryPost() : Promise.reject(response))
    }

    unbookmark = this.unbookmark.bind(this)
    unbookmark() {
        // issue fetch request and then afterwards requery for the post:
        fetch(`/api/bookmarks/${this.props.bookmarkId}`, {
                method: 'DELETE',
                headers: getHeaders()
            })
            .then(response => response.ok ? this.props.requeryPost() : Promise.reject(response))
    }

    render () {
        const bookmarkId = this.props.bookmarkId
        return (
            <button role="switch"
                className="bookmark" 
                aria-label="Bookmark Button" 
                aria-checked={bookmarkId ? true : false}
                onClick={this.toggleBookmark}>
                <i className={bookmarkId ? 'fas fa-bookmark' : 'far fa-bookmark'}></i>
            </button>
        )
    }
}

export default BookmarkButton;

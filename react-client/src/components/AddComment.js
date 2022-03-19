import React from 'react';
import { getHeaders } from '../utils';

class AddComment extends React.Component {

    constructor(props) {
        super(props)
        this.textBox = React.createRef();
    }

    makeComment = this.makeComment.bind(this)
    makeComment(e) {
        // issue fetch request and then afterwards requery for the post:
        let text = this.textBox.current.value
        if (!text)
            return
        fetch('/api/comments/', {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({'post_id': this.props.postId, 'text': text})
            })
            .then(response => response.ok ? response : Promise.reject(response))
            .then(_ => {
                this.props.requeryPost()
                this.textBox.current.focus()
            })
    }

    onEnter = this.onEnter.bind(this)
    onEnter(e) {
        if (e.key === 'Enter')
            this.makeComment()
    }

    render () {
        const post_id = this.props.postId
        if (this.textBox.current)
            this.textBox.current.value = ''
        return (
            <div className="add-comment">
                <div className="input-holder">
                    <label style={{display: 'none'}} htmlFor={`comment_${ post_id }`}>Add a comment</label>
                    <input placeholder="Add a comment…" id={`comment_${ post_id }`} ref={this.textBox}
                        onKeyDown={this.onEnter}></input>
                </div>
                <button className="link" onClick={this.makeComment}>Post</button>
            </div>
        );
    }
}

export default AddComment;

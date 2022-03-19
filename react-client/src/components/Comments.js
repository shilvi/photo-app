import React, { Fragment } from 'react';

class Comments extends React.Component {

    render () {
        const comments = this.props.comments
        return (
            <Fragment>
                {comments.length <= 1 ? null :
                <div>
                    <button className="link" onClick={() => alert('This feature is not implemented yet')}>
                        <p>View all {comments.length} comments</p>
                    </button>
                </div>
                }
                {comments.length === 0 ? null :
                <div className="comments">
                    <p><strong>{comments[comments.length - 1].user.username}</strong> {comments[comments.length - 1].text}</p>
                </div>
                }
            </Fragment>
        );
    }
}

export default Comments;

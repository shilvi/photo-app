const profile2Html = profile => {
    return `
        <img class="pic" src="${ profile.thumb_url }" alt="Profile Pic for ${ profile.username }">
        <h2>${ profile.username }</h2>
    `;
};

const followUser = (button, user_id) => {
    if (!button.classList.contains('active')) {
        fetch('/api/following/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify({'user_id': user_id})
        })
            .then(response => response.ok ? response : Promise.reject(response))
            .then(response => response.json())
            .then(data => {
                console.log(data)
                button.follow = data
                button.innerHTML = '<a>unfollow</a>'
                button.classList.add('active')
                button.ariaChecked = true
            })
            .catch(error => { console.log(error) });
    } else {
        fetch(`/api/following/${button.follow.id}`, {
            method: 'DELETE',
        })
            .then(response => response.ok ? response : Promise.reject(response))
            .then(response => response.json())
            .then(data => {
                console.log(data)
                delete button.follow
                button.innerHTML = '<a>follow</a>'
                button.classList.remove('active')
                button.ariaChecked = false
            })
            .catch(error => { console.log(error) });
    }
}

const suggestion2Html = suggestion => {
    return `
        <section>
            <img class="pic" src="${ suggestion.thumb_url }" alt="Profile Pic for ${ suggestion.username }">
            <div>
                <p>${ suggestion.username }</p>
                <p>suggested for you</p>
            </div>
            <div>
                <button class="link following" aria-label=Follow aria-checked=false onclick="followUser(this, ${ suggestion.id })">
                    <a>follow</a>
                </button>
            </div>
        </section>
    `;
};

const displaySuggestions = () => {
    fetch('/api/profile')
        .then(response => response.json())
        .then(profile => {
            const html = profile2Html(profile);
            document.querySelector('aside').querySelector('header').innerHTML = html;
        })

    fetch('/api/suggestions')
        .then(response => response.json())
        .then(suggestions => {
            const html = suggestions.map(suggestion2Html).join('\n');
            document.querySelector('.suggestions').querySelector('div').innerHTML = html;
        })
};


const story2Html = story => {
    return `
        <div>
            <img src="${ story.user.thumb_url }" class="pic" alt="profile pic for ${ story.user.username }" />
            <p>${ story.user.username }</p>
        </div>
    `;
};

const displayStories = () => {
    fetch('/api/stories')
        .then(response => response.json())
        .then(stories => {
            const html = stories.map(story2Html).join('\n');
            document.querySelector('.stories').innerHTML = html;
        })
};


const reDrawPost = (element, post_id) => {
    fetch(`/api/posts/${post_id}`)
        .then(response => response.json())
        .then(post => {
            element.closest('.card').outerHTML = post2Html(post)
        })
}

const interactPost = (button, post_id) => {
    let i = button.children[0]
    if (i.classList.contains('fa-heart')) {
        if (!i.classList.contains('fas')) {
            fetch(`/api/posts/${ post_id }/likes/`, {
                method: 'POST'
            })
                .then(response => response.ok ? response : Promise.reject(response))
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    button.setAttribute('data-id', data.id)
                    i.classList.add('fas')
                    button.ariaChecked = true
                    reDrawPost(button, post_id)
                })
                .catch(error => { console.log(error) });
        } else {
            fetch(`/api/posts/${ post_id }/likes/${ button.getAttribute('data-id') }`, {
                method: 'DELETE',
            })
                .then(response => response.ok ? response : Promise.reject(response))
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    i.classList.remove('fas')
                    button.ariaChecked = false
                    reDrawPost(button, post_id)
                })
                .catch(error => { console.log(error) });
        }
    } else if (i.classList.contains('fa-bookmark')) {
        if (!i.classList.contains('fas')) {
            fetch(`/api/bookmarks/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({'post_id': post_id})
            })
                .then(response => response.ok ? response : Promise.reject(response))
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    button.setAttribute('data-id', data.id)
                    i.classList.add('fas')
                    button.ariaChecked = true
                    reDrawPost(button, post_id)
                })
                .catch(error => { console.log(error) });
        } else {
            fetch(`/api/bookmarks/${ button.getAttribute('data-id') }`, {
                method: 'DELETE',
            })
                .then(response => response.ok ? response : Promise.reject(response))
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    i.classList.remove('fas')
                    button.ariaChecked = false
                    reDrawPost(button, post_id)
                })
                .catch(error => { console.log(error) });
        }
    }
}

const makeComment = (button, post_id) => {
    let text = button.parentNode.querySelector('input').value
    console.log(`Commenting "${text}"`)
    fetch('/api/comments/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify({'post_id': post_id, 'text': text})
    })
        .then(response => response.ok ? response : Promise.reject(response))
        .then(response => response.json())
        .then(data => {
            console.log(data)
            reDrawPost(button, post_id)
        })
        .catch(error => { console.log(error) });
}

const post2Html = post => {
    return `
        <div class="card">
            <div class="header">
                <h2>${ post.user.username }</h2>
            </div>
            <img src="${ post.image_url }" class="pic" alt="${ post.alt_text }" />
            <div class="info">
                <div class="buttons">
                    <div>
                        <button class="link" style="color: red;" aria-label=Follow
                            aria-checked=${ post.current_user_like_id ? 'true' : 'false' }
                            onclick="interactPost(this, ${ post.id })"  data-id=${ post.current_user_like_id }>
                            <i class="far ${ post.current_user_like_id ? 'fas' : '' } fa-heart"></i>
                        </button>
                        <button class="link" style="color: darkgreen;" aria-label=Comment
                            onclick="this.closest('.card').querySelector('.add-comment input').focus()">
                            <i class="far fa-comment"></i>
                        </button>
                        <button class="link" style="color: black;"
                            onclick="alert('This feature is not implemented yet')">
                            <i class="far fa-paper-plane"></i>
                        </button>
                    </div>
                    <button class="link" style="color: darkblue;" aria-label=Bookmark
                        aria-checked=${ post.current_user_bookmark_id ? 'true' : 'false' }
                        onclick="interactPost(this, ${ post.id })" data-id=${ post.current_user_bookmark_id }>
                        <i class="far ${ post.current_user_bookmark_id ? 'fas' : '' } fa-bookmark"></i>
                    </button>
                </div>
                <div class="likes">
                    <p><b>${ post.likes.length } likes</b></p>
                </div>
                <div class="caption">
                    <p><strong>${ post.user.username }</strong> ${ post.caption }</p>
                </div>
                ${ post.comments.length <= 1 ? '' : `
                <div>
                    <button class="link"><p>View all ${ post.comments.length } comments</p></button>
                </div>
                `}
                ${ post.comments.length == 0 ? '' : `
                <div class="comments">
                    <p><strong>${ post.comments[0].user.username }</strong> ${ post.comments[0].text }</p>
                </div>
                `}
                <div class="timestamp">
                    <p>${ post.display_time }</p>
                </div>
            </div>
            <div class="add-comment">
                <div class="input-holder">
                    <input placeholder="Add a comment…"
                        onkeydown="if (event.key === 'Enter') this.closest('.add-comment').querySelector('button').click()"
                        onfocus="this.closest('.card').querySelector('.fa-comment').classList.add('fas')"
                        onblur="this.closest('.card').querySelector('.fa-comment').classList.remove('fas')"></input>
                </div>
                <button class="link" onClick="makeComment(this, ${ post.id })">Post</button>
            </div>
        </div>
    `;
};

const displayPosts = () => {
    fetch('/api/posts/?limit=10')
        .then(response => response.json())
        .then(posts => {
            const html = posts.map(post2Html).join('\n');
            document.querySelector('#posts').innerHTML = html;
        })
};

const initPage = () => {
    displaySuggestions();
    displayStories();
    displayPosts();
};

// invoke init page to display stories:
initPage();
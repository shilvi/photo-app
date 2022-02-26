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
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCookie('csrf_access_token')
            },
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
            headers: {
                'X-CSRF-TOKEN': getCookie('csrf_access_token')
            }
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
    fetch('/api/profile', {
        headers: {
            'X-CSRF-TOKEN': getCookie('csrf_access_token')
        }
    })
        .then(response => response.json())
        .then(profile => {
            const html = profile2Html(profile);
            document.querySelector('aside').querySelector('header').innerHTML = html;
        })

    fetch('/api/suggestions', {
        headers: {
            'X-CSRF-TOKEN': getCookie('csrf_access_token')
        }
    })
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
    fetch('/api/stories', {
        headers: {
            'X-CSRF-TOKEN': getCookie('csrf_access_token')
        }
    })
        .then(response => response.json())
        .then(stories => {
            const html = stories.map(story2Html).join('\n');
            document.querySelector('.stories').innerHTML = html;
        })
};


const reDrawPost = (element, post_id) => {
    fetch(`/api/posts/${post_id}`, {
        headers: {
            'X-CSRF-TOKEN': getCookie('csrf_access_token')
        }
    })
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
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': getCookie('csrf_access_token')
                }
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
                headers: {
                    'X-CSRF-TOKEN': getCookie('csrf_access_token')
                }
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
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCookie('csrf_access_token')
                },
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
                headers: {
                    'X-CSRF-TOKEN': getCookie('csrf_access_token')
                }
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
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': getCookie('csrf_access_token')
        },
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

const post2ModalHtml = post => `
    <div class="modal-post" aria-modal="true">
        <img src="${ post.image_url }" alt="${ post.alt_text }"/>
        <div>
            <div class="header">
                <img class="pic" src="${ post.user.thumb_url }" alt="Profile Pic for ${ post.user.username }">
                <h2>${ post.user.username }</h2>
            </div>
            <div class="comments">
                <div>
                    <img class="pic" src="${ post.user.thumb_url }" alt="Profile Pic for ${ post.user.username }">
                    <p><strong>${ post.user.username }</strong> ${ post.caption }</p>
                </div>
                ${post.comments.map(comment => `
                    <div>
                        <img class="pic" src="${ comment.user.thumb_url }" alt="Profile Pic for ${ comment.user.username }">
                        <p><strong>${comment.user.username}</strong> ${comment.text}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>
`

const openPost = (button, post_id) => {
    let modal = document.querySelector('.modal')
    fetch(`/api/posts/${post_id}`, {
        headers: {
            'X-CSRF-TOKEN': getCookie('csrf_access_token')
        }
    })
        .then(response => response.json())
        .then(post => {
            document.onkeydown = (e) => { 
                if (e.key === 'Tab') {
                    e.preventDefault()
                    modal.children[0].focus()
                } else if (e.key === 'Escape') {
                    modal.children[0].click()
                }
            } 
            modal.children[0].onclick = () => {
                document.onkeydown = null
                document.body.style.overflow = "auto";
                modal.classList.add('visuallyhidden')
                modal.children[1].outerHTML = '<div></div>'
                button.focus()
            }
            modal.children[1].outerHTML = post2ModalHtml(post)
            document.body.style.overflow = "hidden";
            modal.classList.remove('visuallyhidden')
            modal.children[0].focus()
        })
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
                        <button class="link" style="color: red;" aria-label=Like
                            aria-checked=${ post.current_user_like_id ? 'true' : 'false' }
                            onclick="interactPost(this, ${ post.id })"  data-id=${ post.current_user_like_id }>
                            <i class="far ${ post.current_user_like_id ? 'fas' : '' } fa-heart"></i>
                        </button>
                        <button class="link" style="color: darkgreen;" aria-label=Comment
                            onclick="this.closest('.card').querySelector('.add-comment input').focus()">
                            <i class="far fa-comment"></i>
                        </button>
                        <button class="link" style="color: black;" aria-label=Send
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
                    <button class="link" onclick="openPost(this, ${ post.id })">
                        <p>View all ${ post.comments.length } comments</p>
                    </button>
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
                    <label style="display: none" for="comment_${ post.id }">Add a comment</label>
                    <input placeholder="Add a comment…" id="comment_${ post.id }"
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
    fetch('/api/posts/?limit=10', {
        headers: {
            'X-CSRF-TOKEN': getCookie('csrf_access_token')
        }
    })
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

const getCookie = key => {
    let name = key + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};

// invoke init page to display stories:
initPage();
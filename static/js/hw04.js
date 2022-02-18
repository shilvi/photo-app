const profile2Html = profile => {
    return `
        <img class="pic" src="${ profile.thumb_url }" alt="Profile Pic for ${ profile.username }">
        <h2>${ profile.username }</h2>
    `;
};

const followUser = (button, user_id) => {
    if (!button.classList.contains('active')) {
        fetch('api/following/', {
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
        fetch(`api/following/${button.follow.id}`, {
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

const initPage = () => {
    displaySuggestions();
    displayStories();
};

// invoke init page to display stories:
initPage();
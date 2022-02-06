# load the environment variables:
from dotenv import load_dotenv
load_dotenv()

from flask import Flask, render_template
from flask_restful import Api
import os
from models import db, User
from views import bookmarks, comments, followers, following, \
    posts, profile, stories, suggestions, post_likes, comment_likes
import requests

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DB_URL')
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False    


db.init_app(app)
api = Api(app)

# set logged in user
with app.app_context():
    app.current_user = User.query.filter_by(id=12).one()


# Initialize routes for all of your API endpoints:
bookmarks.initialize_routes(api)
comments.initialize_routes(api)
followers.initialize_routes(api)
following.initialize_routes(api)
posts.initialize_routes(api)
post_likes.initialize_routes(api)
comment_likes.initialize_routes(api)
profile.initialize_routes(api)
stories.initialize_routes(api)
suggestions.initialize_routes(api)

# Server-side template for the homepage:
@app.route('/')
def home():
    # url = lambda api: f'https://shilvi-photo-app.herokuapp.com/api/{api}'
    url = lambda api: f'http://localhost:5000/api/{api}'
    print(requests.get(url('posts'), params={'limit': 8}).json())
    return render_template(
        'index.html', 
        user=app.current_user.to_dict(),
        posts=requests.get(url('posts'), params={'limit': 8}).json(),
        stories=requests.get(url('stories')).json(),
        suggestions=requests.get(url('suggestions')).json()
    )


# enables flask app to run using "python3 app.py"
if __name__ == '__main__':
    app.run()

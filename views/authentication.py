import datetime
from flask import (
    request, make_response, render_template, redirect
)
from models import User
import flask_jwt_extended

def logout():
    # hint:  https://dev.to/totally_chase/python-using-jwt-in-cookies-with-a-flask-app-and-restful-api-2p75
    request = redirect('/login', code=302)
    flask_jwt_extended.unset_jwt_cookies(request)
    return request

def login():
    if request.method == 'POST':
        # authenticate user here. If the user sent valid credentials, set the
        # JWT cookies:
        # https://flask-jwt-extended.readthedocs.io/en/3.0.0_release/tokens_in_cookies/
        user = User.query.filter(User.username == request.form['username']).one_or_none()
        if user is None:
            return render_template(
                'login.html',
                message='Invalid username'
            )
        if not user.check_password(request.form['password']):
            return render_template(
                'login.html',
                message='Invalid password'
            )
        expires = datetime.timedelta(hours=2)
        access_token = flask_jwt_extended.create_access_token(
            identity=user.id,
            expires_delta=expires
        )
        response = make_response(redirect('/', 302))
        flask_jwt_extended.set_access_cookies(response, access_token)
        return response
    else:
        return render_template(
            'login.html'
        )

def initialize_routes(app):
    app.add_url_rule('/login', 
        view_func=login, methods=['GET', 'POST'])
    app.add_url_rule('/logout', view_func=logout)
from models import User
from views import return_400_on_exception
import flask_jwt_extended
from flask import Response, request
from flask_restful import Resource
import json
from datetime import timezone, datetime, timedelta

class AccessTokenEndpoint(Resource):

    @return_400_on_exception
    def post(self):
        body = request.get_json() or {}
        # print(body)

        # check username and log in credentials. If valid, return tokens
        user = User.query.filter(User.username == body['username']).one_or_none()
        if user is None:
            return Response(json.dumps({ 
                'message': 'Invalid username'
            }), mimetype='application/json', status=401)
        if not user.check_password(body['password']):
            return Response(json.dumps({ 
                'message': 'Invalid password'
            }), mimetype='application/json', status=401)
        expires = timedelta(hours=2)
        access_token = flask_jwt_extended.create_access_token(
            identity=user.id,
            expires_delta=expires
        )
        expires = timedelta(hours=12)
        refresh_token = flask_jwt_extended.create_refresh_token(
            identity=user.id,
            expires_delta=expires
        )
        return Response(json.dumps({ 
            'access_token': access_token, 
            'refresh_token': refresh_token
        }), mimetype='application/json', status=200)


class RefreshTokenEndpoint(Resource):
    
    @return_400_on_exception
    def post(self):

        body = request.get_json() or {}
        refresh_token = body.get('refresh_token')
        # print(refresh_token)
        '''
        https://flask-jwt-extended.readthedocs.io/en/latest/refreshing_tokens/
        Hint: To decode the refresh token and see if it expired:
        '''
        decoded_token = flask_jwt_extended.decode_token(refresh_token)
        exp_timestamp = decoded_token.get('exp')
        current_timestamp = datetime.timestamp(datetime.now(timezone.utc))
        if exp_timestamp < current_timestamp:
            return Response(json.dumps({ 
                    'message': 'refresh_token has expired'
                }), mimetype='application/json', status=401)
        else:
            expires = timedelta(hours=2)
            access_token = flask_jwt_extended.create_access_token(
                identity=decoded_token.get('sub'),
                expires_delta=expires
            )
            return Response(json.dumps({ 
                    'access_token': access_token
                }), mimetype='application/json', status=200)


def initialize_routes(api):
    api.add_resource(
        AccessTokenEndpoint, 
        '/api/token', '/api/token/'
    )

    api.add_resource(
        RefreshTokenEndpoint, 
        '/api/token/refresh', '/api/token/refresh/'
    )
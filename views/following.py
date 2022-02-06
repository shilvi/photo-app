from os import curdir
from flask import Response, request
from flask_restful import Resource
from models import Following, User, db, following
from . import return_400_on_exception
import json

def get_path():
    return request.host_url + 'api/posts/'

class FollowingListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    @return_400_on_exception
    def get(self):
        following = Following.query.filter(Following.user_id == self.current_user.id)
        return Response(json.dumps([item.to_dict_following() for item in following]), mimetype="application/json", status=200)

    @return_400_on_exception
    def post(self):
        body = request.get_json()
        following_id = body.get('user_id')
        user_id = self.current_user.id

        if not User.query.get(int(following_id)):
            return Response(json.dumps({'message': f'User {following_id} does not exist'}), mimetype="application/json", status=404)

        following = Following(user_id, following_id)
        db.session.add(following)
        db.session.commit()
        return Response(json.dumps(following.to_dict_following()), mimetype="application/json", status=201)


class FollowingDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    @return_400_on_exception
    def delete(self, id):
        following_query = Following.query.filter_by(id=id)
        following = following_query.first()
        if not following or following.user_id != self.current_user.id:
            return Response(json.dumps({'message': 'Not Following'}), mimetype="application/json", status=404)
        following_query.delete()
        db.session.commit()
        return Response(json.dumps({'message': 'Unfollowed'}), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        FollowingListEndpoint, 
        '/api/following', 
        '/api/following/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
    api.add_resource(
        FollowingDetailEndpoint, 
        '/api/following/<id>', 
        '/api/following/<id>/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )

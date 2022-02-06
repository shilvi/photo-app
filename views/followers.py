from flask import Response, request
from flask_restful import Resource
from models import Following
from . import return_400_on_exception
import json

def get_path():
    return request.host_url + 'api/posts/'

class FollowerListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    @return_400_on_exception
    def get(self):
        followers = Following.query.filter(Following.following_id == self.current_user.id)
        return Response(json.dumps([item.to_dict_follower() for item in followers]), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        FollowerListEndpoint, 
        '/api/followers', 
        '/api/followers/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )

from flask import Response
from flask_restful import Resource
import flask_jwt_extended
from models import Story
from . import get_authorized_user_ids
import json

class StoriesListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def get(self):
        stories = Story.query.filter(Story.user_id.in_(get_authorized_user_ids(self.current_user))).all()
        return Response(json.dumps([item.to_dict() for item in stories]), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        StoriesListEndpoint, 
        '/api/stories', 
        '/api/stories/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )

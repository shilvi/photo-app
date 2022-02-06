from flask import Response, request
from flask_restful import Resource
from models import User, Following
from . import get_authorized_user_ids
import json

class SuggestionsListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def get(self):
        suggestions = User.query.filter(User.id.not_in(get_authorized_user_ids(self.current_user))).limit(7)
        return Response(json.dumps([item.to_dict() for item in suggestions]), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        SuggestionsListEndpoint, 
        '/api/suggestions', 
        '/api/suggestions/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )

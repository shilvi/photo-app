from flask import Response, request
from flask_restful import Resource
import flask_jwt_extended
from . import can_view_post, return_400_on_exception
import json
from models import db, Comment, Post

class CommentListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    @return_400_on_exception
    def post(self):
        body = request.get_json()
        post_id = body.get('post_id')
        text = body.get('text')
        user_id = self.current_user.id

        if not Post.query.get(int(post_id)) or not can_view_post(post_id, self.current_user):
            return Response(json.dumps({'message': f'Post {post_id} does not exist'}), mimetype="application/json", status=404)

        comment = Comment(text, user_id, post_id)
        db.session.add(comment)
        db.session.commit()
        return Response(json.dumps(comment.to_dict()), mimetype="application/json", status=201)
        
class CommentDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
  
    @flask_jwt_extended.jwt_required()
    @return_400_on_exception
    def delete(self, id):
        comment_query = Comment.query.filter_by(id=id)
        comment = comment_query.first()
        if not comment or comment.user_id != self.current_user.id:
            return Response(json.dumps({'message': 'No Comment Found'}), mimetype="application/json", status=404)
        comment_query.delete()
        db.session.commit()
        return Response(json.dumps({'message': 'Uncommented'}), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        CommentListEndpoint, 
        '/api/comments', 
        '/api/comments/',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}

    )
    api.add_resource(
        CommentDetailEndpoint, 
        '/api/comments/<id>', 
        '/api/comments/<id>',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )

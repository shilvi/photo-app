from flask import Response
from flask_restful import Resource
from models import LikeComment, db, Comment
import json
from . import get_authorized_user_ids, return_400_on_exception

class CommentLikesListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @return_400_on_exception
    def post(self, comment_id):
        comment = Comment.query.get(int(comment_id))
        if not comment or not comment.user_id in get_authorized_user_ids(self.current_user):
            return Response(json.dumps({'message': f'Comment {comment_id} does not exist'}), mimetype="application/json", status=404)

        like_comment = LikeComment(self.current_user.id, comment_id)
        db.session.add(like_comment)
        db.session.commit()
        return Response(json.dumps(like_comment.to_dict()), mimetype="application/json", status=201)

class CommentLikesDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @return_400_on_exception
    def delete(self, comment_id, id):
        like_comment_query = LikeComment.query.filter_by(id=id, comment_id=comment_id)
        like_comment = like_comment_query.first()
        if not like_comment or like_comment.user_id != self.current_user.id:
            return Response(json.dumps({'message': 'No like Found'}), mimetype="application/json", status=404)
        like_comment_query.delete()
        db.session.commit()
        return Response(json.dumps({'message': 'Unliked'}), mimetype="application/json", status=200)



def initialize_routes(api):
    api.add_resource(
        CommentLikesListEndpoint, 
        '/api/comments/<comment_id>/likes', 
        '/api/comments/<comment_id>/likes/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )

    api.add_resource(
        CommentLikesDetailEndpoint, 
        '/api/comments/<comment_id>/likes/<id>', 
        '/api/comments/<comment_id>/likes/<id>/',
        resource_class_kwargs={'current_user': api.app.current_user}
    )

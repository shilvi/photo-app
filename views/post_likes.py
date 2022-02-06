from flask import Response
from flask_restful import Resource
from models import LikePost, db, Post
import json
from . import can_view_post, return_400_on_exception

class PostLikesListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @return_400_on_exception
    def post(self, post_id):
        if not Post.query.get(int(post_id)) or not can_view_post(post_id, self.current_user):
            return Response(json.dumps({'message': f'Post {post_id} does not exist'}), mimetype="application/json", status=404)

        like_post = LikePost(self.current_user.id, post_id)
        db.session.add(like_post)
        db.session.commit()
        return Response(json.dumps(like_post.to_dict()), mimetype="application/json", status=201)

class PostLikesDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @return_400_on_exception
    def delete(self, post_id, id):
        like_post_query = LikePost.query.filter_by(id=id, post_id=post_id)
        like_post = like_post_query.first()
        if not like_post or like_post.user_id != self.current_user.id:
            return Response(json.dumps({'message': 'No like Found'}), mimetype="application/json", status=404)
        like_post_query.delete()
        db.session.commit()
        return Response(json.dumps({'message': 'Unliked'}), mimetype="application/json", status=200)



def initialize_routes(api):
    api.add_resource(
        PostLikesListEndpoint, 
        '/api/posts/<post_id>/likes', 
        '/api/posts/<post_id>/likes/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )

    api.add_resource(
        PostLikesDetailEndpoint, 
        '/api/posts/<post_id>/likes/<id>', 
        '/api/posts/<post_id>/likes/<id>/',
        resource_class_kwargs={'current_user': api.app.current_user}
    )

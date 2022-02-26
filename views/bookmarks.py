from flask import Response, request
from flask_restful import Resource
import flask_jwt_extended
from models import Bookmark, db, Post
import json
from . import can_view_post, return_400_on_exception

class BookmarksListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def get(self):
        bookmarks = Bookmark.query.filter(Bookmark.user_id == self.current_user.id).all()
        return Response(json.dumps([item.to_dict() for item in bookmarks]), mimetype="application/json", status=200)

    @flask_jwt_extended.jwt_required()
    @return_400_on_exception
    def post(self):
        body = request.get_json()
        post_id = body.get('post_id')
        user_id = self.current_user.id

        if not Post.query.get(int(post_id)) or not can_view_post(post_id, self.current_user):
            return Response(json.dumps({'message': f'Post {post_id} does not exist'}), mimetype="application/json", status=404)

        bookmark = Bookmark(user_id, post_id)
        db.session.add(bookmark)
        db.session.commit()
        return Response(json.dumps(bookmark.to_dict()), mimetype="application/json", status=201)

class BookmarkDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    @return_400_on_exception
    def delete(self, id):
        bookmark_query = Bookmark.query.filter_by(id=id)
        bookmark = bookmark_query.first()
        if not bookmark or bookmark.user_id != self.current_user.id:
            return Response(json.dumps({'message': 'Not Bookmarked'}), mimetype="application/json", status=404)
        bookmark_query.delete()
        db.session.commit()
        return Response(json.dumps({'message': 'Unbookmarked'}), mimetype="application/json", status=200)



def initialize_routes(api):
    api.add_resource(
        BookmarksListEndpoint, 
        '/api/bookmarks', 
        '/api/bookmarks/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )

    api.add_resource(
        BookmarkDetailEndpoint, 
        '/api/bookmarks/<id>', 
        '/api/bookmarks/<id>',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )

import utils
import requests

root_url = utils.root_url
import unittest

class TestLikeCommentListEndpoint(unittest.TestCase):
    
    def setUp(self):
        self.current_user = utils.get_user_12()
        pass

    def test_like_comment_valid_request_201(self):
        comment_id = utils.get_unliked_comment_id_by_user(self.current_user.get('id'))
        url = '{0}/api/comments/{1}/likes'.format(root_url, comment_id)
        response = requests.post(url, json={})
        # print(response.text)
        self.assertEqual(response.status_code, 201)
        new_like = response.json()

        # check that the values are in the returned json:
        self.assertEqual(new_like.get('comment_id'), comment_id)
        self.assertEqual(new_like.get('user_id'), self.current_user.get('id'))

        # check that it's really in the database:
        new_like_db = utils.get_liked_comment_by_id(new_like.get('id'))
        self.assertEqual(new_like_db.get('id'), new_like.get('id'))

        # now delete like from DB:
        utils.delete_like_comment_by_id(new_like.get('id'))

        # and check that it's gone:
        self.assertEqual(utils.get_liked_comment_by_id(new_like.get('id')), [])

    def test_like_comment_no_duplicates_400(self):
        liked_comment = utils.get_liked_comment_by_user(self.current_user.get('id'))
        url = '{0}/api/comments/{1}/likes'.format(root_url, liked_comment.get('comment_id'))
        response = requests.post(url, json={})
        # print(liked_comment.get('comment_id'))
        # print(response.text)
        self.assertEqual(response.status_code, 400)

    def test_like_comment_invalid_comment_id_format_400(self):
        response = requests.post(root_url + '/api/comments/dasdasdasd/likes', json={})
        # print(response.text)
        self.assertEqual(response.status_code, 400)

    def test_like_comment_invalid_comment_id_404(self):
        response = requests.post(root_url + '/api/comments/99999/likes', json={})
        # print(response.text)
        self.assertEqual(response.status_code, 404)

    def test_like_comment_unauthorized_comment_id_404(self):
        comment = utils.get_comment_that_user_cannot_access(self.current_user.get('id'))
        url = '{0}/api/comments/{1}/likes'.format(root_url, comment.get('id'))
        response = requests.post(url, json={})
        # print(response.text)
        self.assertEqual(response.status_code, 404)

    
class TestLikeCommentDetailEndpoint(unittest.TestCase):
    
    def setUp(self):
        self.current_user = utils.get_user_12()
        pass

    def test_like_comment_delete_valid_200(self):
        liked_comment = utils.get_liked_comment_by_user(self.current_user.get('id'))
        url = '{0}/api/comments/{1}/likes/{2}'.format(
            root_url, 
            liked_comment.get('comment_id'), 
            liked_comment.get('id')
        )
        
        response = requests.delete(url)
        # print(response.text)
        self.assertEqual(response.status_code, 200)

        # restore the comment in the database:
        utils.restore_liked_comment(liked_comment)


    def test_like_comment_delete_invalid_id_format_400(self):
        liked_comment = utils.get_liked_comment_by_user(self.current_user.get('id'))
        url = '{0}/api/comments/{1}/likes/{2}'.format(
            root_url, 
            liked_comment.get('comment_id'), 
            'sdfsdfdsf'
        )
        response = requests.delete(url)
        self.assertEqual(response.status_code, 400)
        
    
    def test_like_comment_delete_invalid_id_404(self):
        liked_comment = utils.get_liked_comment_by_user(self.current_user.get('id'))
        url = '{0}/api/comments/{1}/likes/{2}'.format(
            root_url, 
            liked_comment.get('comment_id'), 
            99999
        )
        response = requests.delete(url)
        self.assertEqual(response.status_code, 404)

        
    def test_like_comment_delete_unauthorized_id_404(self): 
        unauthorized_liked_comment = utils.get_liked_comment_that_user_cannot_delete(self.current_user.get('id'))
        url = '{0}/api/comments/{1}/likes/{2}'.format(
            root_url, 
            unauthorized_liked_comment.get('comment_id'), 
            unauthorized_liked_comment.get('id')
        )
        response = requests.delete(url)
        self.assertEqual(response.status_code, 404)
        

if __name__ == '__main__':
    # to run all of the tests:
    # unittest.main()

    # to run some of the tests (convenient for commenting out some of the tests):
    suite = unittest.TestSuite()
    suite.addTests([
        
        # POST Tests:
        TestLikeCommentListEndpoint('test_like_comment_valid_request_201'),
        TestLikeCommentListEndpoint('test_like_comment_no_duplicates_400'),
        TestLikeCommentListEndpoint('test_like_comment_invalid_comment_id_format_400'),
        TestLikeCommentListEndpoint('test_like_comment_invalid_comment_id_404'),
        TestLikeCommentListEndpoint('test_like_comment_unauthorized_comment_id_404'),

        # # DELETE Tests:
        TestLikeCommentDetailEndpoint('test_like_comment_delete_valid_200'),
        TestLikeCommentDetailEndpoint('test_like_comment_delete_invalid_id_format_400'),
        TestLikeCommentDetailEndpoint('test_like_comment_delete_invalid_id_404'),
        TestLikeCommentDetailEndpoint('test_like_comment_delete_unauthorized_id_404'),    
    ])

    unittest.TextTestRunner(verbosity=2).run(suite)
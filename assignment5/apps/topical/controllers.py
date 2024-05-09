"""
This file defines actions, i.e. functions the URLs are mapped into
The @action(path) decorator exposed the function at URL:

    http://127.0.0.1:8000/{app_name}/{path}

If app_name == '_default' then simply

    http://127.0.0.1:8000/{path}

If path == 'index' it can be omitted:

    http://127.0.0.1:8000/

@action.uses('generic.html')  indicates that the action uses the generic.html template
@action.uses(session)         indicates that the action uses the session
@action.uses(db)              indicates that the action uses the db
@action.uses(auth.user)       indicates that the action requires a logged in user
@action.uses(auth)            indicates that the action requires the auth object

"""

from py4web import action, request, URL
from .common import auth
from .models import db, get_user_email


@action("index")
@action.uses("index.html", db, auth.user)
def index():
    return dict(
        post_url=URL("post"),
        delete_post_url=URL("delete_post"),
        get_posts_url=URL("get_posts"),
        get_email_url=URL("get_email"),
    )


@action("get_posts")
@action.uses(db)
def get_posts():
    posts = db(db.post).select().as_list()
    return dict(posts=posts)


@action("delete_post", method="POST")
@action.uses(db, auth.user)
def delete_post():
    post_id = request.json["post_id"]
    if get_user_email() != db(db.post.id == post_id).select().first().email:
        return dict(error="Not authorized")
    db(db.post.id == post_id).delete()
    return dict()


@action("post", method="POST")
@action.uses(db, auth.user)
def post():
    post_data = request.json
    id = db.post.insert(content=post_data["content"])
    # return post we just inserted
    post_data = db(db.post.id == id).select().first().as_dict()
    return dict(post=post_data)


@action("get_email")
@action.uses(auth.user)
def get_email():
    return dict(email=get_user_email())

"""
This file defines actions, i.e. functions the URLs are mapped into
The @action(path) decorator exposed the function at URL:

    http://127.0.0.1:8000/{app_name}/{path}

If app_name == '_default' then simply

    http://127.0.0.1:8000/{path}

If path == 'index' it can be omitted:

    http://127.0.0.1:8000/

The path follows the bottlepy syntax.

@action.uses('generic.html')  indicates that the action uses the generic.html template
@action.uses(session)         indicates that the action uses the session
@action.uses(db)              indicates that the action uses the db
@action.uses(T)               indicates that the action uses the i18n & pluralization
@action.uses(auth.user)       indicates that the action requires a logged in user
@action.uses(auth)            indicates that the action requires the auth object

session, db, T, auth, and tempates are examples of Fixtures.
Warning: Fixtures MUST be declared with @action.uses({fixtures}) else your app will result in undefined behavior
"""

from py4web import action, request, abort, redirect, URL
from yatl.helpers import A
from .common import (
    db,
    session,
    T,
    cache,
    auth,
    logger,
    authenticated,
    unauthenticated,
    flash,
)
from py4web.utils.url_signer import URLSigner
from .models import get_user_email

url_signer = URLSigner(session)


@action("index")
@action.uses("index.html", db, auth.user)
def index():
    return dict(
        # For example...
        load_data_url=URL("load_data")
    )


@action("load_data")
@action.uses(db, auth.user)
def load_data():
    data = db(db.shopping_list.owner == get_user_email()).select()
    for item in data:
        item.checked = item.purchased == "yes"
    print("got user dict: ", data)
    return dict(data=data)


@action("update_items", method=["GET", "POST"])
@action.uses(db, auth.user)
def update_items():
    if request.method == "GET":
        return "Silly Goose, you can't do that!"
    try:
        print("request.json: ", request.json)
        db_items = db(db.shopping_list.owner == get_user_email()).select()
        for item in request.json["items"]:
            # compare db items to request.json items
            # if item is in db, update it
            # if item is not in db, add it
            # if item is in db but not in request.json, delete it
            item_name = item["item_name"]
            purchased = item["purchased"]
            print("item_name: ", item_name)
            print("purchased: ", purchased)
            # check if item is in db
            if item_name in [db_item["item_name"] for db_item in db_items]:
                # update item
                db(db.shopping_list.item_name == item_name).update(purchased=purchased)
            else:
                # add item
                db.shopping_list.insert(item_name=item_name, purchased=purchased)

        for db_item in db_items:
            if db_item["item_name"] not in [
                item["item_name"] for item in request.json["items"]
            ]:
                # delete item
                db(db.shopping_list.item_name == db_item["item_name"]).delete()
        return dict(success=True)
    except Exception as e:
        return dict(success=False, error=str(e))  # not secure or whatever

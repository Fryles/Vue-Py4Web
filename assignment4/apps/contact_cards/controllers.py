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
from .models import get_user_email


@action("index")
@action.uses("index.html", db, auth.user)
def index():
    return dict(
        get_contacts_url=URL("get_contacts"),
        # Complete.
    )


# returns all contacts for the current user
@action("get_contacts")
@action.uses(db, auth.user)
def get_contacts():
    # filter by user email
    contacts = db(db.contact_card.user_email == get_user_email()).select().as_list()
    return dict(contacts=contacts)


# adds a contact to the db and returns the id of the created contact
@action("add_contact", method=["POST"])
@action.uses(db, auth.user)
def add_contact():
    data = request.json
    if data is None:
        return dict()
    # remove id
    data.pop("id", None)
    # insert data into db
    db.contact_card.insert(**data)
    # return db created id
    return dict(id=db(db.contact_card.name == data["name"]).select().first().id)


# deletes a contact from the db (if the user is the owner of the contact)
@action("delete_contact", method=["POST"])
@action.uses(db, auth.user)
def delete_contact():
    data = request.json
    if data is None:
        return dict()
    # check if user is owner
    owner = db(db.contact_card.id == data["id"]).select().first().user_email
    if not owner == get_user_email():
        abort(403)
    # delete contact from db
    db(db.contact_card.id == data["id"]).delete()
    return dict()
#

@action("edit_contact", method=["POST"])
@action.uses(db, auth.user)
def edit_contact():
    data = request.json
    if data is None:
        return dict()
    # check if user is owner
    owner = db(db.contact_card.id == data["id"]).select().first().user_email
    if not owner == get_user_email():
        abort(403)
    # update contact in db
    db(db.contact_card.id == data["id"]).update(**data)
    return dict()

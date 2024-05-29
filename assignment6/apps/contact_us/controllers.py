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
from py4web.utils.form import Form, FormStyleBulma
from py4web.utils.grid import Grid, GridClassStyleBulma

# Complete.


@action("contact_requests", method=["GET", "POST"])
@action("contact_requests/<path:path>", method=["GET", "POST"])
@action.uses("contact_requests.html", db, auth.user, session)
def contact_requests(path=None):
    if get_user_email() != "admin@example.com":
        redirect(URL("index"))
    else:
        grid = Grid(
            path,
            formstyle=FormStyleBulma,
            grid_class_style=GridClassStyleBulma,
            query=(db.contact_request.id > 0),
            orderby=[db.contact_request.time],
            columns=[
                db.contact_request.name,
                db.contact_request.email,
                db.contact_request.phone,
                db.contact_request.message,
            ],
            search_queries=[
                ["Search by Name", lambda val: db.contact_request.name.contains(val)],
                [
                    "Search by Message",
                    lambda val: db.contact_request.message.contains(val),
                ],
            ],
        )
        return dict(grid=grid)


@action("index", method=["GET", "POST"])
@action.uses(db, session, "index.html")
def index():
    form = Form(
        db.contact_request,
        csrf_session=session,
        formstyle=FormStyleBulma,
        deletable=False,
    )
    if form.accepted:
        print(form.vars)
        redirect(URL("index"))
    else:
        print(form.errors)
    return dict(form=form)

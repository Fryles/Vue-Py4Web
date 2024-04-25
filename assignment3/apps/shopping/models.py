"""
This file defines the database models
"""

import datetime
from .common import db, Field, auth
from pydal.validators import *


def get_user_email():
    return auth.current_user.get("email") if auth.current_user else None


def get_time():
    return datetime.datetime.utcnow()


# Add here any table definition you need. Below is an example.
db.define_table(
    "shopping_list",
    Field("item_name", requires=IS_NOT_EMPTY()),
    # boolean field to indicate if the product has been purchased
    Field("purchased", requires=IS_IN_SET(["yes", "no"]), default="no"),
    Field("owner", default=get_user_email, requires=IS_EMAIL(), writable=False),
)

db.commit()

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


db.define_table(
    "contact_card",
    Field("user_email", default=get_user_email, requires=IS_EMAIL(), writable=False),
    Field("name"),
    Field("affiliation"),
    Field("desc"),
    Field("image"),
)

db.commit()

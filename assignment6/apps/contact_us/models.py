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
    "entries",
    Field("time", "datetime", default=get_time, writable=False),
    Field("name", requires=IS_NOT_EMPTY()),
    Field(
        "email",
        requires=IS_EMAIL(),
    ),
    Field("message", "text"),
    Field("phone", requires=IS_NOT_EMPTY()),
)

db.commit()

"""
This file defines the database models
"""

import datetime
import re

from .common import db, Field, auth
from pydal.validators import *


def get_user_email():
    return auth.current_user.get("email") if auth.current_user else None


def get_user():
    return auth.current_user.get("id") if auth.current_user else None


def get_time():
    return datetime.datetime.utcnow()


db.define_table(
    "post",
    Field("email", default=get_user_email),
    Field("time", "datetime", default=get_time),
    Field("content", "text"),
)

db.commit()

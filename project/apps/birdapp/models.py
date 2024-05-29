"""
This file defines the database models
"""

import csv
import datetime
from .common import db, Field, auth
from pydal.validators import *
import os


def get_user_email():
    return auth.current_user.get("email") if auth.current_user else None


def get_time():
    return datetime.datetime.utcnow()


### Define your table below
#
# db.define_table('thing', Field('name'))
#
## always commit your models to avoid problems later

db.define_table(
    "bird_sightings",
    Field("bird_name", "string", requires=IS_NOT_EMPTY()),
    Field("latitude", "double", requires=IS_NOT_EMPTY()),
    Field("longitude", "double", requires=IS_NOT_EMPTY()),
    Field("time", "datetime", default=get_time),
    Field("email", default=get_user_email),
)

db.define_table(
    "checklists",
    Field("checklist_id", "string", requires=IS_NOT_EMPTY()),
    Field("bird_name", "string", requires=IS_NOT_EMPTY()),
    Field("observed", "integer", requires=IS_NOT_EMPTY()),
)

db.define_table(
    "species",
    Field("bird_name", "string", requires=IS_NOT_EMPTY()),
)
# import primer csv file
with open("apps/birdapp/predata/species.csv", "r") as f:
    reader = csv.reader(f)
    for row in reader:
        db.species.insert(bird_name=row[0])


db.commit()

from flask_sqlalchemy import SQLAlchemy
from config import HASH_LEN

db = SQLAlchemy()


class Url(db.Model):
    __tablename__ = "urls"

    hash = db.Column(db.String(HASH_LEN), unique=True, primary_key=True)
    forward_to = db.Column(db.Text(), unique=True, primary_key=True)
    visited_times = db.Column(db.Integer, default=0)

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask.ext.bootstrap import Bootstrap
import os

app = Flask(__name__)
bootstrap = Bootstrap(app)
app.config.from_object('config')
app.secret_key = os.urandom(24)
db = SQLAlchemy(app)
from . import views, models
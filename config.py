import os
basedir = os.path.abspath('/home/flyback/mysite')

SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, "app.db")
SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')
# WTF_CSRF_SECRET_KEY = 'flyback you can not guess'

CSRF_ENABLED = True
# SECRET_KEY = 'you-will-never-guess'

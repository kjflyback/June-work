import os
from dailywork import app as application
print application.config
basedir = os.path.abspath('')
application.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, "app.db")
application.config['SQLALCHEMY_MIGRATE_REPO'] = os.path.join(basedir, 'db_repository')

application.debug = True
application.run('', 8000)  
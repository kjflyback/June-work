from . import db
import datetime

ROLE_USER = 0
ROLE_ADMIN = 1

class User(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    nickname = db.Column(db.String(64), index = True, unique = True)
    email = db.Column(db.String(120), index = True, unique = True)
    role = db.Column(db.SmallInteger, default = ROLE_USER)
    posts = db.relationship('Post', backref = 'author', lazy = 'dynamic')
    
    def __repr__(self):
        return '<User %r>' % (self.nickname)
    
class Post(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    body = db.Column(db.String(140))
    timestamp = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    
    def __repr__(self):
        return '<Post %r>' % (self.body)
    
class ClientType(db.Model):
    id = db.Column(db.Integer, db.Sequence('clienttype_id_seq'), primary_key = True)
    desc = db.Column(db.String(64), index=True, default='general')
    timestamp=db.Column(db.DateTime, default=datetime.datetime.now())
    def __repr__(self):
        return '<ClientType %r>' % (self.desc)

class ClientInterface(db.Model):
    __tablename__ = "clientinterface"
    # for person
    id = db.Column(db.Integer, db.Sequence('clientinterface_id_seq'), primary_key = True)
    name = db.Column(db.String(64), index=True, default='No')
    # phonenumber=db.Column(db.String(64), index=True)
    timestamp=db.Column(db.DateTime, default=datetime.datetime.now())
    def __repr__(self):
        return '<ClientInterface %r>' % (self.name)

class Group(db.Model):
    __tablename__ = "group"
    id = db.Column(db.Integer, db.Sequence('clienttype_id_seq'), primary_key = True)
    name = db.Column(db.String(250), index=True, default='no group')
    timestamp=db.Column(db.DateTime, default=datetime.datetime.now())
    def __repr__(self):
        return '<Group %r>' % (self.name)
    
class Client(db.Model):   
    __tablename__ = "client" 
    id = db.Column(db.Integer, db.Sequence('client_id_seq'), primary_key = True)
    name = db.Column(db.String(64), index=True, unique=True)
    group_id=db.Column(db.Integer)
    timestamp=db.Column(db.DateTime, default=datetime.datetime.now())
    def __repr__(self):
        return '<Client %r>' % (self.name)

class WorkFlow(db.Model):   
    __tablename__ = "workflow" 
    id = db.Column(db.Integer, db.Sequence('workflow_id_seq'), primary_key = True)
    client_id=db.Column(db.Integer)
    group_id=db.Column(db.Integer, default=0)
    interface_id=db.Column(db.Integer, default=0)
    type_id=db.Column(db.Integer, default = 0)
    telephone=db.Column(db.String(64), index=True, default='00000000')
    phonenumber=db.Column(db.String(64), index=True, default='9999999999999')
    comment = db.Column(db.String(250))
    timestamp=db.Column(db.DateTime, default=datetime.datetime.now())
    def __repr__(self):
        return '<WorkFlow %r>' % (self.timestamp)
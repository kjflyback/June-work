from flask.ext.wtf import Form

from wtforms import TextField, BooleanField, TextAreaField
from wtforms.validators import Required

class LoginForm(Form):
    SECRET_KEY = "xman"
    openid = TextField('openid', validators = [Required()])
    remember_me = BooleanField('remember_me', default = False)


class PostForm(Form):
    clientname = TextField('clientname', validators = [Required()])
    clienttype = TextField('clienttype')
    clientinterface=TextField('clientinterface')
    telephone = TextField('telephone')
    phone= TextField('phone')
    group=TextField('group')
    comment = TextAreaField('comment')
    
class ClearForm():
    clientname = ''
    clienttype = ''
    clientinterface=''
    telephone = ''
    phone= ''
    group=''
    comment = ''
    
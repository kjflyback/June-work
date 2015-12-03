from flask import render_template, flash, redirect
from . import app
from forms import LoginForm

@app.route('/login', methods = ['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        flash('Login requested for OpenID="' + form.openid.data + '", remember_me=' + str(form.remember_me.data))
        return redirect('/index')
    return render_template('login.html',
        title = 'Sign In',
        form = form,
        providers = app.config['OPENID_PROVIDERS']
        )

@app.route('/')
@app.route('/index')
def index():
    # print "begin index"
    user = {'nickname': 'June'}
    posts = [
             {
              'author': {'nickname':'John'},
              'body' : 'Beatiful day in Portland!'
              },
             {
              'author': {'nickname':'Susan'},
              'body': 'The Avengers movie was so cool!'
              }
             ]
    # print posts
    ret = render_template('index.html',
                           title='Home',
                           user=user,
                           posts=posts
                           )
    # print ret
    return ret 

@app.route('/data')
def data_b():
    return repr([1,2,3,4,5,6,7,8,9,10])

@app.route('/user')
def user():
    return render_template('user.html', name="June")

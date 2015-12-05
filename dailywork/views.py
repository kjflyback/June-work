from flask import render_template, flash, redirect
from . import app, db, models
from forms import LoginForm, PostForm
# from models import Client, ClientType, ClientInterface, Group
from qdata import QueryData

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
@app.route('/data/<command>', methods=['GET', 'POST'])
def data_b(command):
    print command
    return QueryData(command)


def convertString(obj):
    retobj = obj
    for objone in retobj[:]:
        for field in objone[:]:
            field = field.encode('utf-8')
            print field  
    return retobj 
 
def getPage(pageindex, itemprepage):
    pagequery = db.session.query(
                         models.WorkFlow.timestamp,
                         models.Client.name,  
                         models.ClientType.desc,                           
                         models.ClientInterface.name,
                         models.WorkFlow.telephone, 
                         models.WorkFlow.phonenumber,
                         models.Group.name,
                         models.WorkFlow.comment
                         ).filter(
                          models.Client.id == models.WorkFlow.client_id, 
                          models.ClientType.id == models.WorkFlow.type_id,
                          models.Group.id == models.WorkFlow.group_id,
                          models.ClientInterface.id == models.WorkFlow.interface_id
                          )
                         
    itemcount = pagequery.count()
    pagedata = pagequery.slice(pageindex * itemprepage, (pageindex + 1) * itemprepage)
    return {'total':itemcount, 'data':pagedata}

@app.route('/user', methods=['GET', 'POST'])
@app.route('/user/<int:page>', methods=['GET', 'POST'])
def user(page = 0):
    ITEMPREPAGE = 6
    
    # print convertString(pagedata)
    form = PostForm() 
    # flash("data:clientname:" + str(form.clientname.data) +
      #    "\nclienttype:" +str(form.clienttype.data) +
       #   "\n") 
    if form.validate_on_submit():  
        # flash("validate ok.")
        # save first clienttype 
        # if form.clienttype.data:
            # get ctype from db
        ctype = None
        if form.clienttype.data:
            ctype = models.ClientType.query.filter(models.ClientType.desc == form.clienttype.data).first()
            if None == ctype:            
                ctype = models.ClientType(desc = form.clienttype.data)     
                db.session.add(ctype) 
                db.session.commit()
        else:
            defaultctype = models.ClientType()
            ctype = models.ClientType.query.filter(models.ClientType.desc == defaultctype.desc).first()
            if None == ctype:
                ctype = defaultctype
                db.session.add(ctype)
                db.session.commit()

                
        # if form.clientinterface.data:
            # 
        cinterface = None
        if form.clientinterface.data:
            cinterface = models.ClientInterface.query.filter(
                    models.ClientInterface.name == form.clientinterface.data
                    ).first()        
            if None == cinterface :
                cinterface = models.ClientInterface(name = form.clientinterface.data)
                db.session.add(cinterface)
                db.session.commit()
                
            
       
        # if form.group.data:
            #
        group = models.Group.query.filter(
                models.Group.name == form.group.data
                                          ).first()     
            
        if None == group:
            group = models.Group()
            if form.group.data:
                group.name=form.group.data
            db.session.add(group)
            db.session.commit()
                
        client = models.Client.query.filter(models.Client.name == form.clientname.data).first()
            
        if None == client:
            client = models.Client(
                    name=form.clientname.data,
                    group_id= group.id
                    )
       
            db.session.add(client)
            db.session.commit()
        
         
        # save workflow
        workflow = models.WorkFlow(
                client_id = client.id,
                group_id = group.id,
                interface_id = cinterface.id,
                type_id = ctype.id,
                telephone = form.telephone.data,
                phonenumber = form.phone.data,
                comment = form.comment.data
                                   )
        db.session.add(workflow)
        db.session.commit()
        pageinfo = getPage(page, ITEMPREPAGE)
        return render_template('user.html',
                               form=form, 
                               page = pageinfo['data'], 
                               counter = pageinfo['total'], 
                               current = page,
                               pagecount = pageinfo['total']/ITEMPREPAGE,
                               needclear = True)
    #else:
     #   flash("validate failed.")
        
    pageinfo = getPage(page, ITEMPREPAGE)
    return render_template('user.html', 
                           form = form, 
                           page = pageinfo['data'], 
                           counter = pageinfo['total'], 
                           current=page,
                           pagecount = pageinfo['total']/ITEMPREPAGE,
                           needclear = True)
    
    # return ''
    
    
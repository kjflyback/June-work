from . import db
from models import Client, ClientType, ClientInterface, Group, WorkFlow

def JsonFrom(obj):
    ret = []
    for o in obj:
        ret.append(o[0])
        
    return '["'+ '","'.join(ret) + '"]'

def QueryDataForClient():
    return JsonFrom(db.session.query(Client.name))
    
def QueryDataForGroup(): 
    return JsonFrom(db.session.query(Group.name))

def QueryDataForClientType():
    return JsonFrom(db.session.query(ClientType.desc))

def QueryDataForClientInterface():
    return JsonFrom(db.session.query(ClientInterface.name))  

def QueryDataForPhone():
    return JsonFrom(db.session.query(WorkFlow.phonenumber))

def QueryDataForTelephone():
    return JsonFrom(db.session.query(WorkFlow.telephone))

SwitchOperator = {
                  'client':QueryDataForClient,
                  'group':QueryDataForGroup,
                  'type':QueryDataForClientType,
                  'interface':QueryDataForClientType,
                  'phone':QueryDataForPhone,
                  'tel':QueryDataForTelephone
                  }

def QueryData(command):
    return SwitchOperator.get(command)()
    
from . import db
from models import Client, ClientType, ClientInterface, Group, WorkFlow
import json

def JsonFrom(obj):
    ret = []
    for o in obj:
        hasObj = True
        if len(o._fields) > 1:
            ret += [o]
        else:
            ret += o[0] 
        
    return json.dumps(ret)

def QueryDataForClient():
    return JsonFrom(db.session.query(
                                     Client.name, 
                                     WorkFlow.comment
                                     ).order_by(WorkFlow.timestamp.desc()).filter(
                                              Client.id == WorkFlow.client_id
                                    ).distinct())
    # return JsonFrom(db.session.query(Client.name))
    
def QueryDataForGroup(): 
    return JsonFrom(db.session.query(Group.name))

def QueryDataForClientType():
    return JsonFrom(db.session.query(ClientType.desc))

def QueryDataForClientInterface():
    return JsonFrom(db.session.query(ClientInterface.name))  

def QueryDataForPhone():
    return JsonFrom(db.session.query(WorkFlow.phonenumber).distinct())

def QueryDataForTelephone():
    return JsonFrom(db.session.query(WorkFlow.telephone).distinct())

SwitchOperator = {
                  'client':QueryDataForClient,
                  'group':QueryDataForGroup,
                  'type':QueryDataForClientType,
                  'interface':QueryDataForClientInterface,
                  'phone':QueryDataForPhone,
                  'tel':QueryDataForTelephone
                  }

def QueryData(command):
    return SwitchOperator.get(command)()
    
from flask import Flask, render_template
from flask_cors import cross_origin
import requests

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/login')
@cross_origin()
def login_page():
    return render_template('login.html')


@app.route('/auth')
def auth():
    return render_template('auth.html')


@app.route('/adb2c-users')
@cross_origin()
def getadb2cusers():
    return render_template('user_management.html')


@app.route('/chat/<name>')
@app.route('/chat')
@app.route('/chat/<name>/<group>',
           defaults={'name': None, 'group': None})
@app.route('/chat/<name>/<group>')
def messaging(name=None, group=None):
    # Testing Chat Thread -
    # 19:D9A9Rc-ulwpZRzdSXu-RWcXIUmW-XYO9Bj8JdGLY4V41@thread.v2
    print(name)
    intPersonID = 60366
    the_thread = '19:vEI4TBph38xJQrdNhZhxEjjOmEXGNCGDnWAu6dJJAQ01@thread.v2'

    if name is not None and name.lower() == 'adam':
        intPersonID = 2
        name = 'Adam'
    else:
        name = 'Erwin'

    if group is not None:
        the_thread = group

    my_req_headers = {'Content-type': 'application/json'}

    # create or renew access token - http://localhost:7071/api/request-access-token
    # https://acs-chat-fnc.azurewebsites.net/api/request-access-token?code'
    #                                  '=dh2XYqzWMseCwFxxjVWHdy/h6p2kT4GevWIBW9XJWzK7yalBNwtq0A==
    fnx_response = requests.post('http://localhost:7071/api/request-access-token',
                                 json={'intPersonID': intPersonID}, headers=my_req_headers)

    print(fnx_response.content)
    print(fnx_response.text)
    print(fnx_response.json())
    print(fnx_response.headers)

    respDictionary = fnx_response.json()
    # print(type(fnx_response))

    return render_template("messaging.html",
                           accessToken=respDictionary['accessToken']['token'],
                           communicationUserId=respDictionary['identity']['id'],
                           communicationUserName=name,
                           threadId=the_thread,
                           intConversationUserID=intPersonID,
                           accessexpiry=respDictionary['accessToken']['expiresOn']
                           )


if __name__ == '__main__':
    app.run()

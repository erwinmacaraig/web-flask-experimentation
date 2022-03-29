from flask import Flask, render_template, redirect, url_for
from flask_cors import CORS, cross_origin



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


if __name__ == '__main__':
    app.run()

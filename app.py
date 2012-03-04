#-*-coding:utf-8-*-
from flask import Flask, request, redirect, session, send_file, render_template
from weibopy.api import API
from weibopy.auth import OAuthHandler
from config import *
from bot import *
import time

app = Flask(__name__)
app.debug = True
app.secret_key = 's02we1b0'

robot = Bot()

def addFavorite(status_id):
    auth = OAuthHandler(APP_KEY, APP_SECRET)
    # Get currrent user access token from session
    access_token = session['oauth_access_token']
    auth.setToken(access_token.key, access_token.secret)
    api = API(auth)
    api.create_favorite(status_id)

@app.route('/')
def hello():
    return render_template("index.html")

@app.route('/t')
def bookmarklet():
    return render_template("bookmarklet.html")

@app.route('/login')
def login():
    callback = 'http://so2weibo.sinaapp.com/login_callback'

    auth = OAuthHandler(APP_KEY, APP_SECRET, callback)
    # Get request token and login url from the provider
    url = auth.get_authorization_url()
    session['oauth_request_token'] = auth.request_token
    # Redirect user to login
    return redirect(url)

@app.route('/login_callback')
def login_callback():
    # This is called by the provider when user has granted permission to your app
    verifier = request.args.get('oauth_verifier', None)
    auth = OAuthHandler(APP_KEY, APP_SECRET)
    request_token = session['oauth_request_token']
    del session['oauth_request_token']
    
    # Show the provider it's us really
    auth.set_request_token(request_token.key, request_token.secret)
    # Ask for a temporary access token
    session['oauth_access_token'] = auth.get_access_token(verifier)
    return render_template("login_callback.html")

@app.route('/logout')
def logout():
    del session['oauth_access_token']
    return redirect("/")

@app.route("/save")
def save():
    link = request.args.get("link", "")
    if not link:
        return "no link"
    title = request.args.get("title", "")

    if 'oauth_access_token' not in session:
        return_file_name = "not_login.gif"
    else:
        try:
            # 机器人发布微博
            msg = "%s%s%s" % (title, " " if title else "", link)
            status = robot.send(msg)
            time.sleep(5)
            addFavorite(status.id)
            return_file_name = "ok.gif"
        except:
            return_file_name = "error.gif"
    return send_file("static/" + return_file_name, mimetype='image/gif')

#-*-coding:utf-8-*-
from config import *
from weibopy.auth import OAuthHandler
from weibopy.api import API
from weibopy.error import WeibopError

class Bot:
    def __init__(self):
        BACK_URL = ""
        #验证开发者密钥.
        auth = OAuthHandler( APP_KEY, APP_SECRET, BACK_URL )
        auth.setToken( BOT_TOKEN_KEY, BOT_TOKEN_SECRET )
        self.api = API(auth)

    def send(self, message):
        try:
            return self.api.update_status(message)
        except WeibopError, e:
            return self.api.user_timeline(count=1)[0]
            


if __name__ == "__main__":
    bot = Bot()
    try:
        s = bot.send("Hello World")
        print s
    except:
        print "error"

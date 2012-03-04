!function() {
    // 提示用的对话框  
    function Dialog(){
        this.createMainDiv();
        this.createContentDiv();
    }
    Dialog.prototype = {
        createMainDiv: function(){
            var div = document.createElement("div");
            div.style.position = "fixed";
            div.style.top = "10px";
            div.style.left = "10px";
            div.style.border = "#000 2px solid";
            div.style.backgroundColor = "#fff";
            div.style.zIndex = "99999";
            document.body.appendChild(div);
            div.innerHTML = this.getBaseHTML();
            this.main_div = div;
        },
        getBaseHTML: function(){
            var html = [];
            html.push('<div style="width:250px;height:150px">');
            html.push('    <h4 style="margin:10px auto;text-align:center">\u6536\u85CF\u5230\u5FAE\u535A</h4>');
            html.push('    <hr></hr>');
            html.push('</div>');
            return html.join("");
        },
        createContentDiv: function(){
            var content_div = document.createElement("div");
            content_div.style.fontSize = "16pt";
            content_div.style.marginTop = "30px";
            content_div.style.marginLeft = "70px";
            this.main_div.getElementsByTagName("div")[0].appendChild(content_div);
            this.content_div = content_div;
        },
        showLoginLink: function(){
            var me = this;
            var a = document.createElement("a");
            a.href = "http://so2weibo.sinaapp.com/login";
            a.target = "_blank";
            a.innerHTML = "\u8BF7\u5148\u767B\u5F55";
            a.onclick = function(){me.close()};
            this.content_div.innerHTML = "";
            this.content_div.appendChild(a);
        },
        showSuccessInfo: function(){
            this.content_div.innerHTML = "\u6536\u85CF\u6210\u529F!";
        },
        showFailInfo: function(){
            this.content_div.innerHTML = "\u6536\u85CF\u5931\u8D25!";
        },
        showLoadingImage: function(){
            this.content_div.innerHTML = '<img src="http://so2weibo.sinaapp.com/static/loading2.gif" style="margin-left: 10px" />';
        },
        close: function(){
            var me = this;
            setTimeout(function(){
                me.main_div.parentNode.removeChild(me.main_div);
                me.content_div = null;
                me.main_div = null;
            }, 1000);
        }
    };

    var App = {
        request: function() {
            this.dialog = new Dialog();
            this.dialog.showLoadingImage();
            
            var img = document.createElement("img");
            img.src = "http://so2weibo.sinaapp.com/save?" + 
                "link=" + encodeURIComponent(location.href) + 
                "&title=" + encodeURIComponent(document.title) + 
                "&rand=" + (new Date).getTime();
            this.checkImage(img);

            img.style.visibility = "hidden";
            document.body.appendChild(img);
        },
        checkImage: function(img) {
            var me = this,
                interval = setInterval(function() {
                    if (img.complete) {
                        clearInterval(interval);
                        var width = parseInt(img.width, 10);
                        img.parentNode.removeChild(img);
                        me.onResponse(width);
                    }
                }, 250);
        },
        onResponse: function(type) {
            switch(type){
                case 1:
                    // 成功！
                    this.dialog.showSuccessInfo();
                    this.dialog.close();
                    break;
                case 2:
                    // 发布或收藏出错
                    this.dialog.showFailInfo();
                    this.dialog.close();
                    break;
                case 3:
                    // 没有登录，打开登录页面
                    this.dialog.showLoginLink();
                    break;
                default:
                    alert("unknown error");
                    this.dialog.close();
            }
        }
    };
    App.request();
}();

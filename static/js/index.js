$(function(){
    // 开始时渲染一下，并且开始时的input框也是disabled状态。
    $("#xmlrpcAddress").val(localStorage.getItem("rpcAddress"));
    $("#uploadPath").val(localStorage.getItem("uploadPath"));
    $("#username").val(localStorage.getItem("username"));
    $("#password").val(localStorage.getItem("password"));
    inputDisabled(true);
    
    // 编辑配置信息
    $("#edit").click(function(){
        inputDisabled(false);
    });

    // 保存配置信息
    $("#save").click(function(){
        // 首先禁用输入框
        inputDisabled(true);
        // 然后保存配置内容到 => localStorage
        localStorage.setItem("rpcAddress", $("#xmlrpcAddress").val());
        localStorage.setItem("uploadPath", $("#uploadPath").val());
        localStorage.setItem("username", $("#username").val());
        localStorage.setItem("password", $("#password").val());
    });
    
    // 输入框输入事件
    $("#uploadFile").change(function(){
        loadMarkdown();
    });


    //上传文章
    $("#uploadBtn").click(function() {
        var filename = localStorage.getItem("filename");
        var filepath = localStorage.getItem("filepath");
        var filestring = localStorage.getItem("filestring");
        uploadMarkdown(filename, filestring);  //上传文章内容
    });

});

function inputDisabled(isAble) {
    // 禁用输入框
    $("#xmlrpcAddress").attr("disabled", isAble);
    $("#uploadPath").attr("disabled", isAble);
    $("#username").attr("disabled", isAble);
    $("#password").attr("disabled", isAble);
}

// 文件上传功能
function uploadMarkdown(markdown_title, markdown_text) {
    var rpcAddress = localStorage.getItem("rpcAddress");
    var uploadPath = localStorage.getItem("uploadPath");
    var username = localStorage.getItem("username");
    var password = localStorage.getItem("password");
    var publish = true;

    var payload = `<methodCall>
        <methodName>metaWeblog.newPost</methodName>
        <params>
            <param>
                <name>blog_id</name>
                <value>
                    <int>1</int>
                </value>
            </param>
            <param>
                <name>username</name>
                <value>
                    <string>${username}</string>
                </value>
            </param>
            <param>
                <name>password</name>
                <value>
                    <string>${password}</string>
                </value>
            </param>
            <param>
                <name>content</name>
                <value>
                    <struct>
                        <param>
                            <name>post_type</name>
                            <value>
                                <string>post</string>
                            </value>
                        </param>
                        <param>
                            <name>title</name>
                            <value>
                                <string>${markdown_title}</string>
                            </value>
                        </param>
                        <param>
                            <name>description</name>
                            <value>
                                <string>${markdown_text}</string>
                            </value>
                        </param>
                    </struct>
                </value>
            </param>
            <param>
                <name>publish</name>
                <value>
                    <boolean>${publish}</boolean>
                </value>
            </param>
        </params>
    </methodCall>`;
    
    $.post(rpcAddress, payload, function(responseXML){
        var data = new Array();
        var members = $(responseXML).find("member");
        for(i=0; i<members.length; i++) {
            var member = members[i];
            var name = $(member).find("name").text();
            var value = $(member).find("value").text();
            data[name] = value;
        }
        console.log(data);
    });

}

function loadMarkdown() {
    var Files = $("#uploadFile").prop('files');  // 获取到文件列表
    var File = Files[0];
    var filename = File.name.substring(0, File.name.lastIndexOf("."));
    var filepath = File.path.substring(0, File.path.lastIndexOf("\\"));

    console.log(filename, filepath);
    //新建一个FileReader
    var reader = new FileReader();
    reader.readAsText(File, "UTF-8");  // 读取文件
    reader.onload = function(evt) {  // 读取完文件之后会回来这里
        var filestring = evt.target.result;  // 读取文件内容
        // 将读取的内容存储到localStorage中, 虽然localStorage的存储容量不大，但是用来存储一篇文章倒是应该够用了。
        localStorage.setItem("filename", filename);
        localStorage.setItem("filepath", filepath);
        localStorage.setItem("filestring", filestring);
    }

    var max = File.size;
    reader.onprogress = function (evt) {   // 读取进度条
        $(".progress-bar").width(evt.loaded / max*100 + '%');
        $(".progress-bar").text(evt.loaded / max*100 + '%');
    }
}
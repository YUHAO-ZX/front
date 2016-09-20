Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
$(document).ready(function(){
    alert(md5("dsfsdfsd"))

    getScriptList();
});
var list1 = '{"action":"","code":0,"data":[{"scriptId":"ttt1","scriptName":"name1"},{"scriptId":"ttt2","scriptName":"name2"}],"message":""}';
var cache    = '{"action":"","code":0,"data":{"10.0.228.33:9001":"{\\"code\\":0,\\"msg\\":\\"runtime exception\\"}"},"message":""}';


//scriptList
//searchScript
//addNew
//codeArea
//scriptExec
//scriptModify
//resultArea
//scriptName
function searchScript(){
    var scriptId = $("#scriptList").val();
    if(null == scriptId || scriptId == ""){
        alert("请选中脚本");
        return;
    }
    alert(scriptId)
    $("#codeArea").html(scriptId);
}
function addNew(){

}

function scriptExec(){

}

function scriptModify(){

}
function scriptSave(){
    alert($("#codeArea").val());

    $('#myModal').modal('hide');
}
function getScriptList(){

    var data = jQuery.parseJSON(list1)
    var code = data.code
    if(code === 0){
        var data1 = data.data;
        if(data1==null){
            return;
        }
        var size = data1.length;
        var html = "";
        for(var i = 0;i<size;i++){
            var scriptInfo = data1[i];
            html += "<option value='"+scriptInfo.scriptId+"'>"+scriptInfo.scriptName+"</option>";
        }
        $("#scriptList").html(html);
        $("#scriptList").change(searchScript);
    }else{
        alert("fail "+data.message)
    }
}



function getServices(){
    var data = jQuery.parseJSON(services)
    var code = data.code
    if(code === 0){
        var data1 = data.data;
        if(data1==null){
            alert("无数据");
            return;
        }
        var size = data1.length;
        var html = "";
        for(var i = 0;i<size;i++){
            var ipAndPort = data1[i];
            html += "<label><input name='ipAndPort' style='width:15px;' type='checkbox' value='"+ipAndPort+"' />"+ipAndPort.split(":")[0]+"</label>";
            if((i+1) % 8 == 0){
                html+="<br>"
            }
        }
        $("#serviceList").html(html);
        $("#serviceList").on("change",searchScript());
    }else{
        alert("fail "+data.message)
    }
}

function getCache(){


    var chk_value =[];
    $('input[name="ipAndPort"]:checked').each(function(){
        chk_value.push($(this).val());
    });
    if(chk_value.length==0){
        alert('你还没有选择任何内容！');
        return;
    }

    var ipList = JSON.stringify(chk_value)
    var cacheName = $("#cacheName").val();
    var cacheKey = $("#cacheKey").val();
    if(ipList==''){
        alert("请选择ip")
        return;
    }

    if(cacheName==''){
        alert("请填写缓存名称")
        return;
    }

    if(cacheKey==''){
        alert("请填写缓存key")
        return;
    }

    var data = jQuery.parseJSON(cache)
    var code = data.code;
    if(code === 0){
        var map = data.data;
        if(map==null){
            alert("无数据");
            return;
        }
        var innerHtml = "";
        for(var key in map){
            var dt = jQuery.parseJSON(map[key]);
            var value = dt.data;
            if(undefined == value || value == null){
                value="";
            }
            var more = value;
            if(value.length>50){
                more = "<a href='javascript:void(0)' data-toggle=\"modal\" onclick=modal1("+JSON.stringify(value)+")>"+value.substr(0,50)+".....</a>";
            }
            var msg = (dt.msg == null || dt.msg == undefined || dt.msg.trim().length == 0)?"get success":dt.msg;
            innerHtml += '<tr class=\"heading\"> ' ;
            innerHtml +='<td width="5%">'+
                key.split(":")[0]
                +'</td>';
            innerHtml +='<td width="30%">'+
                cacheName+"."+cacheKey
                +'</td>';
            innerHtml +='<td width="30%">'+
                more
                +'</td>' ;
            innerHtml +="<td width='15%' statusTag="+key.split(":")[0]+">"+
                msg
                +'</td></tr>';
        }
        $("#cacheBody").html(innerHtml);
    }else{
        alert("fail "+data.message)
    }



}

function modal1(valueD){

    $("#cacheValue").html(valueD);
    $('#myModal').modal('show');
}


function checkAll(){
    var check = $("#listAll").prop("checked");
    if(check == true){
        $("input[name='ipAndPort']").prop("checked",true);
    }else{
        $("input[name='ipAndPort']").prop("checked",false);
    }

}
function statistics(){
    var chk_value =[];
    $('input[name="ipAndPort"]:checked').each(function(){
        chk_value.push($(this).val());
    });
    if(chk_value.length==0){
        alert('你还没有选择任何内容！');
        return;
    }

    var ipList = JSON.stringify(chk_value)
    var cacheName = $("#cacheNamest").val();

    if(ipList==''){
        alert("请选择ip")
        return;
    }
    if(cacheName==''){
        alert("请填写缓存名称")
        return;
    }
    $.ajax({
        url:"http://livest.jumei.com/show/views/link/statistics",
        type:"post",
        data:{"ipList":ipList,"cacheName":cacheName},
        success:function(data){
            var code = data.code;
            if(code === 0){
                var map = data.data;
                if(map==null){
                    alert("无数据");
                    return;
                }
                var innerHtml = "";
                for(var key in map){
                    var dt = jQuery.parseJSON(map[key]);
                    var value = dt.data;
                    if(undefined == value || value == null){
                        value="";
                    }
                    innerHtml +='<tr class=\"heading\">';
                    innerHtml +='<td width="5%">'+
                    key.split(":")[0]
                    +'</td>';
                    innerHtml +='<td width="30%">'+
                    cacheName
                    +'</td>';
                    innerHtml +='<td width="30%">'+
                    JSON.stringify(value)
                    +'</td>' ;
                    innerHtml +="<td width='15%' statusTag="+key+">"
                    +'</td></tr>';
                }
                $("#cacheBody").html(innerHtml);
            }else{
                alert("fail "+data.message)
            }
        },
        error:function(){
            alert("请求失败！");
        }
    });
}
function checkAllList(){
    var check = $("#listAll1").prop("checked");
    if(check == true){
        $("input[name='OPipAndPort']").prop("checked",true);
    }else{
        $("input[name='OPipAndPort']").prop("checked",false);
    }
}
function cleanCache(){
    var chk_value =[];
    $('input[name="ipAndPort"]:checked').each(function(){
        chk_value.push($(this).val());
    });
    if(chk_value.length==0){
        alert('请在列表中勾选需要清除的ip！');
        return;
    }
    var ipList = JSON.stringify(chk_value)
    var cacheName = $("#cacheName").val();
    var cacheKey = $("#cacheKey").val();
    if(ipList==''){
        alert("请在列表中勾选需要清除的ip")
        return;
    }
    if(cacheName==''){
        alert("请填写缓存名称")
        return;
    }
    if(cacheKey==''){
        alert("请填写缓存key")
        return;
    }
    $.ajax({
        url:"http://livest.jumei.com/show/views/link/cleanCache",
        type:"post",
        data:{"ipList":ipList,"cacheName":cacheName,"key":cacheKey},
        success:function(data){
            var code = data.code;
            if(code === 0){
                var map = data.data;
                if(map==null){
                    alert("无数据");
                    return;
                }
                for(var key in map){
                    var value = map[key];
                    var rtData = jQuery.parseJSON(value);
                    console.info("rtData.msg:"+rtData.msg.length)
                    $("td[statusTag='"+key.split(":")[0]+"']").html((rtData.msg == null || rtData.msg == undefined || rtData.msg.trim().length == 0)?"clean success":rtData.msg);
                }
                alert("clean success")
            }else{
                alert("fail "+data.message)
            }
        },
        error:function(){
            alert("请求失败！");
        }
    });

}


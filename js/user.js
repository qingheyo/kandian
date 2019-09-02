$(function() {
    showMsg();



//展示所有信息
    function showMsg() {
        var str = '';
        $.ajax({
            method: 'GET',
            url: 'http://134.175.154.93:8099/manager/user/findAllUser',
            success: function(res) {
                var res = res.data;
                var res = res.slice(0, 6);
                $(res).each(function(index, item) {

                    str =
                        ` <div class="col-xs-10 col-xs-offset-2 userbox">
                      <img src="${item.userface}" alt="" height:100px; width:100px>
                      <span>用户名:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${item.username}</span></br>
                      <span>真实姓名:&nbsp;&nbsp;&nbsp;${item.nickname}</span></br>
                      <span>注册时间:&nbsp;&nbsp;&nbsp;${item.regTime}</span></br>
                      <span>email:&nbsp;&nbsp;&nbsp;${item.email}</span></br>
                      <span >状态:</span>
                      <div class="navbox">
                      <input type="checkbox" class="navinput" name="nav" data-id="${item.id}"/>     
                      </div>     
                  </div>`
                  $('.usershow').append(str);
                  $("[name='nav']:last").bootstrapSwitch({
                    onText: "开启",
                    offText: "关闭",
                    size:"mini", 
                }).bootstrapSwitch('state',item.enabled);
                });

                


            },
            error: function(error) {
                console.log("加载失败")
            }
        })

    };

    //新增用户
    $('.adduser').click(function() {
        $('#usermodal').modal('show');
        var myDate = new Date();
        var year = myDate.getFullYear(); //获取当前年
        var month = myDate.getMonth() + 1; //获取当前月
        var date = myDate.getDate(); //获取当前日
        var h = myDate.getHours(); //获取当前小时数(0-23)
        var m = myDate.getMinutes(); //获取当前分钟数(0-59)
        var s = myDate.getSeconds();
        var now = year + '-' + month + "-" + date + " " + h + ':' + m + ":" + s;
        var pattern = /^([1-9]|[a-z]|[A-Z]){3,9}@[a-z]{2,5}.[a-z]{2,5}$/g;
        var regTime = now;
        $('.usersend').click(function() {
            var username = $('#name1').val();
            var password1 = $('#name2').val();
            var password2 = $('#name3').val();
            var nickname = $('#name4').val();
            var email = $('#name5').val();
            if (password1 !== password2 && !pattern.test(email)) {
                alert('确认密码错误\n邮箱格式不正确')
            } else if (password1 !== password2) {
                alert('确认密码错误');
            } else if (!pattern.test(email)) {
                alert('邮箱格式不正确');
            } else {
                $.ajax({
                    method: 'POST',
                    url: 'http://134.175.154.93:8099/manager/user/saveOrUpdateUser',
                    data: {
                        nickname: nickname,
                        username: username,
                        password: password1,
                        email: email,
                        userface: 'http://47.102.112.158/workspace/19.png',
                        regTime: regTime
                    },
                    success: function(res) {
                        console.log('保存成功');  
                        showMsg();
                    },
                    error: function(error) {
                        console.log(error);
                    }
                })
                $('#usermodal').modal('hide');

            }


        })


    })
//切换用户状态
$('.usershow').on('switchChange.bootstrapSwitch','.navinput',function(event,state){
console.log(state);
var id=$(this).attr('data-id');
console.log(id);      
$.ajax({
    method:'post',
    url:'http://134.175.154.93:8099/manager/user/changeStatus',
    data:{
        id:id,
        status:state,
    },
    success:function(res){
     
    },
    error:function(error){
        console.log(error);
    
    }
                })
            
});





});
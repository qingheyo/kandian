$(function() {

    showOption();
    categoryChange();

    //下拉菜单 获取所有栏目信息
    function showOption() {
        var str = '';
        $.ajax({
            method: 'GET',
            url: 'http://134.175.154.93:8099/index/findAllCategory',
            success: function(res) {
                var res = res.data;
                firstid = res[0].id;
                showMsg(firstid);
                $(res).each(function(index, item) {
                    str +=
                        `<option value="${item.id}">${item.name}</option>`
                });
                $('#zixun-option').html(str);
                $('#zixuncategroy').html(str);
            },
            error: function(error) {
                console.log("加载失败")
            }
        })
    };

    //展示每个栏目下的文章
    function showMsg(id) {
        var str2 = ` <ul>
  <li>编号</li>
  <li>文章标题</li>
  <li>所属栏目</li>
  <li>排列方式</li>
  <li>作者</li>
  <li>发布时间</li>
  <li>阅读次数</li>
  <li>操作</li>
</ul>`;
        $.ajax({
            method: 'GET',
            url: 'http://134.175.154.93:8099/index/findArticleByCategoryId?categoryId=' + id,
            success: function(res) {
                var res = res.data;
                $(res).each(function(index, item) {
                    str2 += `   <ul>
                        <li><input type="checkbox" data-content='${item.content}'data-id='${item.id}'></li>
                        <li>${item.title}</li>
                        <li>${item.category.name}</li>
                        <li>${item.liststyle}</li>
                        <li>${item.author}</li>
                        <li>${item.publishtime}</li>
                        <li>${item.readtimes}</li>
                        <li> <button class="btn btn-success zixun-li-btn zixun-change data-id="${item.id}">修改</button>
                        <button class="btn btn-danger zixun-li-btn zixun-del" data-id="${item.id}">删除</button></li>
                    </ul>`
                });
                $('.zixunshow').html(str2);
            },
            error: function(error) {
                console.log("加载失败")
            }
        })








    };


    //change监听栏目的切换 然后展示切换栏目下的文章
    function categoryChange() {
        $('#zixun-option').change(function() {
            var id = $(this).val();
            showMsg(id);
        })
    };

    //新增文章
    $('.zixun-add').click(function() {

        $('#zixunadd').modal('show');
        $('#zixuntitle').val('');
        $('[name=oneonethree]').prop('checked', false);
        $('#zixunzhengwen').val('');
        $('.zixunsend').click(function() {
            var name = $('#zixuntitle').val();
            var liststyle = $('[name=oneonethree]:checked').val();
            var categoryId = $('#zixuncategroy').val();
            var content = $('#zixunzhengwen').val();
            var firstid = $('#zixun-option').val();
            console.log(name, liststyle, categoryId, content)
            $.ajax({
                method: 'POST',
                url: 'http://134.175.154.93:8099/manager/article/saveOrUpdateArticle',
                data: {
                    title: name,
                    liststyle: liststyle,
                    categoryId: categoryId,
                    content: content
                },
                success: function(res) {
                    showMsg(firstid);
                    console.log('保存成功');
                },
                error: function(error) {
                    console.log(error);
                }
            })
            $('#zixunadd').modal('hide');
        })
    });

    //修改文章
    $('.zixunshow').on('click', '.zixun-change', function(event) {
        $('#zixunchange').modal('show');
        var firstid = $('#zixun-option').val();
        showMsg(firstid);
        var $event = $(this).parent().parent();
        var id = $event.children().eq(0).children().attr('data-id');
        var title = $event.children().eq(1).html();
        var category = $event.children().eq(2).html();
        var liststyle = $event.children().eq(3).html();
        // var content = $event.children().eq(0).children().attr('data-content');
        console.log(firstid, id, title, category, liststyle);
        $('#zixuntitle1').val(title);
        $('#zixuncategroy1').val(category);
        $("[name=oneonethree][value=" + liststyle + "]").attr('checked', true);
        // $('#zixunzhengwen1').val(content);
        $('.zixunsend1').click(function() {
            var title = $('#zixuntitle1').val();
            var category = $('#zixuncategroy1').val();
            var liststyle = $('[name=oneonethree]:checked').val();
            // var content = $('#zixunzhengwen1').val();
            $.ajax({
                method: 'POST',
                url: 'http://134.175.154.93:8099/manager/article/saveOrUpdateArticle',
                data: {
                    id: id,
                    title: title,
                    category: category,
                    categoryId: firstid,
                    liststyle: liststyle,
                    // content: content
                },
                success: function(res) {
                    console.log('修改成功');
                    showMsg(firstid);
                },
                error: function(error) {
                    console.log('提交失败');
                }
            });
            $('#zixunchange').modal('hide');
        });

    });

    //单个删除

    $('.zixunshow').on('click', '.zixun-del', function(event) {
        var firstid = $('#zixun-option').val();
        var $event = $(this).parent().parent();
        var id = $event.children().eq(0).children().attr('data-id');
        $.ajax({
            method: 'GET',
            url: 'http://134.175.154.93:8099/manager/article/deleteArticleById?id=' + id,
            success: function(res) {
                console.log('删除成功');
                showMsg(firstid);
            },
            error: function(error) {
                console.log(error);
            }
        })

    });




    //批量删除

    $('.zixun-batchdel').click(function() {
        var firstid = $('#zixun-option').val();
        console.log(firstid);
        showMsg(firstid);
        var ids = $(':checkbox:checked').map(function(index, item) {
            return $(item).attr('data-id');
        }).get();
        console.log(ids)
        var ids = ids.toString();

        $.ajax({
            method: 'post',
            url: 'http://134.175.154.93:8099/manager/article/batchDeleteArticle',
            data: { ids: ids },

            success: function(res) {
                console.log('删除成功');
                showMsg(firstid);
            },
            error: function(error) {
                console.log(error);
            }
        })
    });


})
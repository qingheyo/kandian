$(function() {

    showMsg();

    function showMsg() {
        var str = '';
        var str2 = '';
        $.ajax({
            method: 'GET',
            url: 'http://134.175.154.93:8099/manager/category/findAllCategory',
            dataType: 'json',
            success: function(res) {
                var res = res.data;
                var res=res.slice(0,6);
                $(res).each(function(index, item) {
                    if (item.parent) {
                        var parent = item.parent.name;
                    } else {
                        parent = '-';
                    }
                    str += ` 
                            <ul class="lanmu-ul">
                            <li><input type="checkbox" data-id='${item.id}'></li>
                            <li>${item.name}</li>
                            <li>${parent}</li>
                            <li>${item.comment}</li>
                            <li>
                                <button class="btn btn-success lanmu-li-btn change data-id="${item.id}">修改</button>
                                <button class="btn btn-danger lanmu-li-btn del" data-id="${item.id}">删除</button>
                            </li>
                        </ul>`

                    str2 += `<option value="${item.name}">${item.name}</option>`
                })
                $('.myshow').html(str);
                $('#parent1').html(str2);

            },
            error: function(error) {
                console.log(error);
            }
        })
    }

    // 新增数据
    // 提交并刷新数据
    $('.add').click(function() {
        $('#modal').modal('show');
        $('.tijiao').click(function() {
            var name = $('#name1').val();
            var comment = $('#comment1').val();
            var parent = $('#parent1').val();

            $.ajax({
                method: 'POST',
                url: 'http://134.175.154.93:8099/manager/category/saveOrUpdateCategory',
                data: {
                    name: name,
                    comment: comment,
                    parent: { name: parent },
                    no: 1
                },

                success: function(res) {
                    console.log('提交成功');
                    showMsg();
                },
                error: function(error) {
                    console.log(error);
                }
            })

            $('#modal').modal('hide');
        })


    });



    //删除单个元素
    $('.myshow').on('click', '.del', function(event) {
        console.log(event);
        var id = event.target.dataset.id;
        $.ajax({
            method: 'GET',
            url: 'http://134.175.154.93:8099/manager/category/deleteCategoryById?id=' + id,
            data: null,
            dataType: 'json',
            success: function(res) {
                showMsg();
            },
            error: function(error) {
                alert('删除失败')
            }
        })
    })


    //修改数据
    $('.myshow').on('click', '.change', function(event) {
            var $event = $(this).parent().parent();
            console.log($event);
            var id = $event.children().eq(0).children().attr('data-id');
            console.log(id);
            var name = $event.children().eq(1).html();
            var parent = $event.children().eq(2).html();
            var comment = $event.children().eq(3).html();
            console.log(name, parent, comment);
            $('#name').val(name);
            $('#parent').val(parent);
            $('#comment').text(comment);
            $('#changemodal').modal('show');
            $('.tosend').click(function() {
                var name = $('#name').val();
                var parent = $('#parent').val();
                var comment = $('#comment').val()
                $.ajax({
                    method: 'POST',
                    url: 'http://134.175.154.93:8099/manager/category/saveOrUpdateCategory',
                    data: {
                        id: id,
                        name: name,
                        comment: comment,
                    },
                    dataType: 'json',
                    success: function(res) {
                        console.log('提交成功');
                        showMsg();
                    },
                    error: function(error) {
                        console.log('提交失败');
                    }
                })
                $('#changemodal').modal('hide');
            })

        })
        //批量删除
    $('.batchdel').click(function() {
        var ids = $(':checkbox:checked').map(function(index, item) {
            return $(item).attr('data-id');
        }).get();
        var ids = ids.toString();
        $.ajax({
            method: 'post',
            url: 'http://134.175.154.93:8099/manager/category/batchDeleteCategory',
            data: { ids: ids },

            success: function(res) {
                console.log('删除成功');
                showMsg();
            },
            error: function(error) {
                console.log(error);
            }
        })


    });

    //分页
    	// 数据
		var state = {
			// 当前页数
			currentPage:1,
			// 每页条数
			pageSize:2,
			// 总页数
			totalPage:0,
			// 表格数据
			tableData:[],
			// 表格总数据
			tableTotalData:[],
			// 新增或者修改操作类型
			option:'新增',
			// 当前修改的对象
			currentObj:{},
		};	
		// 分页事件绑定
		$('.pagination').on('click','li',function(event){
			// 如果有禁用，直接返回
			if($(this).hasClass('disabled')){
				return;
			}
			// 正常页数点击
			if($(this).hasClass('page-num')){
				state.currentPage = +($(this).text());
				$('.pagination li').removeClass('active');
				$(this).addClass('active');
				if(state.currentPage===1){
					$('.pagination li:first-child').addClass('disabled')
				}else{
					$('.pagination li:first-child').removeClass('disabled')
				}
				if(state.currentPage===state.totalPage){
					$('.pagination li:last-child').addClass('disabled')
				}else{
					$('.pagination li:last-child').removeClass('disabled')
				}
			}
			// 上一页
			if($(this).hasClass('prev')){
				state.currentPage -= 1;
				// 设置上一个的li为选中状态
				$('.pagination li').removeClass('active');
				$('.pagination li').eq(state.currentPage).addClass('active');
				if(state.currentPage==1){
					$(this).addClass('disabled');
				}
			}
			// 下一页
			if($(this).hasClass('next')){
				state.currentPage += 1;
				// 设置上一个的li为选中状态
				$('.pagination li').removeClass('active');
				$('.pagination li').eq(state.currentPage).addClass('active');
				if(state.currentPage==state.totalPage){
					$(this).addClass('disabled');
				}
			}
			// 访问数据追加节点
			// 访问数据
			state.tableData = state.tableTotalData.slice((state.currentPage-1)*state.pageSize,state.currentPage*state.pageSize);
				addTableDOM();
		});






})
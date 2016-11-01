/**
 * Created by Wu Baohua on 2016/9/13.
 */

(function($) {

    var attendanceTable = {
        $btnContainer : $('.btns'),     //打印预览按钮父容器
        $resetBtn : $('#reset'),        //表格重置按钮
        $printBtn : $('#print'),        //打印预览按钮
        $copyTable : $('#copyTable'),   //复制表格按钮
        $alertMessage : $('#alertMessage'),   //提示信息按钮
        $copyPage : $('#copyPage'),   //复制页面按钮

        $firstCycleStart : $('.firstTable .cycle-start'),
        $firstCycleEnd : $('.firstTable .cycle-end'),
        $firstTimeFullYear : $('.firstTable .time-full-year'),
        $firstTimeMonth : $('.firstTable .time-month'),
        $firstTimeDate : $('.firstTable .time-date'),

        $firstTable : $('.firstTable').find('table'),   //第一个表格
        $secondTable : $('.secondTable').find('table'),   //第二个表格
        $firstTableContainer : $('.firstTable'),  //第一个表格容器
        $secondTableContainer : $('.secondTable'),  //第二个表格容器

        $firstTableInput : $('.firstTable').find('input'),   //第一个表格的input
        $secondTableInput : $('.secondTable').find('input'),   //第二个表格的input
        $firstTableTextarea : $('.firstTable').find('textarea'),   //第一个表格的文本域
        $secondTableTextarea : $('.secondTable').find('textarea'),   //第二个表格的文本域

        $moreInfo : $('.more-info'),   //休假时间后的补充说明
        $select : $('select'),  //休假原因多选框
        $option : $('ul li'),   //休假原因多选框

        $container : $('.first-child'), //表格的容器

        idNum : 3, //多选框id后缀
        containerNum : 1 //新生产表格容器class后缀

    };

    /**
     * 表格初始化
     */
    function initTable(){
        var containerStr = attendanceTable.$container.html();
        attendanceTable.$btnContainer.before('<div class = "container new-container-'+ attendanceTable.containerNum +'" >'+ containerStr +'</div>');
        var $checkbox = $('.new-container-' + attendanceTable.containerNum).find('input[type = checkbox]');
        changeCheckboxId($checkbox,0,11);
        changeCheckboxId($checkbox,11,22);
    }

    /**
     * 更改checkbox 元素id的方法
     */
    function changeCheckboxId($checkbox,startNum,endNum){
        for(var i = startNum; i < endNum; i++){
            var oldId = $checkbox.eq(i).attr('id');
            var oldLabelFor = $checkbox.eq(i).next().attr('for');
            var newId = oldId.substr(0 ,oldId.length-1) + attendanceTable.idNum;
            var newLabelFor = oldLabelFor.substr(0 ,oldLabelFor.length-1) + attendanceTable.idNum;
            $checkbox.eq(i).attr('id',newId);
            $checkbox.eq(i).next().attr('for',newLabelFor);
        }
        attendanceTable.idNum++;
        attendanceTable.containerNum++;
    }

    /**
     * 初始化考勤周期和填表日期
     */
    function initTime(){
        var nativeTime = new Date(); //本地时间
        var timeFullYear = nativeTime.getFullYear();
        var timeMonth    = nativeTime.getMonth();
        var timeDate     = nativeTime.getDate();

        attendanceTable.$firstCycleStart.val(timeMonth);
        attendanceTable.$firstCycleEnd.val(timeMonth + 1);

        attendanceTable.$firstTimeFullYear.val(timeFullYear);
        attendanceTable.$firstTimeMonth.val(timeMonth + 1);
        attendanceTable.$firstTimeDate.val(timeDate);
    }

    /**
     * 复制表格公共信息
     */
    function copyInfo($firstTableEle,$secondTableEle) {
        var eleTextArr = [];
        var eleCheckedArr = [];

        for (var i=0;i<$firstTableEle.length;i++){
            eleTextArr.push($firstTableEle[i].value);
            if($firstTableEle[0].tagName == 'INPUT'){
                eleCheckedArr.push($firstTableEle[i].checked);
            }
        }

        for (var i=0;i<$secondTableEle.length;i++){
            $secondTableEle[i].value = eleTextArr[i];
            if($secondTableEle[0].tagName == 'INPUT'){
                $secondTableEle[i].checked = eleCheckedArr[i];
            }
        }
    }

    /**
     * 初始化页面
     */
    function initPage(){

        initTime(); //初始化考勤周期和填表日期
        addLineThrough();  //给日期单位添加删除线

        attendanceTable.$resetBtn.bind('click',function(){
            window.localStorage.formHistory = '';
            window.location.reload();
        });

        attendanceTable.$copyTable.bind('click',function(){

            copyInfo(attendanceTable.$firstTableInput,attendanceTable.$secondTableInput);
            copyInfo(attendanceTable.$firstTableTextarea,attendanceTable.$secondTableTextarea);

            attendanceTable.$secondTableContainer.find('.holiday-time input').val('');
            attendanceTable.$secondTableContainer.find('.holiday-time span').css({'text-decoration':'none'});
            attendanceTable.$secondTableContainer.find('.holiday-time i').css({'text-decoration':'none'});
            addLineThrough();
        });

        attendanceTable.$printBtn.bind('click',function(){
            setTimeout(function(){
                attendanceTable.$btnContainer.show();
            },1000);
            window.print();
        });

        attendanceTable.$alertMessage.bind('click',function(){
            alert(message);
        });

        attendanceTable.$copyPage.bind('click',function(){
            document.execCommand('saveAs');
        });

        attendanceTable.$moreInfo.bind('click',function(){
            $(this).next().show();
        });

        attendanceTable.$option.bind('click',function(){
            $(this).parents().prev().val($(this).text());
            $('ul').hide();
        });

        var msg = '';
        attendanceTable.$option.bind('mouseover',function(){
            $(this).css({'backgroundColor':'#eee'});
            msg = $(this).text();
        });

        attendanceTable.$option.bind('mouseout',function(){
            $(this).css({'backgroundColor':'#fff'});
        });

        attendanceTable.$moreInfo.bind('input propertychange',function(){
            $(this).next().hide();
        });

        attendanceTable.$moreInfo.bind('blur',function(){
            $(this).val(msg);
            msg = '';
            $(this).next().hide();
        });

        /*attendanceTable.$copyPage.bind('click',function(){
            var fileName = prompt('给你的文件起个名字吧！');
            if(fileName){
                downloadPage( fileName + '.html');
            }else{
                downloadPage( 'default.html');
            }
        });*/

        var message = '强烈建议用chrome打开本页面，打印时，需要自定义边距。具体方法如下：单击‘打印预览’，然后选择预览页面左下角的‘更多设置’，在‘边距’多选框中选择‘自定义’选项，上边距为10mm，下边距为0mm,左右边距为30mm。配置打印机：打印服务器根据自己办公位置选择打印机，在开始菜单选择运行，输入 \\\\10.200.92.247，用户名为printer，密码为!@c123.com$';
        alert(message);

        $readOnlyInputs.prop({'readonly': true});
        $readOnlyTextArea.prop({'readonly': true});
        $readOnlyLabel.unbind();
    }

    function addLineThrough(){
        $('.holiday-time span').bind('click',function(){
            $(this).css({'text-decoration':'none'});
            $(this).next().css({'text-decoration':'line-through'});
        });

        $('.holiday-time i').bind('click',function(){
            $(this).css({'text-decoration':'none'});
            $(this).prev().css({'text-decoration':'line-through'});
        });
    }

    var $readOnlyInputs = $('.container input'); //表格中所有的input
    var $readOnlyTextArea = $('.container textarea'); //表格中所有的input
    var $readOnlyLabel = $('.container label'); //表格中所有的input
    initPage();
})(jQuery);
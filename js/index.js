/**
 * Created by Wu Baohua on 2016/9/13.
 */

(function ($) {

  var attendanceTable = {
    $btnContainer: $('.btns'),     //打印预览按钮父容器
    $resetBtn: $('#reset'),        //表格重置按钮
    $printBtn: $('#print'),        //打印预览按钮
    $alertMessage: $('#alertMessage'),   //提示信息按钮
    $copyPage: $('#copyPage'),   //保存页面按钮
    $generate: $('#generate'),  //生成表格按钮

    $periodCycleStart: $('#period .cycle-start'),
    $periodCycleEnd: $('#period .cycle-end'),
    $dateOfFilingTimeFullYear: $('#date-of-filing .time-full-year'),
    $dateOfFilingTimeMonth: $('#date-of-filing .time-month'),
    $dateOfFilingTimeDate: $('#date-of-filing .time-date'),

    $firstCycleStart: $('.firstTable .cycle-start'),
    $firstCycleEnd: $('.firstTable .cycle-end'),
    $firstTimeFullYear: $('.firstTable .time-full-year'),
    $firstTimeMonth: $('.firstTable .time-month'),
    $firstTimeDate: $('.firstTable .time-date'),

    $firstTable: $('.firstTable').find('table'),   //第一个表格
    $secondTable: $('.secondTable').find('table'),   //第二个表格
    $firstTableContainer: $('.firstTable'),  //第一个表格容器
    $secondTableContainer: $('.secondTable'),  //第二个表格容器

    $firstTableInput: $('.firstTable').find('input'),   //第一个表格的input
    $secondTableInput: $('.secondTable').find('input'),   //第二个表格的input
    $firstTableTextarea: $('.firstTable').find('textarea'),   //第一个表格的文本域
    $secondTableTextarea: $('.secondTable').find('textarea'),   //第二个表格的文本域

    $moreInfo: $('.more-info'),   //休假时间后的补充说明
    $select: $('select'),  //休假原因多选框
    $option: $('ul li'),   //休假原因多选框

    $container: $('.first-child'), //表格的容器

    $firstPage: $('.first-page'), //首页
    $allContainer: $('.container'), //表格
    $reasonForLeave: $('.reason-for-leave'), //请假原因多选框
    $addBtn: $('.add-btn'), //增加请假理由按钮
    $footerInfo: $('.footer-info'), //表格底部信息

    idNum: 3, //多选框id后缀
    containerNum: 1,//新生产表格容器class后缀
    generateBtnStatus: 1 //生成表格按钮的默认状态


  };

  /**
   * 表格初始化
   */
  function initTable() {
    var containerStr = attendanceTable.$container.html();
    attendanceTable.$btnContainer.before('<div class = "container new-container-' + attendanceTable.containerNum + '" >' + containerStr + '</div>');
    attendanceTable.containerNum++;
  }

  /**
   * 初始化考勤周期和填表日期
   */
  function initTime() {
    var nativeTime = new Date(); //本地时间
    var timeFullYear = nativeTime.getFullYear();
    var timeMonth = nativeTime.getMonth();
    var timeDate = nativeTime.getDate();

    attendanceTable.$periodCycleStart.val(timeMonth);
    attendanceTable.$periodCycleEnd.val(timeMonth + 1);

    attendanceTable.$dateOfFilingTimeFullYear.val(timeFullYear);
    attendanceTable.$dateOfFilingTimeMonth.val(timeMonth + 1);
    attendanceTable.$dateOfFilingTimeDate.val(timeDate);
  }

  /**
   * 复制表格公共信息
   */
  function copyInfo($firstTableEle, $secondTableEle) {
    var eleTextArr = [];
    var eleCheckedArr = [];

    for (var i = 0; i < $firstTableEle.length; i++) {
      eleTextArr.push($firstTableEle[i].value);
      if ($firstTableEle[0].tagName == 'INPUT') {
        eleCheckedArr.push($firstTableEle[i].checked);
      }
    }

    for (var i = 0; i < $secondTableEle.length; i++) {
      $secondTableEle[i].value = eleTextArr[i];
      if ($secondTableEle[0].tagName == 'INPUT') {
        $secondTableEle[i].checked = eleCheckedArr[i];
      }
    }
  }

  /**
   * 初始化页面
   */
  function initPage() {

    initTime(); //初始化考勤周期和填表日期
    addLineThrough();  //给日期单位添加删除线

    attendanceTable.$resetBtn.bind('click', function () {
      window.localStorage.formHistory = '';
      window.location.reload();
    });

    attendanceTable.$printBtn.bind('click', function () {
      setTimeout(function () {
        attendanceTable.$btnContainer.show();
      }, 1000);
      window.print();
    });

    attendanceTable.$alertMessage.bind('click', function () {
      alert(message);
    });

    attendanceTable.$copyPage.bind('click', function () {
      document.execCommand('saveAs');
    });

    attendanceTable.$moreInfo.bind('click', function () {
      $(this).next().show();
    });

    attendanceTable.$option.bind('click', function () {
      $(this).parents().prev().val($(this).text());
      $('ul').hide();
    });

    var msg = '';
    attendanceTable.$option.bind('mouseover', function () {
      $(this).css({'backgroundColor': '#eee'});
      msg = $(this).text();
    });

    attendanceTable.$option.bind('mouseout', function () {
      $(this).css({'backgroundColor': '#fff'});
    });

    attendanceTable.$moreInfo.bind('input propertychange', function () {
      $(this).next().hide();
    });

    attendanceTable.$moreInfo.bind('blur', function () {
      $(this).val(msg);
      msg = '';
      $(this).next().hide();
    });

    attendanceTable.$generate.bind('click', function () {
      generateTable();
    });

    var message = '强烈建议用chrome打开本页面，打印时，需要自定义边距。具体方法如下：单击‘打印预览’，然后选择预览页面左下角的‘更多设置’，在‘边距’多选框中选择‘自定义’选项，上边距为10mm，下边距为0mm,左右边距为30mm。配置打印机：打印服务器根据自己办公位置选择打印机，在开始菜单选择运行，输入 \\\\10.200.92.247，用户名为printer，密码为!@c123.com$';
    alert(message);

    $readOnlyInputs.prop({'readonly': true});
    $readOnlyTextArea.prop({'readonly': true});
  }

  function addLineThrough() {
    $('.first-page-holiday-time span').bind('click', function () {
      $(this).css({'text-decoration': 'none'});
      $(this).next().css({'text-decoration': 'line-through'});
    });

    $('.first-page-holiday-time i').bind('click', function () {
      $(this).css({'text-decoration': 'none'});
      $(this).prev().css({'text-decoration': 'line-through'});
    });

    $('.holiday-time span').bind('click', function () {
      $(this).css({'text-decoration': 'none'});
      $(this).next().css({'text-decoration': 'line-through'});
    });

    $('.holiday-time i').bind('click', function () {
      $(this).css({'text-decoration': 'none'});
      $(this).prev().css({'text-decoration': 'line-through'});
    });
  }

  function generateTable() {
    if (attendanceTable.generateBtnStatus == 1) {
      attendanceTable.generateBtnStatus = 0;
      for(var i =0 ;i < 5;i++){
        initTable();
        console.log(i);
      }
      attendanceTable.$generate.text('重新填写');
      attendanceTable.$resetBtn.hide();
      attendanceTable.$copyPage.hide();
      attendanceTable.$printBtn.css('display','block');
      attendanceTable.$alertMessage.css('display','block');
      attendanceTable.$firstPage.hide();
      $('.container').show();
    } else if (attendanceTable.generateBtnStatus == 0) {
      attendanceTable.generateBtnStatus = 1;
      attendanceTable.$generate.text('生成表格');
      attendanceTable.$resetBtn.show();
      attendanceTable.$copyPage.show();
      attendanceTable.$printBtn.hide();
      attendanceTable.$alertMessage.hide();
      attendanceTable.$firstPage.show();
      $('.container').hide();
    }
  }

  function bindAddInput() {
    $('.add-btn').bind('click', function(){
      addInput();
      reasonForLeaveChange();
      deleteAddInput();
    });
  }

  function addInput(){
    var str = '<div class="first-page-holiday-time">'+
      '<input class="start-full-year" type="text">年 '+
      '<input class="start-month" type="text">月 '+
      '<input class="start-date" type="text">日 '+
      '<input class="start-hours" type="text">时 至 '+
      '<input class="end-full-year" type="text">年 '+
      '<input class="end-month" type="text">月 '+
      '<input class="end-date" type="text">日 '+
      '<input class="end-hours" type="text">时，共 '+
      '<input class="used-time" type="text"><span>小时</span><i>(天)</i> '+
      '<u>备注：</u> '+
      '<select class="reason-for-leave">'+
      '<option>存休</option>'+
      '<option>倒休</option>'+
      '<option>事假</option>'+
      '<option>带薪病假</option>'+
      '<option>病假</option>'+
      '<option>年假</option>'+
      '<option>婚假</option>'+
      '<option>产假</option>'+
      '<option>公出</option>'+
      '<option>出差</option>'+
      '<option>其他</option>'+
      '</select> '+
      '<input class="qita" type="text">'+
      '  <b class="delete-btn"></b>'+
      '</div>';
    attendanceTable.$footerInfo.before(str);
  }

  function reasonForLeaveChange(){
    $('.reason-for-leave').bind('change', function () {
      if($(this).val() == '其他'){
        $(this).next().css('visibility','visible');
      }else{
        $(this).next().css('visibility','hidden');
      }
    });
  }

  function deleteAddInput() {
    $('.delete-btn').bind('click', function(){
      $(this).parent().remove();
    });
  }

  var $readOnlyInputs = $('.container input'); //表格中所有的input
  var $readOnlyTextArea = $('.container textarea'); //表格中所有的input
  initPage();
  reasonForLeaveChange();
  bindAddInput();

})(jQuery);
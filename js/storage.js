/**
 * Created by Wu Baohua on 2016/9/20.
 */

(function($) {
    var localMsg;

    var $textarea = $('.first-page textarea');
    var $input = $('.save-data');

    if( window.localStorage.formHistory ){
        localMsg = JSON.parse( window.localStorage.formHistory );
    }
    if( localMsg && localMsg.length >= 1){
        var realIndex = 0;

        for(var i = 0;i < $textarea.length ; i++){
            if( $($textarea[i])){
                $($textarea[i]).val(localMsg[realIndex].text);
                realIndex++;
            }
        }

        for(var i = 0;i < $input.length ; i++){
            if( $($input[i])[0].type == 'text'){
                $($input[i]).val(localMsg[realIndex].text);
                realIndex++;
            }else if($($input[i])[0].type == 'radio'){
                $($input[i]).prop('checked',localMsg[realIndex].radio);
                realIndex++;
            }else if($($input[i])[0].type == 'checkbox'){
                $($input[i]).prop('checked',localMsg[realIndex].checkbox);
                realIndex++;
            }
        }

    }
    $('#copyPage').click(function () {
        var history = [];
        window.localStorage.formHistory = '';

        for(var i = 0;i < $textarea.length ; i++){
            if($($textarea[i])){
                history.push({'text' : $($textarea[i]).val()});
            }
        }

        for(var i = 0;i < $input.length ; i++){
            if($($input[i])[0].type == 'text'){
                history.push({'text' : $($input[i]).val()});
            }else if($($input[i])[0].type == 'radio'){
                history.push({'radio' : $($input[i])[0].checked});
            }else if($($input[i])[0].type == 'checkbox'){
                history.push({'checkbox' : $($input[i])[0].checked});
            }
        }

        window.localStorage.formHistory = JSON.stringify(history);
        alert('已保存');
    });
})(jQuery);
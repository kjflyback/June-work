$(document).ready(function ($) {
    $('#addnew').click(function(){
        server.project.addnew($('#addnewtext')[0].value,function(){
            document.location.reload();
        })
    })
    var tmp = $('#itemtmp')[0].innerText;
    server.project.refresh(function(result){
        for(var i = 0;i<result.length;i++){
            var val = tmp.replace(/{itemid}/g, i + 1);
            val = val.replace(/{itemname}/g, result[i].get('name'));
            $('#projectlist').append(val);
        }        
    });
});
$(document).ready(function($){
    // set username
    var currentUser = AV.User.current();
    if(!currentUser){
        document.location.href = "../index.html";
    }
    console.log(currentUser.getUsername());
    $('#username')[0].innerText = currentUser.getUsername();    
    
    server.project.refresh(function(res){
        for(var i = 0;i<res.length;i++){
            var tmp = $('#itemtmp')[0].innerText;
            tmp = tmp.replace(new RegExp('{itemtext}', 'g'), res[i].get('name'));
            tmp = tmp.replace(new RegExp('{itemid}', 'g'), res[i].id);
            
            $('#projectlist').append(tmp);
        }
        $('.projectchecker').on('click','', function(){
            console.log($(this).attr('item'));
            server.markProject($(this).attr('item'), function(o){
                alert('更新当前正在处理的项目为:' + $(this).innerText);
                document.location.reload();
            },function(err){
                console.log(err);
            });
        });
    },function(proj){
        // console.log(proj[0].get('project').get('name'));
        $('#currentproject')[0].innerText = proj.get('project').get('name');
    });
    
});

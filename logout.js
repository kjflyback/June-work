$(document).ready(function($){
    $('#logout').on('click', '', function(){
        server.logout();
        document.location.href="index.html";
    });
    
});
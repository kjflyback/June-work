// set username
var currentUser = AV.User.current();
console.log(currentUser.getUsername());
$('#username')[0].innerText = currentUser.getUsername();
server.project.refresh();
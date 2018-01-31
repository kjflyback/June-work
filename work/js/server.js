var record = {

};
(function($){
    // ARLfDFch9OmH7CnGrAaL4Kiq-gzGzoHsz
    // uLp30boDaFhNCof4SK5az0n9
    var APP_ID = 'ARLfDFch9OmH7CnGrAaL4Kiq-gzGzoHsz';
    var APP_KEY = 'uLp30boDaFhNCof4SK5az0n9';

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

record.insert = function(client, type, contact, tel, phone, handle,memo, cb){
    const Affair = AV.Object.extend('Affair');
    const affair = new Affair();
    var obj = {client:client, asktype:type, contact:contact, telephone:tel, mobile:phone, handletype:handle, memo:memo};
    console.log(obj);
    affair.save(obj).then(cb,function(err){
        console.log(err);
    });   
};
record.getRecord = function(cb){
     var AffairQuery = new AV.Query('Affair');
    AffairQuery.descending('createdAt');
    AffairQuery.find().then(cb, function(err){
        console.log(err);
    })
};
})();
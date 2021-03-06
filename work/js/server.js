(function ($) {
    // ARLfDFch9OmH7CnGrAaL4Kiq-gzGzoHsz
    // uLp30boDaFhNCof4SK5az0n9
    
    // 2019
    // WgBTgLgggicSSF1XP3mKVkBH-gzGzoHsz
    // zWF8MHyl8D8ziYqPzPrQ5dlu
    var APP_ID = 'WgBTgLgggicSSF1XP3mKVkBH-gzGzoHsz';
    var APP_KEY = 'zWF8MHyl8D8ziYqPzPrQ5dlu';

    AV.init({
        appId: APP_ID,
        appKey: APP_KEY
    });
    
    window.record = function () {
    };
    window.getid = function (className, content, cb) {
        var C = new AV.Query(className);
        C.equalTo('content', content || '/');
        C.find().then(function (s) {
            cb({ id: s.id, content: s.get('content') });
        }, function (err) {
            console.log(err);
        });

    }
    window.record.prototype = {
        _client: { id: 0, content: '' },
        _asktype: { id: 0, content: '' },
        _contact: { id: 0, content: '' },
        _telephone: { id: 0, content: '' },
        _mobile: { id: 0, content: '' },
        _handletype: { id: 0, content: '' },
        _memo: '',
        _place:'',
        saveAndGet: function (target, className, c) {
            this[target].content = c;
        },
        set client(c) { this.saveAndGet('_client', 'Client', c); }, get client() { return this._client.content; },
        set asktype(c) { this.saveAndGet('_asktype', 'AskType', c); }, get asktype() { return this._asktype.content; },
        set contact(c) { this.saveAndGet('_contact', 'Contact', c); }, get contact() { return this._contact.content; },
        set telephone(c) { this.saveAndGet('_telephone', 'Telephone', c); }, get telephone() { return this._telephone.content; },
        set mobile(c) { this.saveAndGet('_mobile', 'Mobile', c); }, get mobile() { return this._mobile.content; },
        set handletype(c) { this.saveAndGet('_handletype', 'HandleType', c); }, get handletype() { return this._handletype.content; },
        set memo(c) { this._memo = c; }, get memo() { return this._memo; },
        set place(c){this._place = c;}, get place() {return this._place;}
    };
    window.insertRecord = function (r, cb) {
        // const Client = AV.Object.extend('Client');
        //  const client = new Client();
        var Proj = new AV.Query('Project');
            Proj.equalTo('name', r.asktype);
            Proj.find().then(function(s){
                if(s.length == 0){
                    server.project.addnew(r.asktype);
                }
            });

        const Affair = AV.Object.extend('Affair');
        const affair = new Affair();
        console.log(r);
        var currentUser = AV.User.current();
        var obj = {
            client: r.client,
            asktype: r.asktype,
            contact: r.contact,
            telephone: r.telephone,
            mobile: r.mobile,
            handletype: r.handletype,
            memo: r.memo,
            place:r.place,
            uid:currentUser
        };
        // client.save({desc:r.client});
        affair.save(obj).then(cb, function (err) {
            console.log(err);
        });
    }

    window.getRecord = function (cb) {
        var AffairQuery = new AV.Query('Affair');
        /*
        AffairQuery.include("Client");
        AffairQuery.include("AskType");
        AffairQuery.include("Contact");
        AffairQuery.include("Telephone");
        AffairQuery.include("Mobile");
        AffairQuery.include("HandleType");
        */
        AffairQuery.descending('createdAt');
        AffairQuery.find().then(function (result) {
            cb(result);
        }, function (err) {
            console.log(err);
        })
    };
    window.server = {
        logout:function(){
            var currentUser = AV.User.current();
            if(currentUser)
                AV.User.logOut();
        },
        markProject:function(prjid, cb, err){
            var currentUser = AV.User.current();
            if(!currentUser){
                return;
            }
            var userAction = new AV.Object('UserAction');
            var Project = new AV.Object.createWithoutData('Project', prjid);
            Project.fetch().then(function(){
                userAction.set('uid', currentUser);
                userAction.set('project', Project);
                userAction.save().then(function(d){
                    if(cb){
                        cb(d);
                    }
                },function(e){
                    if(err) err(e);
                });
            });            
        },
        project:{
            count:0,
            refresh:function(cb, cbUsrPrj){
                var Project = new AV.Query('Project');
                Project.count().then(function(d){
                    this.count = d;
                });
                Project.find().then(cb);
                var currentUser = AV.User.current();
                if(currentUser){
                    var currentProj = new AV.Query('UserAction');
                    currentProj.descending('createdAt');
                    currentProj.include('project');                    
                    currentProj.equalTo('uid', currentUser);
                    currentProj.first().then(function(d){
                        console.log(d);
                        if(cbUsrPrj){
                            cbUsrPrj(d);
                        }
                    });
                }
                // cb([{get:function(){return "æ²³å—bmp";}},{get:function(){return "æ²³åŒ—bmp"}}]);
            },
            addnew:function(n,s){
                var Proj = new AV.Object('Project');
                Proj.set('name', n);
                Proj.save().then(function(su){
                    if(s) s(su);
                });
            },
            remove:function(id, cb){
                var Proj = AV.Object.createWithoutData('Project', id);
                Proj.destroy().then(function(d){
                    if(cb) cb(d);
                },function(err){

                });
            }
        },
        count: function (cb) {
            var AffairQuery = new AV.Query('Affair');
            AffairQuery.count().then(cb);
        },
        lastdate: function (cb) {
            var AffairQuery = new AV.Query('Affair');
            // AffairQuery.descending('createdAt');
            AffairQuery.first().then(function (s) {
                cb(s.createdAt);
            });
        },
        normalize: function (date, day) {
            var d = new Date();
            var s = d.toLocaleDateString()
            d = new Date(s + ' 00:00:00');
            var ret = new Date(s + ' 00:00:00');
            ret.setDate(d.getDate() + day);
            // console.log(ret.toLocaleDateString() + ' 00:00:00');
            ret = new Date(ret.toLocaleDateString() + ' 00:00:00');
            return ret;
        },
        update:function(id, key, val){
            console.log(key + ' = ' + val);
            var AffairQuery = AV.Object.createWithoutData('Affair', id);
            AffairQuery.set(key, val);
            AffairQuery.save();
            if(key != 'asktype') return;
            
            var Proj = new AV.Query('Project');
            Proj.equalTo('name', val);
            Proj.find().then(function(s){
                if(s.length == 0){
                    server.project.addnew(val);
                }
            },function(er){
                // æ²¡æœ‰åˆ™åŠ å…?
                server.project.addnew(val);
            });
        },
        items: function (day, cb) {
            var startDateQuery = new AV.Query('Affair');
            var d = server.normalize(new Date(), day);
            startDateQuery.greaterThanOrEqualTo('createdAt', d);
            console.log('>' + d.toLocaleString());
            var endDateQuery = new AV.Query('Affair');
            d = server.normalize(new Date(), day + 1);
            endDateQuery.lessThanOrEqualTo('createdAt', d);

            console.log('<' + d.toLocaleString());
            var query = AV.Query.and(startDateQuery, endDateQuery);
            query.find().then(function (result) {
                var data = [];
                for (var i = 0; i < result.length; i++) {
                    var item = {
                        client: result[i].get('client'),
                        asktype: result[i].get('asktype'),
                        contact: result[i].get('contact'),
                        telephone: result[i].get('telephone'),
                        mobile: result[i].get('mobile'),
                        handletype: result[i].get('handletype'),
                        memo: result[i].get('memo'),
                        place:result[i].get('place'),
                        createdAt: result[i].createdAt,
                        id:result[i].id
                    };
                    data.push(item);
                }
                cb({ day: day, items: data });
            });
        }
    };
})();

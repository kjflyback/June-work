function unique(arr) {
	var result = [],
		hash = {};
	for (var i = 0, elem;
		(elem = arr[i]) != null; i++) {
		if (!hash[elem]) {
			result.push(elem);
			hash[elem] = true;
		}
	}
	return result;
	//http://www.cnblogs.com/sosoft/
}
$(document).ready(function ($) {

	var clear = function () {
		$('#clientname').val('');
		$('#clienttype').val('');
		$('#interface').val('');
		$('#telephone').val('');
		$('#phone').val('');
		$('#group').val('');
		$('#comment').val('');
		$('#place').val('');
		$('#clientname').focus();
		$('#clientname').select();
	}

	clear();

	var val = function (intxt, obj, objname) {
		return intxt.replace(new RegExp('{' + objname + '}', 'ig'), obj.get(objname) || "无记录");
	}
	// console.log(result);
	var dataitem = $('#dataitem').text();
	var appendNewItem = function (data) {
		var di = dataitem;
		di = val(di, data, 'client');
		di = val(di, data, 'asktype');
		di = val(di, data, 'telephone');
		di = val(di, data, 'mobile');
		di = val(di, data, 'handletype');
		di = di.replace(/{memo}/g, data.get('memo'));
		di = di.replace(/{place}/g, data.get('place'));
		di = val(di, data, 'contact');
		di = di.replace(/{time}/g, data.createdAt.toLocaleString());
		$('#hisdata').append(di);

	}


	$('#insert').click(function () {
		var r = new record();

		r.client = $('#clientname').val();
		r.asktype = $('#clienttype').val();
		r.contact = $('#interface').val();
		r.telephone = $('#telephone').val();
		r.mobile = $('#phone').val();
		r.handletype = $('#group').val();
		r.memo = $('#comment').val();
		r.place = $('#place').val();
		insertRecord(r, function (ret) {
			appendNewItem(ret);
			clear();
			// $('#myModal').modal();

		}
		);
	});

	// console.log(dataitem);
	/*
	getRecord(function (result) {
		for (var i = 0; i < result.length; i++) {
			appendNewItem(result[i]);
		}
	});
	*/

	var regions = []
	var pos = [];
	var eachsub = function (item) {
		var prefix = pos.join('')
		// console.log(prefix + item.name);
		if (item.name == '请选择') return;
		if (item.name == '其他') return;
		regions.push(prefix +'/'+ item.name);
		pos.push(item.name);
		if (item.sub)
			item.sub.forEach(eachsub);
		pos.pop();
	}
	city_regions.forEach(eachsub);
	var commentPart = {};
	var typeaheads =
		[
			[regions, 'place'],
			['client.json', 'clientname', {
				source: function (data) {
					var retdata = [];
					// commentPart = {};
					// console.log(data);
					data.forEach(function (itemx) {
						// console.log(itemx);

						var item = [itemx, itemx];
						retdata.push(item[0])
						if (!commentPart[item[0]])
							commentPart[item[0]] = [];

						if (item[1].length) {
							var ci = commentPart[item[0]];
							if (ci.length < 5) {
								ci.push(item[1]);
								ci = unique(ci);
								commentPart[item[0]] = ci;
							}
						}

					});
					var retdata = unique(retdata);
					return retdata;
				},
				highlighter: function (item, val) {
					var retHtml = '<dl class="dl-horizontal"><dt>' + val + '</dt>'
					var head = val;
					var comment = commentPart[item];
					// console.log(comment);
					if (!comment) return val;
					// comment = unique(comment);
					// console.log(commentPart);
					comment.forEach(function (it) {
						retHtml += '<dd><small>' + it + '</small></d>';
						// head = "";
					});
					retHtml += "</dl>";
					// console.log(retHtml);
					return retHtml;
				}
			}],
			// ['client.json', 'clientname'],
			
			['type.json', 'clienttype'],
			['interface.json', 'interface'],
			['tel.json', 'telephone'],
			['phone.json', 'phone'],
			['group.json', 'group']

		];

	typeaheads.forEach(function (tah) {
		// console.log(tah);
		var ahead=function(data){
			// data = data.replace('\n', '');
			// data = data.replace('\r', '');
			$('#' + tah[1]).typeahead({
				source: function (query, process) {
					// console.log(query);
					if (tah[2] && tah[2].source)
						return tah[2].source(data)
					return data;
				},
				matcher: function (item) {
					return ~(pinyin.getCamelChars(item).indexOf(this.query.toUpperCase())) ||
						~(item.toUpperCase().indexOf(this.query.toUpperCase()));
				},
				highlighter: function (item) {
					var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
					var val = item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
						return '<strong>' + match + '</strong>'
					});
					if (tah[2] && tah[2].highlighter)
						return tah[2].highlighter(item, val);
					return val;
				},
				updater: function (item) {
					return item
				}
			});
		}
		if(typeof tah[0] == 'object'){
			ahead(tah[0]);
		}else{
			$.get('data/' + tah[0], '', ahead);
		}
	});



	// $('#his').append('<li><a href="#" date="' + new Date().toLocaleDateString() + '">' + new Date().toLocaleDateString() + '</a></li>');
	var valserver = function (intxt, obj, objname) {
		var v = intxt.replace(new RegExp('{' + objname + '}', 'ig'), obj[objname] || "无记录");
		// console.log(v);
		return v;
	}
	var appendServerItem = function (data) {

		var di = dataitem;
		di = valserver(di, data, 'client');
		di = valserver(di, data, 'asktype');
		di = valserver(di, data, 'telephone');
		di = valserver(di, data, 'mobile');
		di = valserver(di, data, 'handletype');
		di = di.replace(/{memo}/g, data.memo);
		di = di.replace(/{place}/g, data.place);
		di = valserver(di, data, 'contact');
		di = di.replace(/{time}/g, data.createdAt.toLocaleString());
		// console.log(di);
		$('#hisdata').append(di);
	}
	server.lastdate(function (date) {
		console.log(date);
		var now = new Date();
		var count = now.getDate() - date.getDate() + 1;
		console.log(count);
		// count = 5;
		for (var i = 0; i < count; i++) {
			var d = new Date();
			d.setDate(now.getDate() - i);
			var datev = d.toLocaleDateString();
			$('#his').append('<li><a href="#" mark="-' + i + '" >' + datev + '</a></li>');
		}
		$('[mark]').on('click', function () {
			var c = $('.hisdata').length;
			for (var i = 0; i < c; i++) {
				$('.hisdata')[0].remove();
			}
			// query data		

			server.items(parseInt(this.getAttribute('mark')), function (result) {
				// console.log(result);	
				for (var i = 0; i < result.items.length; i++) {
					appendServerItem(result.items[i]);
				}
			});
		});
	});
	server.items(0, function (result) {
		// console.log(result);	
		for (var i = 0; i < result.items.length; i++) {
			appendServerItem(result.items[i]);
		}
	})
});
// $('#clientname').attr('data-original-title', '{{error}}')
// $('#clientname').attr('data-toggle', 'tooltip')
// $('#clientname').tooltip('show')

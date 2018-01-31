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

	$('#insert').click(function () {
		record.insert(
			$('#clientname').val(),
			$('#clienttype').val(),
			$('#interface').val(),
			$('#telephone').val(),
			$('#phone').val(),
			$('#group').val(),
			$('#comment').val(),
			function (ret) {
				$('#myModal').modal();
			}
		)
	});
	
	console.log(dataitem);
		
	record.getRecord(function(result){
		var dataitem = $('#dataitem').text();
		for(var i = 0;i<result.length;i++){
			var di = dataitem;
			// console.log(result[i]);
			for(var k in result[i].attributes){
				var r = new RegExp('{' + k + '}', 'ig');
				di = di.replace(r, result[i].attributes[k]);
			}
			console.log(result[i]);
			di = di.replace(/{time}/g, result[i].createdAt.toLocaleString());
			$('#hisdata').append(di);
		}
	});
	
	var regions = []
	var pos = [];
	var eachsub = function (item) {
		var prefix = pos.join('')
		// console.log(prefix + item.name);
		if (item.name == '请选择') return;
		if (item.name == '其他') return;
		regions.push(prefix + item.name);
		pos.push(item.name);
		if (item.sub)
			item.sub.forEach(eachsub);
		pos.pop();
	}
	city_regions.forEach(eachsub);
	var commentPart = {};
	var typeaheads =
		[
			['client.json', 'clientname', {
				source: function (data) {
					var retdata = [];
					// commentPart = {};
					//console.log(data);
					data.forEach(function (item) {
						// console.log(data);
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


					var retdata = unique(retdata).concat(regions);
					return retdata;
				},
				highlighter: function (item, val) {
					var retHtml = '<blockquote><dl class="dl-horizontal"><dt>' + val + '</dt>'

					var head = val;
					var comment = commentPart[item];
					// console.log(comment);
					if (!comment) return val;
					// comment = unique(comment);
					// console.log(commentPart);
					comment.forEach(function (it) {
						retHtml += '<dd><small>' + it + '</small></dd>';
						// head = "";
					});
					retHtml += "</dl></blockquote>";
					console.log(retHtml);
					return retHtml;
				}
			}],
			['type.json', 'clienttype'],
			['interface.json', 'clientinterface'],
			['tel.json', 'telephone'],
			['phone.json', 'phone'],
			['group.json', 'group']
		];


	typeaheads.forEach(function (tah) {
		$.get('data/' + tah[0], '', function (data) {
			// console.log(data);
			// data = data.replace('\n', '');
			// data = data.replace('\r', '');
			$('#' + tah[1]).typeahead({
				source: function (query, process) {
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
		});
	});

	// {%	if needclear %}
	$('#clientname').val('');
	$('#clienttype').val('');
	$('#clientinterface').val('');
	$('#telephone').val('');
	$('#phone').val('');
	$('#group').val('');

	// {% endif %}

	$('#clientname').focus();
	$('#clientname').select();
});
// $('#clientname').attr('data-original-title', '{{error}}')
// $('#clientname').attr('data-toggle', 'tooltip')
// $('#clientname').tooltip('show')

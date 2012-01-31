(function(){
	var template = (function(){
		function parseMarkdown(markdown){
			return $(converter.makeHtml(markdown)).get().reduce(function(df, el){ df.appendChild(el); return df }, document.createDocumentFragment());
		}
		function stringForTime(time){
			return time && time.start ? ('(' + time.start + (time.start !== time.end ? '-' + (time.end || 'present') : '') + ')') : '';
		}
		var converter = new Showdown.converter(),
			template = ['#resume',
				['#info',
					['%p#name', {$key: 'name'}],
					['%p#contact', {$key:'contact', $children:['%span', {$key:'method'}, ': ', ['%a', {href:{$key:'link'}}, {$key:'value'}]]}]
				],
				{$test: {$key: 'experience'}, $if: [
					['%h1', "Experience"],
					['%ul#experience', {$key: 'experience', $children:[ '%li',
						['%h2', {$key:'name'}, {$test: { $key: 'time' }, $if:[' ', ['%span.times', {$key:'time', $handler:stringForTime}]]}],
						{$test: { $key: 'projects' }, $if:['%ul.projects', {$key: 'projects', $children:[ '%li',
							['%h3', {$key: 'name'}, {$test: { $key: 'time' }, $if:[' ', ['%span.times', {$key:'time', $handler:stringForTime}]]}],
							{$key: 'description', $handler:parseMarkdown}
						]}]}
					]}]
				]},
				{$test: { $key: 'environments' }, $if:[
					['%h1', 'Languages and Tools'],
					['%ul#environments', {$key: 'environments', $children:[
						'%li', {$key: ''}
					]}]
				]},
				{$test: { $key: 'meetups' }, $if:[
					['%h1', 'Favorite Meetups'],
					['%ul#meetups', {$key: 'meetups', $children:[ '%li',
						['%div', ['%a', {href: {$key:'url'}}, {$key: 'name'}]]
					]}]
				]},
				{$test: { $key: 'conferences' }, $if:[
					['%h1', 'Conferences'],
					['%ul#conferences', {$key: 'conferences', $children:[ '%li',
						['%div', ['%a', {href: {$key:'url'}}, {$key: 'name'}], {$test: { $key: 'extra' }, $if:[' ', ['%span', '(', {$key:'extra'}, ')']]}, {$test: { $key: 'year' }, $if:[' ', ['%span.times', {$key:'year'}]]}], ['%div.location', {$key: 'location'}]
					]}]
				]}
			];
		return template;
	})();
		
	function showError(){
		$('#loadError').addClass('visible');
	}
	$.ajax({
		url: $('script:last').attr('data-src'),
		dataType: 'json',
		success: function(data){
			if (data) {
				document.title = data.name + ' – Résumé'
				$(document.body).append(function(){
					return haj(stencil(template, data));
				});
			} else {
				showError();
			}
		},
		error: showError
	});
})();
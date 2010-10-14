(function(){
	var $loadError = $('#loadError'),
		résuméView = $.haml.placeholder((function(){
			var converter = new Showdown.converter(),
				template = ['#resume',
					['#info',
						['%p#name', {key: 'name'}],
						['%p#contact', {key:'contact', children:['%span', {key:'method'}, ': ', {key:'value'}]}]
					],
					{key: 'experience', conditional: [
						['%h1', "Experience"],
						['%ul#experience', {key: 'experience', children:[ '%li',
							['%h2', {key:'name'}, {key: 'time', conditional:[' ', ['%span.times', {key:'time', handler:stringForTime}]]}],
							{key: 'projects', conditional:['%ul.projects', {key: 'projects', children:[ '%li',
								['%h3', {key: 'name'}, {key: 'time', conditional:[' ', ['%span.times', {key:'time', handler:stringForTime}]]}],
								{key: 'description', handler:parseMarkdown}
							]}]}
						]}]
					]},
					{key: 'competencies', conditional:[
						['%h1', 'Competencies'],
						[ '%ul#competencies', {key: 'competencies', children:[ '%li',
							['%h2', {key: 'category'}],
							['%ul', {key: 'values', children:[
								'%li', {key: ''}
							]}]
						]}]
					]},
					{key: 'certifications', conditional:[
						['%h1', 'Certifications'],
						['%ul#certifications', {key: 'certifications', children:[ '%li',
							['%a', {href: {key:'url'}}, {key: 'name'}]
						]}]
					]},
					{key: 'affiliations', conditional:[
						['%h1', 'Affiliations'],
						['%ul#affiliations', {key: 'affiliations', children:[ '%li',
							['%div', ['%a', {href: {key:'url'}}, {key: 'name'}]], ['%div.location', {key: 'location'}]
						]}]
					]},
					{key: 'conferences', conditional:[
						['%h1', 'Conferences'],
						['%ul#conferences', {key: 'conferences', children:[ '%li',
							['%div', ['%a', {href: {key:'url'}}, {key: 'name'}], {key: 'year', conditional:[' ', ['%span.times', {key:'year'}]]}], ['%div.location', {key: 'location'}]
						]}]
					]},
					{key: 'mailingLists', conditional:[
						['%h1', 'Mailing Lists'],
						['%ul#mailingLists', {key: 'mailingLists', children:[
							['%li', ['%div', ['%a', {href: {key:'url'}}, {key: 'name'}]]]
						]}]
					]}
				];
			function parseMarkdown(){
				return $(converter.makeHtml(this));
			}
			function stringForTime(){
				return this && this.start ? ('(' + this.start + (this.start !== this.end ? '-' + (this.end || 'present') : '') + ')') : '';
			}
			return function(résumé){
				if (!$.isPlainObject(résumé)) {
					return document.createTextNode('');
				};
		
				if (résumé.name) {
					document.title = résumé.name + ' – Résumé'
				}
		
				return stencil(template, résumé);
		}})()),
		résuméSource = $('script:last').attr('data-src');
		
	function showError(){
		$loadError.addClass('visible');
	}
	$(document.body).append(résuméView.inject());
	$.ajax({
		url: résuméSource,
		dataType: 'json',
		success: function(data){
			if (data) {
				résuméView.update(data);
			} else {
				showError();
			}
		},
		error: showError
	});
})();
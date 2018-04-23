
function fillInfoBox(element) {
	
	var type = element.data('type');
	infoboxElement = element;

	// Fill in all information before showing div
	document.getElementById('type-info').innerHTML = type.toUpperCase();
	document.getElementById('element-id').innerHTML = element.data('id');

	if (type == DftTypes.BE) {
		if (element.data('rate') < 0.0000001) {
			var num = new Number(element.data('rate'));
			document.getElementById('failure-rate').innerHTML = num.toExponential();
		} else  {
			document.getElementById('failure-rate').innerHTML = element.data('rate');
		}
		if (element.data('repair') < 0.0000001 || element.data('repair').length > 10) {
			var num = new Number(element.data('repair'));
			document.getElementById('repair-rate').innerHTML = num.toExponential();
		} else  {
			document.getElementById('repair-rate').innerHTML = element.data('repair');
		}
		document.getElementById('dorm-rate').innerHTML = element.data('dorm');		
		if (element.data('repair') > 0) {
			document.getElementById('repairable-bool').innerHTML = 'True';
		} else document.getElementById('repairable-bool').innerHTML = 'False';
		document.getElementById('childrens-count').innerHTML = '-';
		document.getElementById('parents-count').innerHTML = '-';
		document.getElementById('parents-count').innerHTML = element.incomers('node').length;

		// Name and Pic
		$('#pic').css('background-image', 'url("img/beInv.png")');
		$('#pic').css('background-size', '42px 42px');
		$('#pic').css('left', '90px');
		document.getElementById('name-div').innerHTML = element.data('name');

	} else if (type != DftTypes.BOT && type != DftTypes.BE) {
		document.getElementById('failure-rate').innerHTML = '-';
		document.getElementById('repair-rate').innerHTML = '-';
		document.getElementById('dorm-rate').innerHTML = '-';

		// Parents and children
		document.getElementById('childrens-count').innerHTML = element.data('children').length;
		document.getElementById('parents-count').innerHTML = element.incomers('node').length;
		

		if (element.data('repairable')) {
			document.getElementById('repairable-bool').innerHTML = 'True';
		} else document.getElementById('repairable-bool').innerHTML = 'False';
	}

	if (type == DftTypes.VOT) {
		document.getElementById('threshold-value').innerHTML = element.data('voting');

		// Name and Pic
		$('#pic').css('background-image', 'url("img/votInv.png")');
		$('#pic').css('background-size', '37.5px 49.98px');
		$('#pic').css('left', '92px');
		document.getElementById('name-div').innerHTML = element.data('name');
	} else document.getElementById('threshold-value').innerHTML = '-';

	if (type == DftTypes.PDEP) {
		document.getElementById('probability-value').innerHTML = element.data('probability');
		// Name and Pic
		$('#pic').css('background-image', 'url("img/pdep.png")');
		$('#pic').css('background-size', '100px 50px');
		$('#pic').css('left', '62.5px');
		document.getElementById('name-div').innerHTML = element.data('name');
	} else document.getElementById('probability-value').innerHTML = '-';

	if (type == DftTypes.BOT) {
		document.getElementById('childrens-count').innerHTML = '-';
		document.getElementById('parents-count').innerHTML = element.incomers('node').length;

		// Name and Pic
		$('#pic').css('background-image', 'url("img/bot.png")');
		$('#pic').css('background-size', '42px 42px');
		$('#pic').css('left', '90px');
		document.getElementById('name-div').innerHTML = element.data('name');
	} else if (type == DftTypes.AND || type == DftTypes.OR || type == DftTypes.PAND || type == DftTypes.POR) {
		// Name and Pic
		$('#pic').css('background-size', '37.5px 49.98px');
		$('#pic').css('left', '92px');
		if (type == DftTypes.AND) {
		$('#pic').css('background-image', 'url("img/andInv.png")');
		document.getElementById('name-div').innerHTML = element.data('name');
		} else if (type == DftTypes.OR) {
		$('#pic').css('background-image', 'url("img/orInv.png")');
		document.getElementById('name-div').innerHTML = element.data('name');	
		} else if (type == DftTypes.PAND) {
		$('#pic').css('background-image', 'url("img/pandInv.png")');
		document.getElementById('name-div').innerHTML = element.data('name');
		} else {
		$('#pic').css('background-image', 'url("img/porInv.png")');
		document.getElementById('name-div').innerHTML = element.data('name');
		}
	} else if (type == DftTypes.SPARE) {
		// Name and Pic
		$('#pic').css('background-image', 'url("img/spare.png")');
		$('#pic').css('background-size', '100px 50px');
		$('#pic').css('left', '62.5px');
		document.getElementById('name-div').innerHTML = element.data('name');
	} else if (type == DftTypes.FDEP) {
		// Name and Pic
		$('#pic').css('background-image', 'url("img/fdep.png")');
		$('#pic').css('background-size', '100px 50px');
		$('#pic').css('left', '62.5px');
		document.getElementById('name-div').innerHTML = element.data('name');
	} else if (type == DftTypes.SEQ) {
		// Name and Pic
		$('#pic').css('background-image', 'url("img/seqInv.png")');
		$('#pic').css('background-size', '100px 50px');
		$('#pic').css('left', '62.5px');
		document.getElementById('name-div').innerHTML = element.data('name');
	}
 	
	$('#box').dialog('open');
}


function prepareParents(elem) {
	document.getElementById('scroll-type').innerHTML = 'Parents';

	var parents = createParentStrings(elem);

	var string = '<select id="selectMenu">';
	for (var i = parents.length - 1; i >= 0; i--) {
		string += '<option value="' + parents[i].id + '">' + parents[i].name + '</option>';
	}
	string += '</select>';
	document.getElementById('select-menu').innerHTML = string;
}

function prepareChildren(elem) {
	document.getElementById('scroll-type').innerHTML = 'Children';
	
	var children = elem.data('children');
	
	var string = '<select id="selectMenu">';
	for (var i = children.length - 1; i >= 0; i--) {
		string += '<option value="' + cy.getElementById(children[i]).data('id') + '">' + cy.getElementById(children[i]).data('name') + '</option>';
	}
	string += '</select>';
	document.getElementById('select-menu').innerHTML = string;
}

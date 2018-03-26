


function fillInfoBox(element) {
	
	var type = element.data('type');

	// Fill in all information before showing div
	document.getElementById('name-info').innerHTML = element.data('name');
	document.getElementById('element-id').innerHTML = element.data('id');

	if (type == DftTypes.BE) {
		document.getElementById('failure-rate').innerHTML = element.data('rate');
		document.getElementById('repair-rate').innerHTML = element.data('repair');
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
		document.getElementById('type').innerHTML = 'BE';

	} else {
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
		document.getElementById('type').innerHTML = 'VOT';
	} else document.getElementById('threshold-value').innerHTML = '-';

	if (type == DftTypes.PDEP) {
		document.getElementById('probability-value').innerHTML = element.data('probability');
		// Name and Pic
		$('#pic').css('background-image', 'url("img/pdep.png")');
		$('#pic').css('background-size', '100px 50px');
		$('#pic').css('left', '62.5px');
		document.getElementById('type').innerHTML = 'PDEP';
	} else document.getElementById('probability-value').innerHTML = '-';

	if (type == DftTypes.BOT) {
		document.getElementById('childrens-count').innerHTML = '-';
		document.getElementById('parents-count').innerHTML = '-';

		// Name and Pic
		$('#pic').css('background-image', 'url("img/bot.png")');
		$('#pic').css('background-size', '42px 42px');
		$('#pic').css('left', '90px');
		document.getElementById('type').innerHTML = 'BOTTOM';
	} else if (type == DftTypes.AND || type == DftTypes.OR || type == DftTypes.PAND || type == DftTypes.POR) {
		// Name and Pic
		$('#pic').css('background-size', '37.5px 49.98px');
		$('#pic').css('left', '92px');
		if (type == DftTypes.AND) {
		$('#pic').css('background-image', 'url("img/andInv.png")');
		document.getElementById('type').innerHTML = 'AND';
		} else if (type == DftTypes.OR) {
		$('#pic').css('background-image', 'url("img/orInv.png")');
		document.getElementById('type').innerHTML = 'OR';	
		} else if (type == DftTypes.PAND) {
		$('#pic').css('background-image', 'url("img/pandInv.png")');
		document.getElementById('type').innerHTML = 'PAND';
		} else {
		$('#pic').css('background-image', 'url("img/porInv.png")');
		document.getElementById('type').innerHTML = 'POR';
		}
	} else if (type == DftTypes.SPARE) {
		// Name and Pic
		$('#pic').css('background-image', 'url("img/spare.png")');
		$('#pic').css('background-size', '100px 50px');
		$('#pic').css('left', '62.5px');
		document.getElementById('type').innerHTML = 'SPARE';
	} else if (type == DftTypes.FDEP) {
		// Name and Pic
		$('#pic').css('background-image', 'url("img/fdep.png")');
		$('#pic').css('background-size', '100px 50px');
		$('#pic').css('left', '62.5px');
		document.getElementById('type').innerHTML = 'FDEP';
	} else if (type == DftTypes.SEQ) {
		// Name and Pic
		$('#pic').css('background-image', 'url("img/seqInv.png")');
		$('#pic').css('background-size', '100px 50px');
		$('#pic').css('left', '62.5px');
		document.getElementById('type').innerHTML = 'SEQ';
	}
 	
	$('#box').css('display', 'block');
}


function prepareParents(elem) {
	document.getElementById('scroll-type').innerHTML = 'Parents';
}

function prepareChildren(elem) {
	document.getElementById('scroll-type').innerHTML = 'Children';
	document.getElementById('select-menu').innerHTML = '<select></select>';
	var children = elem.data('children');
	var selectValues = new Map();

	for (var i = 1; i < children.length + 1; i++) {
		selectValues.set(i,cy.getElementById(children[i-1]).data('name'));
	}

	$.each(selectValues, function(key, value) {
	     $('#select-menu')
	          .append($('<option>', { value : key })
	          .text(value));
	});

}



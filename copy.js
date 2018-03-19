/*   ________________________________________________________________________________
 *  |Code for copy and paste (clone) of subbranches in a DFT.                        |
 *  |________________________________________________________________________________|
 */  

function copyPaste(node) {

	if (node.data('type') == DftTypes.BE) {
		var copy = createBe('cloneOf_' + node.data('name'), node.data('rate'), node.data('repair'), node.data('dorm'), node.position('x') + 50, node.position('y') + 50);
		createNode(copy);		
	} 
	else if (node.data('type') == DftTypes.BOT) {
		var copy = createBot('cloneOf_' + node.data('name'), node.position('x') + 150, node.position('y') + 150);
		createNode(copy);
	} else {

		// Map for getting new Ids to recreate edges
		var idMap = new Map();

		var collection = cy.collection();
		collection = collection.add(node.successors());

		// Copy nodes into compound node (for better visualization)
		var topElement = createGate(node.data('type'), 'cloneOf_' + node.data('name'), node.position('x') + 150, node.position('y') + 150);
		var compound = createCompoundNode(topElement);
		var topNode = createNode(topElement, compound);

		// Insert new Id of top 
		idMap.set(node.data('id'), parseInt(topNode.data('id')));

		collection.forEach( function(node) {
				if (node.isNode()) {
					if (node.data('type') == DftTypes.BE) {
						var elem = createBe('cloneOf_' + node.data('name'), node.data('rate'), node.data('repair'), node.data('dorm'), node.position('x') + 150, node.position('y') + 150);
						createNode(elem, compound);
						idMap.set(node.data('id'), currentId);
					}
					else if (node.data('type') == DftTypes.BOT) {
						var elem = createBot('cloneOf_' + node.data('name'), node.position('x') + 150, node.position('y') + 150);
						createNode(elem, compound);
						idMap.set(node.data('id'), currentId);
					}
					else if (node.data('type') == DftTypes.VOT) {
						var elem = createVotingGate('cloneOf_' + node.data('name'), node.data('voting'), node.position('x') + 150, node.position('y') + 150);
						createNode(elem, compound);
						idMap.set(node.data('id'), currentId);						
					}
					else if (node.data('type') == DftTypes.PDEP) {
						var elem = createPDEPGate('cloneOf_' + node.data('name'), node.data('probability'), node.position('x') + 150, node.position('y') + 150);
						createNode(elem, compound);
						idMap.set(node.data('id'), currentId);
					}
					else {
						var elem = createGate(node.data('type'), 'cloneOf_' + node.data('name'), node.position('x') + 150, node.position('y') + 150);
						createNode(elem, compound);
						idMap.set(node.data('id'), currentId);						
					}
				}
		});

		// Recreate edges
		collection.forEach( function(node) {
				if (node.isEdge()) {
					var source = node.data('source');
					var target = node.data('target');

					// Get new Ids with idMap
					var cloneSource = idMap.get(source);
					var cloneTarget = idMap.get(target);

					createEdge(cy.getElementById(cloneSource), cy.getElementById(cloneTarget));
				}
		});

		idMap.clear();
	}



}


	
	config.initpage = function(gridNode){
		var event = gridNode.event;
		event.on('beforecreate', function(event) {
			var page = event.grid;
			var funTree = Ext.getCmp('tree_rpt_list');
			var moduleId = funTree.selModel.selNode.id;
			page.getStore().getAt(0).set('rpt_list__module_id', moduleId);
		});
	};
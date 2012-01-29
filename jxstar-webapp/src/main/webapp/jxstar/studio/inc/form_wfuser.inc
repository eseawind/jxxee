	config.initpage = function(formNode){
		var event = formNode.event;
		
		event.on('beforecreate', function(event) {
			//取过程ID
			var fpage = Ext.getCmp('node_wf_nodeattr_form');
			var nodeId = fpage.getForm().get('wf_nodeattr__node_id');
			var processId = fpage.getForm().get('wf_nodeattr__process_id');
			
			//给分配用户设置过程ID
			formNode.page.getForm().set('wf_user__node_id', nodeId);
			formNode.page.getForm().set('wf_user__process_id', processId);
		});
	};
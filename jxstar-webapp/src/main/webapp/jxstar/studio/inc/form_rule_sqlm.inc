	config.initpage = function(formNode){
		var event = formNode.event;
		
		event.on('beforecreate', function(event) {
			//JxHint.alert(formNode.pageType);
			var gfun = Ext.getCmp('node_sys_fun_base_editgrid');
			var records = gfun.getSelectionModel().getSelections();
			if (records.length == 0) return;
			
			var fkv = records[0].get('fun_base__fun_id');
			if (formNode.pageType == 'form') {
				var field = formNode.page.getForm().findField('fun_rule_sql__src_funid');
				field.setValue(fkv);
				field.disable();
			} else {
				var field = formNode.page.getForm().findField('fun_rule_sql__dest_funid');
				field.setValue(fkv);
				field.disable();
			}
		});
		
		event.initOther = function() {
			if (formNode.pageType == 'form') {
				var field = formNode.page.getForm().findField('fun_rule_sql__src_funid');
				field.disable();
			} else {
				var field = formNode.page.getForm().findField('fun_rule_sql__dest_funid');
				field.disable();
			}
		};
	};
Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
		var items = [{
		height: '97%',
		width: '97%',
		border: false,
		layout: 'form',
		style: 'padding:10px;',
		items: [{
			anchor:'100%',
			border: false,
			layout:'column',
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.33,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'textfield', fieldLabel:'来源功能ID', name:'fun_rule_sql__src_funid', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', anchor:'100%', maxLength:25},
					{xtype:'textfield', fieldLabel:'目标功能ID', name:'fun_rule_sql__dest_funid', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', anchor:'100%', maxLength:25}
				]
			},{
				border:false,
				columnWidth:0.33,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'textfield', fieldLabel:'触发事件', name:'fun_rule_sql__event_code', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', anchor:'100%', maxLength:100},
					{xtype:'textfield', fieldLabel:'路由ID', name:'fun_rule_sql__route_id', readOnly:true, anchor:'100%', maxLength:25}
				]
			},{
				border:false,
				columnWidth:0.33,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'hidden', fieldLabel:'操作类型', name:'fun_rule_sql__do_type', defaultval:'insert', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'规则ID', name:'fun_rule_sql__rule_id', anchor:'100%'}
				]
			}
			]
		},{
			anchor:'100%',
			border: false,
			layout:'column',
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.99,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'textarea', fieldLabel:'来源数据SQL', name:'fun_rule_sql__src_sql', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', width:'100%', height:72, maxLength:400},
					{xtype:'textarea', fieldLabel:'目标更新SQL', name:'fun_rule_sql__dest_sql', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', width:'100%', height:72, maxLength:400}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'rule_sqlm'
	};

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
	
	return new Jxstar.FormNode(config);
}
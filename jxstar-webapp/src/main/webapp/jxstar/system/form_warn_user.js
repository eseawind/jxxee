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
					{xtype:'textfield', fieldLabel:'用户姓名', name:'warn_user__user_name', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'textfield', fieldLabel:'部门名称', name:'sys_dept__dept_name', readOnly:true, anchor:'100%', maxLength:100},
					{xtype:'hidden', fieldLabel:'用户ID', name:'warn_user__user_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'上报ID', name:'warn_user__warn_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.33,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'textfield', fieldLabel:'用户编码', name:'sys_user__user_code', readOnly:true, anchor:'100%', maxLength:100},
					{xtype:'textfield', fieldLabel:'部门编码', name:'sys_dept__dept_code', readOnly:true, anchor:'100%', maxLength:100},
					{xtype:'hidden', fieldLabel:'部门ID', name:'sys_dept__dept_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'分配ID', name:'warn_user__user_detid', anchor:'100%'}
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
					{xtype:'textarea', fieldLabel:'分配条件', name:'warn_user__condition', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', width:'100%', height:96, maxLength:200}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'sys_warnuser'
	};

	
	
	return new Jxstar.FormNode(config);
}
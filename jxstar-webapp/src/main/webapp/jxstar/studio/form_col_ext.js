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
			border:true,
			xtype:'fieldset',
			title:'基本信息',
			collapsible:false,
			collapsed:false,
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.33,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'checkbox', fieldLabel:'选择同名赋值', name:'fun_colext__is_same', defaultval:'1', disabled:false, anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.33,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'checkbox', fieldLabel:'控件是否只读', name:'fun_colext__is_readonly', defaultval:'1', disabled:false, anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.33,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'checkbox', fieldLabel:'不允许重复值', name:'fun_colext__is_repeatval', defaultval:'0', disabled:false, anchor:'100%'}
				]
			}
			]
		},{
			anchor:'100%',
			border: false,
			layout:'column',
			border:true,
			xtype:'fieldset',
			title:'选择窗口',
			collapsible:false,
			collapsed:false,
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.99,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'textarea', fieldLabel:'WHERE子句', name:'fun_colext__where_sql', width:'100%', height:48, maxLength:500},
					{xtype:'textfield', fieldLabel:'WHERE参数值', name:'fun_colext__where_value', anchor:'100%', maxLength:200},
					{xtype:'textfield', fieldLabel:'WHERE参数类型', name:'fun_colext__where_type', anchor:'100%', maxLength:200},
					{xtype:'textfield', fieldLabel:'选择来源字段', name:'fun_colext__source_cols', defaultval:';', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', anchor:'100%', maxLength:200},
					{xtype:'textfield', fieldLabel:'选择目标字段', name:'fun_colext__target_cols', defaultval:';', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', anchor:'100%', maxLength:200},
					{xtype:'hidden', fieldLabel:'缺省显示数据', name:'fun_colext__is_showdata', defaultval:'1', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'可多选', name:'fun_colext__is_moreselect', defaultval:'0', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'字段ID', name:'fun_colext__col_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'字段扩展ID', name:'fun_colext__colext_id', anchor:'100%'}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'fun_colext'
	};

	
	
	return new Jxstar.FormNode(config);
}
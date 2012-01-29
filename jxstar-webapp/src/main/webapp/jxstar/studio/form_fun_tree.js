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
				columnWidth:0.495,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'textfield', fieldLabel:'数据表', name:'fun_tree__table_name', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', anchor:'100%', maxLength:50},
					{xtype:'textfield', fieldLabel:'节点ID字段', name:'fun_tree__node_id', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', anchor:'100%', maxLength:100},
					{xtype:'textfield', fieldLabel:'节点名字段', name:'fun_tree__node_name', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', anchor:'100%', maxLength:100},
					{xtype:'textfield', fieldLabel:'级别字段', name:'fun_tree__node_level', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', anchor:'100%', maxLength:100},
					{xtype:'textfield', fieldLabel:'目标过滤条件', name:'fun_tree__right_where', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', anchor:'100%', maxLength:100},
					{xtype:'textfield', fieldLabel:'树形标题', name:'fun_tree__tree_title', anchor:'100%', maxLength:50},
					{xtype:'hidden', fieldLabel:'显示含级别？', name:'fun_tree__has_level', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'是否为树', name:'fun_tree__is_tree', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'节点附加值', name:'fun_tree__node_other', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'目标功能ID', name:'fun_tree__right_funid', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'树形组ID', name:'fun_tree__team_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'树页面组名称', name:'fun_tree__team_name', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'属性前缀', name:'fun_tree__prop_prefix', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'目标页面布局', name:'fun_tree__right_layout', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'关联查询子句', name:'fun_tree__relat_select', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'textfield', fieldLabel:'树形功能ID', name:'fun_tree__self_funid', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', anchor:'100%', maxLength:25},
					{xtype:'textarea', fieldLabel:'WHERE子句', name:'fun_tree__self_where', width:'100%', height:48, maxLength:200},
					{xtype:'textfield', fieldLabel:'ORDER子句', name:'fun_tree__self_order', anchor:'100%', maxLength:100},
					{xtype:'textfield', fieldLabel:'数据源名', name:'fun_tree__db_name', anchor:'100%', maxLength:20},
					{xtype:'hidden', fieldLabel:'叶标志字段', name:'fun_tree__child_field', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'目标窗口', name:'fun_tree__right_target', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'是否有子节点字段', name:'fun_tree__is_defteam', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'所属功能ID', name:'fun_tree__fun_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'初始显示数据？', name:'fun_tree__show_data', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'树层级', name:'fun_tree__tree_level', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'关联字段', name:'fun_tree__relat_col', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'树形ID', name:'fun_tree__tree_id', anchor:'100%'}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'fun_tree'
	};

	
	
	return new Jxstar.FormNode(config);
}
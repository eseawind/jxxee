Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var nodeclsData = Jxstar.findComboData('nodecls');
	var treetypeData = Jxstar.findComboData('treetype');
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
			title:'基础信息',
			collapsible:false,
			collapsed:false,
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
					{xtype:'textfield', fieldLabel:'目标过滤条件', name:'fun_tree__right_where', anchor:'100%', maxLength:100},
					{xtype:'textfield', fieldLabel:'树形标题', name:'fun_tree__tree_title', anchor:'100%', maxLength:50},
					{xtype:'checkbox', fieldLabel:'是否含本级', name:'fun_tree__has_level', defaultval:'0', disabled:false, anchor:'100%'}
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
					{xtype:'textfield', fieldLabel:'节点附加值', name:'fun_tree__node_other', anchor:'100%', maxLength:100},
					{xtype:'hidden', fieldLabel:'树形ID', name:'fun_tree__tree_id', anchor:'62%'},
					{xtype:'hidden', fieldLabel:'所属功能ID', name:'fun_tree__fun_id', anchor:'62%'}
				]
			}
			]
		},{
			anchor:'100%',
			border: false,
			layout:'column',
			border:true,
			xtype:'fieldset',
			title:'多级树信息',
			collapsible:false,
			collapsed:false,
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.495,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'textfield', fieldLabel:'树序号', name:'fun_tree__tree_no', defaultval:'1', anchor:'100%', maxLength:1},
					{xtype:'combo', fieldLabel:'节点样式', name:'fun_tree__node_style',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: nodeclsData
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: nodeclsData[0][0]},
					{xtype:'textfield', fieldLabel:'树形组标志', name:'fun_tree__team_id', defaultval:'A', anchor:'100%', maxLength:25}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'combo', fieldLabel:'树类型', name:'fun_tree__tree_type', defaultval:'0',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: treetypeData
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: treetypeData[0][0]},
					{xtype:'textfield', fieldLabel:'关联查询字段', name:'fun_tree__relat_col', anchor:'100%', maxLength:50},
					{xtype:'checkbox', fieldLabel:'不检查子级', name:'fun_tree__not_check', defaultval:'0', disabled:false, anchor:'100%'}
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
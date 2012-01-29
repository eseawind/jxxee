Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'数据表', width:114, sortable:true}, field:{name:'fun_tree__table_name',type:'string'}},
	{col:{header:'节点名字段', width:111, sortable:true}, field:{name:'fun_tree__node_name',type:'string'}},
	{col:{header:'节点ID字段', width:100, sortable:true}, field:{name:'fun_tree__node_id',type:'string'}},
	{col:{header:'级别字段', width:100, sortable:true}, field:{name:'fun_tree__node_level',type:'string'}},
	{col:{header:'叶标志字段', width:100, sortable:true, hidden:true}, field:{name:'fun_tree__child_field',type:'string'}},
	{col:{header:'节点附加值', width:100, sortable:true, hidden:true}, field:{name:'fun_tree__node_other',type:'string'}},
	{col:{header:'目标过滤条件', width:208, sortable:true}, field:{name:'fun_tree__right_where',type:'string'}},
	{col:{header:'WHERE子句', width:184, sortable:true}, field:{name:'fun_tree__self_where',type:'string'}},
	{col:{header:'ORDER子句', width:139, sortable:true}, field:{name:'fun_tree__self_order',type:'string'}},
	{col:{header:'树形标题', width:100, sortable:true}, field:{name:'fun_tree__tree_title',type:'string'}},
	{col:{header:'树形功能ID', width:100, sortable:true, hidden:true}, field:{name:'fun_tree__self_funid',type:'string'}},
	{col:{header:'显示含级别？', width:100, sortable:true, hidden:true}, field:{name:'fun_tree__has_level',type:'string'}},
	{col:{header:'目标功能ID', width:100, sortable:true, hidden:true}, field:{name:'fun_tree__right_funid',type:'string'}},
	{col:{header:'目标页面布局', width:100, sortable:true, hidden:true}, field:{name:'fun_tree__right_layout',type:'string'}},
	{col:{header:'目标窗口', width:100, sortable:true, hidden:true}, field:{name:'fun_tree__right_target',type:'string'}},
	{col:{header:'数据源名', width:100, sortable:true, hidden:true}, field:{name:'fun_tree__db_name',type:'string'}},
	{col:{header:'初始显示数据？', width:100, sortable:true, hidden:true}, field:{name:'fun_tree__show_data',type:'string'}},
	{col:{header:'所属功能ID', width:100, sortable:true, hidden:true}, field:{name:'fun_tree__fun_id',type:'string'}},
	{col:{header:'是否为树', width:100, sortable:true, hidden:true}, field:{name:'fun_tree__is_tree',type:'string'}},
	{col:{header:'树形组ID', width:100, sortable:true, hidden:true}, field:{name:'fun_tree__team_id',type:'string'}},
	{col:{header:'树形ID', width:100, sortable:true, hidden:true}, field:{name:'fun_tree__tree_id',type:'string'}},
	{col:{header:'关联字段', width:100, sortable:true, hidden:true}, field:{name:'fun_tree__relat_col',type:'string'}},
	{col:{header:'树页面组名称', width:100, sortable:true, hidden:true}, field:{name:'fun_tree__team_name',type:'string'}},
	{col:{header:'是否有子节点字段', width:100, sortable:true, hidden:true}, field:{name:'fun_tree__is_defteam',type:'string'}},
	{col:{header:'树层级', width:100, sortable:true, hidden:true}, field:{name:'fun_tree__tree_level',type:'string'}},
	{col:{header:'属性前缀', width:100, sortable:true, hidden:true}, field:{name:'fun_tree__prop_prefix',type:'string'}},
	{col:{header:'关联查询子句', width:100, sortable:true, hidden:true}, field:{name:'fun_tree__relat_select',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'fun_tree'
	};
	
	
		
	return new Jxstar.GridNode(config);
}
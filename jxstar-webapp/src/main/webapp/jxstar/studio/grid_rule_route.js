Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'目标功能ID', width:113, sortable:true}, field:{name:'fun_rule_route__fun_id',type:'string'}},
	{col:{header:'来源功能ID', width:120, sortable:true}, field:{name:'fun_rule_route__src_funid',type:'string'}},
	{col:{header:'来源功能Where', width:328, sortable:true}, field:{name:'fun_rule_route__where_sql',type:'string'}},
	{col:{header:'参数类型', width:149, sortable:true, hidden:true}, field:{name:'fun_rule_route__where_type',type:'string'}},
	{col:{header:'页面参数名', width:154, sortable:true, hidden:true}, field:{name:'fun_rule_route__where_value',type:'string'}},
	{col:{header:'路由ID', width:100, sortable:true, hidden:true}, field:{name:'fun_rule_route__route_id',type:'string'}},
	{col:{header:'导入布局', width:230, sortable:true}, field:{name:'fun_rule_route__layout_page',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'rule_route'
	};
	
	
		
	return new Jxstar.GridNode(config);
}
Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var dotypeData = Jxstar.findComboData('dotype');

	var cols = [
	{col:{header:'目标功能ID', width:100, sortable:true}, field:{name:'fun_rule_sql__dest_funid',type:'string'}},
	{col:{header:'目标更新SQL', width:336, sortable:true}, field:{name:'fun_rule_sql__dest_sql',type:'string'}},
	{col:{header:'来源功能ID', width:112, sortable:true}, field:{name:'fun_rule_sql__src_funid',type:'string'}},
	{col:{header:'来源数据SQL', width:198, sortable:true}, field:{name:'fun_rule_sql__src_sql',type:'string'}},
	{col:{header:'触发事件', width:77, sortable:true}, field:{name:'fun_rule_sql__event_code',type:'string'}},
	{col:{header:'操作类型', width:67, sortable:true, hidden:true, align:'center',
		renderer:function(value){
			for (var i = 0; i < dotypeData.length; i++) {
				if (dotypeData[i][0] == value)
					return dotypeData[i][1];
			}
		}}, field:{name:'fun_rule_sql__do_type',type:'string'}},
	{col:{header:'规则ID', width:100, sortable:true, hidden:true}, field:{name:'fun_rule_sql__rule_id',type:'string'}},
	{col:{header:'路由ID', width:81, sortable:true}, field:{name:'fun_rule_sql__route_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'rule_sqlm'
	};
	
	
		
	return new Jxstar.GridNode(config);
}
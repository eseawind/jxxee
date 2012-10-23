﻿Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'文件名称', width:246, sortable:true}, field:{name:'sys_attach__attach_name',type:'string'}},
	{col:{header:'附件ID', width:100, sortable:true, hidden:true}, field:{name:'sys_attach__attach_id',type:'string'}},
	{col:{header:'记录ID', width:100, sortable:true, hidden:true}, field:{name:'sys_attach__data_id',type:'string'}},
	{col:{header:'表名', width:100, sortable:true, hidden:true}, field:{name:'sys_attach__table_name',type:'string'}},
	{col:{header:'附件路径', width:100, sortable:true, hidden:true}, field:{name:'sys_attach__attach_path',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '1',
		funid: 'sys_docqry'
	};
	
	config.param.selectModel = 'nocheck';

	//把文件名称改为超链接
		
	return new Jxstar.GridNode(config);
}
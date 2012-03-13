﻿Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'任务名称', width:260, sortable:true}, field:{name:'wf_instance__process_name',type:'string'}},
	{col:{header:'任务数量', width:120, sortable:true, renderer:JxUtil.formatInt()}, field:{name:'process_num',type:'int'}},
	{col:{header:'过程ID', width:100, sortable:true, hidden:true}, field:{name:'wf_instance__process_id',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, hidden:true}, field:{name:'wf_assign__fun_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'wf_assign_num'
	};
	
	//把任务数量字段值改为超链接
	var renderTask = function(val, metaData, record) {
		var funId = record.get('wf_assign__fun_id');
		var userId = JxDefault.getUserId();
		
		var chgcolor = 'onmouseover="this.style.color=\'#FF4400\';" onmouseout="this.style.color=\'#0080FF\';"';
		var html = '<a href="#" style=\'color:#0080FF;\' '+ chgcolor +' onclick="JxUtil.showCheckData(\''+ funId +'\', \'\', \''+ userId +'\');">&nbsp;'+ val +'&nbsp;</a>';
		return html;
	};
	
	//把第2列的值改为超链接
	cols[0].col.renderer = renderTask;
	cols[1].col.renderer = renderTask;
	
	//不需要复选模式
	config.param.selectModel = 'row';
	
	config.initpage = function(gridNode){
		var grid = gridNode.page;
		
		var wsql = 'wf_assign.assign_userid = ?';
		var wvalue = JxDefault.getUserId();
		var wtype = 'string';
		Jxstar.loadData(grid, {where_sql:wsql, where_value:wvalue, where_type:wtype, has_page:'0'});
	};
		
	return new Jxstar.GridNode(config);
}
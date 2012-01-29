/*!
 * Copyright 2008-2011 the original author or authors.
 * Licensed under the Apache License, Version 2.0
 */
 
/**
 * 调用类设置功能布局，采用上下GRID布局。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

Jxstar.currentPage = function() {
	var funid = 'event_invoke';

	//创建事件功能布局面板
	var funLayout = new Ext.Panel({
		border:false,
		layout:'border',
		items:[{
			pagetype:'grid',
			autoScroll:true,
			region:'center',
			layout:'fit',
			border:false
		},{
			pagetype:'subgrid',
			region:'south',
			layout:'fit',
			height:240,
			split:true,
			border:false
		}]
	});
	
	//创建数据页面
	Jxstar.createPage(funid, 'gridpage', funLayout.getComponent(0));
	var pageParam = {pageType:'subgrid', parentNodeId:funid};
	Jxstar.createPage('event_param', 'gridpage', funLayout.getComponent(1), pageParam);

	//显示数据
	JxUtil.delay(1000, function(){
		var igrid = funLayout.getComponent(0).getComponent(0);//类表
		var pgrid = funLayout.getComponent(1).getComponent(0);//参数表
		
		var selectRow = function(g){
			g.getSelectionModel().selectFirstRow();
			g.fireEvent('rowclick', g, 0);
		};
		igrid.getStore().on('load', function(s){
			selectRow(igrid);
		});
		
		//点击调用类，显示调用参数
		igrid.on('rowclick', function(g, n, e){
			var record = g.getStore().getAt(n);
			if (record == null) return false;
			
			//外键值
			var fkval = record.get('fun_event_invoke__invoke_id');
			//加载数据
			Jxstar.loadSubData(pgrid, fkval);
		});
		selectRow(igrid);
	});

	return funLayout;
}
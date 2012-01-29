/*!
 * Copyright 2008-2011 the original author or authors.
 * Licensed under the Apache License, Version 2.0
 */
 
/**
 * 报表设计器功能布局。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

Jxstar.currentPage = function() {
	var funid = 'rpt_list';

	//创建TAB功能布局面板
	var tabFunction = new Ext.TabPanel({
		region:'center',
		border:false,
		closeAction:'close',
		activeTab:0,
		items:[{
			pagetype:'grid',
			title: jx.rpt.define,	//'报表定义列表',
			autoScroll:true,
			layout:'fit',
			border:false,
			iconCls:'tabs'
		},{
			pagetype:'reptdes',
			title: jx.rpt.design,	//'报表设计器',
			autoScroll:true,
			layout:'fit',
			border:false,
			iconCls:'tabs',
			tbar:new Ext.Toolbar({deferHeight:true, items:[{text:' '}]})
		}]
	});
	
	Jxstar.createPage(funid, 'gridpage', tabFunction.getComponent(0));
	
	tabFunction.on('beforetabchange', function(tabPanel, newTab, currentTab){
		//取主界面的功能列表
		var fgp = tabPanel.getComponent(0);
		if (fgp == null) return false;
		//tab打开时为空
		if (fgp.items == null) return true;
		var fgrid = fgp.getComponent(0);
		if (fgrid == null) return false;
		
		var pagetype = newTab.pagetype;
		var records = fgrid.getSelectionModel().getSelections();
		if (records.length == 0 && pagetype != 'grid') {
			JxHint.alert(jx.layout.selmain);	//'请选择一条主记录！'
			return false;
		}
		return true;
	});

	tabFunction.on('tabchange', function(tabPanel, activeTab){
		//取当前激活的Tab页面类型
		var pagetype = activeTab.pagetype;
		//处理有些页面没有自动显示的问题
		activeTab.doLayout();
		//取主界面的功能列表
		var fgp = tabPanel.getComponent(0);
		if (fgp == null) return false;
		var fgrid = fgp.getComponent(0);
		if (fgrid == null) return false;
		
		//取选择的报表ID
		var reportId = '';
		var records = fgrid.getSelectionModel().getSelections();
		if (records.length >= 1) {
			reportId = records[0].get('rpt_list__report_id');
		} else {
			if (pagetype != 'grid') {
				JxHint.alert(jx.layout.selmain);	//'请选择一条主记录！'
				return false;
			}
		}
		var activePanel = activeTab.getComponent(0);

		//显示报表设计器
		if (pagetype == 'reptdes') {
			//取创建页面的函数
			var hdCall = function(f) {
				var pe = tabFunction.getComponent(1);
				f.render(reportId, pe);
			};
			
			//异步从JS文件加载功能对象
			Request.loadJS('/jxstar/studio/pub/designer_rept.js', hdCall);
		}
	});
	
	//如果设计面板隐藏时，则需要关闭所有设计对话框
	var closeWin = function() {
		//清除当前对象的参数
		var selDiv = Ext.get('sel_rpttddiv');
		if (selDiv != null) {
			selDiv.curTd = null;
			selDiv.curRecord = null;
			selDiv.oldRecord = null;
		}
	
		var detGrid = Ext.getCmp('node_rpt_detail_subeditgrid');
		if (detGrid != null) {
			detGrid.ownerCt.close();
		}
		var areaGrid = Ext.getCmp('node_rpt_area_subgrid');
		if (areaGrid != null) {
			areaGrid.ownerCt.close();
		}
		var headGrid = Ext.getCmp('node_rpt_head_subeditgrid');
		if (headGrid != null) {
			headGrid.ownerCt.close();
		}
	};
	var desPanel = tabFunction.getComponent(1);
	desPanel.on('hide', closeWin);
	desPanel.on('destroy', closeWin);
			   
	var funLayout = new Ext.Panel({
		border:false,
		layout:'border',
		items:[{
			region:'west',
			layout:'fit',
			width:160,
			split:true,
			border:false
		},{
			region:'center',
			layout:'fit',
			border:false,
			items:[tabFunction]
		}]
	});
	Jxstar.createTree(funid, funLayout);

	return funLayout;
}
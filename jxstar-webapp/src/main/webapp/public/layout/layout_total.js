/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
  
/**
 * 统计功能模板
 * 
 * @author TonyTan
 * @version 1.0, 2011-01-01
 */

Jxstar.currentPage = function(define, pageParam) {
	if (define == null) {
		JxHint.alert('layout_total define param define is null!');
		return;
	}
	var funid = define.nodeid;
	
	//动态加载JS文件
	if (!window.JxTotalGrid) {
		JxUtil.loadJS('/public/layout/ux/total_grid.js', true);
		JxUtil.loadJS('/public/lib/ext/ux/ColumnHeaderGroup.js', true);
	}
	//创建临时数据面板，从后台到数据后将替换模板内容
	var tmpPanel = new Ext.Panel({border:false,layout:'fit'});
	
	//构建统计报表{toolfn:fn, cols:[{col_code:, display:, format:, combo_code:, is_show:, col_width:},...]}
	var hdcall = function(config) {
		if (config.toolfn == null) {
			JxHint.alert('构建统计工具栏的参数错误！');
			return;
		}
		if (config.cols == null || config.cols.length == 0) {
			JxHint.alert('构建统计表格的参数错误！');
			return;
		}
		
		config.nodeid = funid;
		var grid = JxTotalGrid.createGrid(config);
		tmpPanel.add(grid);
		tmpPanel.doLayout();
	};
	
	//调用后台取统计报表的条件与统计列
	var params = 'funid=rpt_list&pagetype=grid&eventcode=totalgrid&rpt_funid=' + funid;
	Request.postRequest(params, hdcall);
	
	return tmpPanel;
};

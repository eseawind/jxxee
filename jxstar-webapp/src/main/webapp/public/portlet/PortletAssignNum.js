/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the GNU GPL Version 3.0
 */
 
/**
 * 待办任务portlet控件。
 * 
 * @author TonyTan
 * @version 1.0, 2011-10-19
 */

PortletAssignNum = {};
(function(){

	Ext.apply(PortletAssignNum, {
	/**
	 * public
	 * 父对象
	 **/
	ownerCt:null,
	
	/**
	 * public
	 * 刷新窗口内容
	 **/
	refresh: function() {
		if (this.ownerCt) {
			var grid = this.ownerCt.getComponent(0);
			//加载当前用户的分配任务
			var wsql = 'assign_userid = ?';
			var wvalue = JxDefault.getUserId();
			var wtype = 'string';
			Jxstar.loadData(grid, {where_sql:wsql, where_value:wvalue, where_type:wtype, has_page: '0'});
		}
	},
	
	/**
	 * public
	 * 显示结果集表格
	 **/
	showPortlet: function(target) {
		var self = this;
		if (target == null) {
			JxHint.alert(jx.plet.noparent);	//'显示PORTLET的容器对象为空！'
			return;
		}
		this.ownerCt = target;
		//先清除内容
		target.removeAll(target.getComponent(0), true);

		//取创建页面的函数
		var hdCall = function(f) {
			var page = f();
			if (typeof page.showPage == 'function') {
				page = page.showPage('notoolgrid');
			}

			//把新页面添加到目标窗口中
			target.add(page);
			//重新显示目标窗口
			target.doLayout();
			//加载当前用户的分配任务
			var wsql = 'assign_userid = ?';
			var wvalue = JxDefault.getUserId();
			var wtype = 'string';
			Jxstar.loadData(page, {where_sql:wsql, where_value:wvalue, where_type:wtype, has_page: '0'});
		};

		Request.loadJS('/jxstar/studio/grid_wfassign_num.js', hdCall);
	}
	
	});//Ext.apply

	//5分钟刷新一次
	Ext.TaskMgr.start({
		run: function() {PortletAssignNum.refresh();},
		interval: 1000*60*5
	});
})();

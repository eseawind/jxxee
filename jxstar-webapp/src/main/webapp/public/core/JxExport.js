﻿/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 导出数据窗口控件。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

JxExport = {};
(function(){

	Ext.apply(JxExport, {
	/**
	* 显示导出数据的字段对话框
	* pageNode -- 当前功能的表格定义对象，用于取表格字段对象
	**/
	showWindow: function(pageNode) {
		//取字段信息
		var fieldNames = [], mycols = pageNode.param.cols;
		for (var i = 0, c = 0, n = mycols.length; i < n; i++){
			var mc = mycols[i].col, mf = mycols[i].field;
			if (mc && mf) {
				var h = mc.header;
				if (h.charAt(0) == '*') h = h.substr(1);
				fieldNames[c++] = [mf.name, h];
			}
		}
		
		var jxLists = new JxLists({leftData:fieldNames});
		var listPanel = jxLists.render();
		
		//创建对话框
		var win = new Ext.Window({
			title:jx.base.seltitle,	//选择导出字段
			layout:'fit',
			width:400,
			height:500,
			resizable: false,
			modal: true,
			closeAction:'close',
			items:[listPanel],

			buttons: [{
				text:jx.base.ok,	//确定
				handler:function(){
					var selfields = jxLists.getSelectData();
					if (selfields.length == 0) {
						JxHint.alert(jx.base.nofield);	//没有选择要导出数据的字段，不能导出！
						return false;
					}
		
					JxExport.executeExp(pageNode, selfields);
					win.close();
				}
			},{
				text:jx.base.cancel,	//取消
				handler:function(){win.close();}
			}]
		});
		win.show();
	},
	
	/**
	* 向后台发出导出数据请求
	* pageNode -- 当前功能的表格定义对象，用于取表格字段对象
	* selfields -- 选择字段的数据
	**/
	executeExp: function(pageNode, selfields) {
		var dsOption = pageNode.page.getStore().lastOptions.params || {};
		var funid = pageNode.nodeId;
		
		//请求参数
		var params = 'funid=sysevent&query_funid='+ funid;
		params += '&pagetype=grid&eventcode=expxls&dataType=xls';
		params += '&selfield='+selfields+'&zerotonull=0';
		//导出xls文件
		Request.expFile(params, dsOption);
	}

	});//Ext.apply

})();

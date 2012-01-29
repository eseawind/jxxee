/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the GNU GPL Version 3.0
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
		var where_sql = dsOption.where_sql || '';
		var where_value = dsOption.where_value || '';
		var where_type = dsOption.where_type || '';
		
		var funid = pageNode.nodeId;
		
		//请求参数
		var e = encodeURIComponent; //编码
		var params = 'funid=sysevent&query_funid='+ funid + '&user_id=' + Jxstar.session['user_id'];
		params += '&pagetype=grid&eventcode=expxls&dataType=xls';
		params += '&where_sql='+ e(where_sql) +'&where_value='+ e(where_value) +'&where_type='+where_type;
		params += '&selfield='+selfields+'&zerotonull=0';
		
		//发送后台请求
		var href = Jxstar.path + "/fileAction.do?" + params;
		document.getElementById('frmhidden').src = href;
	}

	});//Ext.apply

})();

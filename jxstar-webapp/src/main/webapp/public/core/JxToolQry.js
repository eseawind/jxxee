/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 查询方案定义工具类。
 * 
 * @author TonyTan
 * @version 1.0, 2012-04-17
 */

JxToolQry = {};
(function(){

	Ext.apply(JxToolQry, {
	//当前功能ID
	funid: '',
	//查询方案表格
	gridHis: null,
	//查询条件明细表格
	gridDet: null,
	//查询条件明细表的数据存储对象
	storeDet: null,
	
	/**
	* public 查询方案自定义界面
	* pageNode -- 当前功能的表格定义对象，用于取表格字段对象
	**/
	queryWindow: function(pageNode) {
		var self = this;
		self.funid = pageNode.nodeId;
		
		var	win = new Ext.Window({
			title:'自定义查询方案...',
			layout:'border',
			width: 750,
			height: 450,
			constrainHeader: true,
			resizable: false,
			modal: true,
			closeAction: 'close',
			defaults:{margins:'5 2 5 2'},
			items:[{
				xtype:'container',
				autoScroll:true,
				region:'west',
				layout:'fit',
				width:250,
				border:false
			},{
				xtype:'container',
				region:'center',
				layout:'fit',
				border:false
			}]
		});
		//构建表格对象
		Jxstar.createPage('sys_query', 'gridpage', win.getComponent(0));
		var param2 = {pageType:'subeditgrid', parentNodeId:'sys_query'};
		Jxstar.createPage('sys_qrydet', 'gridpage', win.getComponent(1), param2);
		
		//添加主从关系
		JxUtil.delay(500, function(){
			var mg = win.getComponent(0).getComponent(0);
			var sg = win.getComponent(1).getComponent(0);		
			
			mg.on('rowclick', function(g, n, e){
				var record = g.getStore().getAt(n);
				if (record == null) return false;
				
				var fkval = record.get('sys_query__query_id');
				Jxstar.loadSubData(sg, fkval);
			});
			mg.getStore().on('load', function(s){
				mg.getSelectionModel().selectFirstRow();
				mg.fireEvent('rowclick', mg, 0);
			})
			var options = {
				where_sql:"fun_id = ? and (is_share = '1' or user_id = ?)", 
				where_value:self.funid+';'+JxDefault.getUserId(), 
				where_type:'string;string'
			};
			Jxstar.loadData(mg, options);
			
			//记录当前功能ID
			mg.qryFunId = self.funid;
			sg.qryFunId = self.funid;
		});
		
		win.show();
		return win;
	},
	
	/**
	 * 显示所有可以查询的字段
	 */
	fieldGrid: function(pageNode) {
		//构建列表数据源
		var data = [], mycols = pageNode.param.cols;
		for (var i = 0, c = 0, n = mycols.length; i < n; i++){
			var mc = mycols[i].col, mf = mycols[i].field; 
			if (mc == null || mf == null) continue;
			
			var fn = mf.name, len = fn.length;
			if (mc && mf && (fn.substring(len-2) != 'id' || !mc.hidden)) {
				//可编辑表格的必填字段表头添加了*号，要去掉
				var h = mc.header;
				if (h.charAt(0) == '*') h = h.substr(1);
				var t = mf.type;
				data[c++] = [fn, h, t];
			}
		}
		
		var store = new Ext.data.ArrayStore({
			data: data,
			fields: ['colcode','title','coltype']
		});
		//创建字段列表对象
		var list = new Ext.ListView({
			border:true,
			store:store,
			columns:[{
				header: jx.fun.name, dataIndex: 'title'
			}]
		});
		return list;
	}

	});//Ext.apply

})();

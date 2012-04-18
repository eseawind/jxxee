/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
  
/**
 * 构建分组统计界面
 * 
 * @author TonyTan
 * @version 1.0, 2012-04-18
 */
JxGroupPage = {};
(function(){

	Ext.apply(JxGroupPage, {
	funId:'',
	selchars:[],
	selnums:[],
	groupPage:null,
	statGrid:null,
	
	/**
	* public 返回页面对象
	* 
	**/
	createPage: function(statId, funId) {
		var self = this;
		self.funId = funId;
		
		var	page = new Ext.Panel({
			layout:'border',
			items:[{
				xtype:'container',
				region:'north',
				layout:'fit',
				height:150
			},{
				xtype:'container',
				region:'center',
				layout:'border',
				style:'border-top:1px solid #99bbe8;',
				items:[{
					xtype:'container',
					region:'north',
					layout:'fit',
					height:100
				},{
					xtype:'container',
					region:'center',
					layout:'fit',
					style:'border-top:1px solid #99bbe8;'
				}]
			}]
		});
		
		self.groupPage = page;
		self.loadCase(statId);
		
		return page;
	},
	
	//从后台加载方案字段
	loadCase: function(statId, page) {
		var self = this;
		var endcall = function(data) {
			//alert(Ext.encode(data));
			var grid = self.createGrid(data);
			self.statGrid = grid;
			self.groupPage.getComponent(0).add(grid);
			self.groupPage.doLayout();
		};
		var params = 'funid=sys_stat&pagetype=grid&eventcode=selcase&keyid=' + statId;
		Request.postRequest(params, endcall);
	},
	
	//创建统计数据表格
	createGrid: function(config) {
		var self = this;
		//保存标题列与字段列
		var cm = [], cols = [], c = 0, f = 0;
	
		//取分组字段
		var charfields = '', chars = config.chars;
		for (var i = 0, n = chars.length; i < n; i++) {
			var text = chars[i].colname;
			var field = chars[i].colcode.split('__')[1];
			
			charfields += field + ',';
			
			self.selchars[i] = [field, text];
			cols[f++] = {name:field, type:'string'};
			cm[c++] = {header:text, width:150, dataIndex:field};
		}
		if (charfields.length > 0) {
			charfields = charfields.substr(0, charfields.length-1);
		}
		
		//取统计字段
		var numfields = '', nums = config.nums;
		for (var i = 0, n = nums.length; i < n; i++) {
			var text = nums[i].colname;
			var field = nums[i].colcode
			if (field != 'recordnum') {field = field.split('__')[1];}
			
			numfields += field + ',';
			
			self.selnums[i] = [field, text];
			cols[f++] = {name:field};
			cm[c++] = {header:text, width:100, dataIndex:field};
		}
		if (numfields.length > 0) {
			numfields = numfields.substr(0, numfields.length-1);
		}
		
		var params = 'funid=queryevent&query_funid='+ self.funId + '&pagetype=grid&eventcode=group_stat';
		params += '&charfield='+charfields+'&numfield='+numfields+'&user_id='+Jxstar.session['user_id'];

		//查询数据URL
		var url = Jxstar.path + '/commonAction.do?' + params;
		//创建数据对象
		var store = new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({
				method: 'POST',
				url: url,
				listeners: {exception: function(a, b, c, d, e, f){
					store.removeAll();
					
					//处理异常信息
					JxUtil.errorResponse(e);
				}}
			}),
			reader: new Ext.data.JsonReader({
				root: 'data.root',
				totalProperty: 'data.total'
			}, cols),
			remoteSort: true,
			pruneModifiedRecords: true
		});
		store.on('load', function(){
			var cmp = self.groupPage.getComponent(1);
			var group = self.createGroup();
			cmp.getComponent(0).add(group);
			var image = self.createImage();
			cmp.getComponent(1).add(image);
			self.groupPage.doLayout();
		});
		store.load();
		
		//创建表格对象
		var queryGrid = new Ext.grid.GridPanel({
			store: store,
			columns: cm,
			border: false,
			stripeRows: true,
			columnLines: true
		});
		return queryGrid;
	},
	
	//创建统计面板
	createGroup: function() {
		var self = this;
		//创建新的内容区
		var chartForm = new Ext.form.FormPanel({
			style:'padding:2px;',
			broder:false,
			baseCls: 'x-plain',
			items:[            {xtype: 'radiogroup',
			                   fieldLabel: 'Auto Layout',
			       			   width:'100%',
			                   items: [
			                       {boxLabel: 'Item 1', name: 'rb-auto', inputValue: 1},
			                       {boxLabel: 'Item 2', name: 'rb-auto', inputValue: 2, checked: true},
			                       {boxLabel: 'Item 3', name: 'rb-auto', inputValue: 3},
			                       {boxLabel: 'Item 4', name: 'rb-auto', inputValue: 4},
			                       {boxLabel: 'Item 5', name: 'rb-auto', inputValue: 5}
			                   ]},{xtype: 'radiogroup',
				                   fieldLabel: 'Auto Layout1',
				                   width:550,
				                   items: [
				                       {boxLabel: 'Item 1', name: 'rb-auto', inputValue: 1},
				                       {boxLabel: 'Item 2', name: 'rb-auto', inputValue: 2, checked: true},
				                       {boxLabel: 'Item 3', name: 'rb-auto', inputValue: 3},
				                       {boxLabel: 'Item 4', name: 'rb-auto', inputValue: 4},
				                       {boxLabel: 'Item 5', name: 'rb-auto', inputValue: 5}
				                   ]}
			                   /*
			       {
				xtype:'fieldset',
				title:jx.group.datafield,	//'数据字段'
				items:[{
					xtype:'combo', fieldLabel:jx.group.groupfield, //'分组字段:'
					name:'group_field', store: new Ext.data.SimpleStore({
						fields:['value','text'],
						data: self.selchars
					}),
					mode: 'local',
					triggerAction: 'all',
					valueField: 'value',
					displayField: 'text',
					editable:false, allowBlank:false, 
					value: self.selchars[0][0]
				},{
					xtype:'combo', fieldLabel:jx.group.statfield, 	//'统计字段:'
					name:'stat_field', store: new Ext.data.SimpleStore({
						fields:['value','text'],
						data: self.selnums
					}),
					mode: 'local',
					triggerAction: 'all',
					valueField: 'value',
					displayField: 'text',
					editable:false, allowBlank:false, 
					value: self.selnums[0][0]
				}]
			},{
				xtype:'fieldset',
				title:jx.group.chattype,	//'图表类型'
				items:[{
					xtype:'radiogroup',
					fieldLabel:jx.group.chattype+':',	//'图表类型'
					name:'chart_type',
					items:[
						{boxLabel:jx.group.pie, name:'chart_type', inputValue:'piechart', checked: true},	//'饼状'
						{boxLabel:jx.group.col, name:'chart_type', inputValue:'columnchart'},				//'柱状'
						{boxLabel:jx.group.line, name:'chart_type', inputValue:'linechart'}				//'线型'
					]
				}]
			}*/]
		});
		return chartForm;
	},
	
	//创建图形面板
	createImage: function() {
		var self = this;
		//统计数据
		var store = self.statGrid.getStore();
		//创建图表输出对象
		var chartPanel = JxGroup.createChartImage(store, self.selchars[0][0], self.selnums[0][0], 'columnchart');
		
		return chartPanel;
	}
	
	});//Ext.apply

})();
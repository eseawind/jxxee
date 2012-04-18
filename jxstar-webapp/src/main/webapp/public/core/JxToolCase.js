/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
  
/**
 * 构建查询工具栏控件
 * 
 * @author TonyTan
 * @version 1.0, 2012-04-16
 */
JxToolCase = {};
(function(){

	Ext.apply(JxToolCase, {
	
	initQrys:[['0', '--查询方案--'], ['1', '自定义...']],
	initStas:[['0', '--统计方案--'], ['1', '自定义...']],
		
	/**
	 * 构建查询方案选项控件
	 */
	showCase: function(nodeg) {
		var self = this, grid = nodeg.page;
		var tbar = grid.getTopToolbar();
		tbar.add('-');
		
		var qrys = self.initQrys;
		var qryid = JxUtil.newId() + '_qry';
		var qrycb = Jxstar.createCombo(qryid, qrys, 100);
		tbar.add(qrycb);
		qrycb.on('beforeselect', function(combo, record){
			var val = record.get('value');
			var oldv = combo.getValue();
			
			if (val == '1') {
				self.openToolQry(nodeg, combo);
			} else if (val != oldv && val != '0') {
				var endcall = function(data) {
					JxToolCase.renderToolQry(nodeg, data.qrycond);
				}
				var params = 'funid=sys_query&queryid=' + val +'&pagetype=grid&eventcode=selcase';
				Request.postRequest(params, endcall);
			}
		});
		//加载查询方案
		self.loadQryCase(nodeg, qrycb);
		
		var stas = self.initStas;
		var staid = JxUtil.newId() + '_sta';
		var stacb = Jxstar.createCombo(staid, stas, 100);
		tbar.add(stacb);
		stacb.on('beforeselect', function(combo, record){
			var val = record.get('value');
			var oldv = combo.getValue();
			
			if (val == '1') {
				JxToolStat.caseWin(nodeg);
			} else if (val != oldv && val != '0') {
				if (!window.JxGroupPage) {//动态同步加载该对象
					JxUtil.loadJS('/public/layout/ux/group_page.js', true);
				}
				var page = JxGroupPage.createPage(val, nodeg.nodeId);
				var	win = new Ext.Window({
					layout:'fit',
					width: 800,
					height: 600,
					constrainHeader: true,
					resizable: false,
					modal: true,
					closeAction: 'close',
					defaults:{margins:'5 2 5 2'},
					items:[page]
				});
				win.show();
			}
		});
		//加载统计方案
		JxToolStat.loadStaCase(nodeg, stacb);
	},
	
	/**
	 * 显示自定义查询方案
	 */
	openToolQry: function(nodeg, combo) {
		var win = this.queryWindow(nodeg);
		//关闭时重新加载查询方案
		win.on('destroy', function() {
			JxToolCase.loadQryCase(nodeg, combo);
		});
	},
	
	/**
	 * 从后台加载查询方案
	 */
	loadQryCase: function(nodeg, combo) {
		var endcall = function(data) {
			//alert(Ext.encode(data));
			//刷新查询方案
			var qrycase = data.qrycase, iqs = JxToolCase.initQrys;
			var qrys = [iqs[0], iqs[1]];
			Ext.each(qrycase, function(item){
				qrys[qrys.length] = [item.value, item.text];
			});
			combo.getStore().loadData(qrys);
			//设置当前方案
			if (data.qryid.length > 0) {
				combo.setValue(data.qryid);
			} else {
				combo.setValue('0');
			}
			//刷新查询条件
			JxToolCase.renderToolQry(nodeg, data.qrycond);
		}
		var params = 'funid=sys_query&qryfunid=' + nodeg.nodeId +'&pagetype=grid&eventcode=reloadcase';
		Request.postRequest(params, endcall);
	},
	
	/**
	 * 查询条件显示在工具栏中
	 */
	renderToolQry: function(nodeg, qrycond) {
		var grid = nodeg.page;
		var tbar = grid.getTopToolbar();
		if (grid.bwrap) grid.bwrap.select('div.tool-query').remove();
		
		if (qrycond.length > 0) {
			var rowno = 0, datas = [];
			for (var i = 0, n = qrycond.length; i < n; i++) {//查询字段分行显示
				if (rowno == parseInt(qrycond[i].row_no)) {
					var row = datas[rowno-1];
					row[row.length] = qrycond[i];
				} else {
					rowno = parseInt(qrycond[i].row_no);//新的行号
					datas[rowno-1] = [qrycond[i]];
				}
			}
			var hcfgs = JxToolCase.showQryTool(nodeg, datas);
			var qryp = new Ext.Container({
				border:false, 
				items:hcfgs
			});
			var el = tbar.el.insertHtml('afterEnd', "<div class='tool-query x-small-editor'></div>");
			qryp.render(el);
		}
		if (grid.bwrap) {
			grid.setHeight(grid.ownerCt.getHeight());//doLayout无效
			grid.ownerCt.doLayout();
		}
	},
	
	/**
	 * 根据配置的查询方案，显示查询面板
	 * cfg: {left_brack, colcode, colname, condtype, cond_value, right_brack, andor, coltype}
	 * row: [{cfg1}, {cfg2}, ...]
	 * datas: [{row1}, {row2}, ...]
	 */
	showQryTool: function(nodeg, datas) {
		if (datas == null || datas.length == 0) return;
		
		var hcfgs = [];//所有查询字段控件
		var hcfg = function(cfg) {//单行查询配置
			return {
				xtype:'container',
				layout:'hbox',
		    	border:false,
	            layoutConfig: {
	                padding:'2',
	                align:'middle'
	            },
	            defaults:{margins:'0 0 0 5'},
	            items:cfg
	        };
		};
		
		var self = this, grid = nodeg.page;
		var mycols = nodeg.param.cols;
		for (var i = 0, n = datas.length; i < n; i++) {
			var rowcfg = datas[i];
			var qryrow = [];
			
			for (var j = 0, m = rowcfg.length; j < m; j++) {//构建单行查询字段
				var qrycfg = rowcfg[j];
				qrycfg.colcode = qrycfg.colcode.replace('.', '__');
				
				qryrow = self.addQryField(qrycfg, mycols, qryrow);
			}
			
			if (i == n-1) {//最后一行添加查询按钮
				qryrow[qryrow.length] = {xtype:'button', iconCls:'eb_qry', tooltip:jx.star.qry, handler:self.exeQry, data:grid};
			}
			hcfgs[hcfgs.length] = hcfg(qryrow);
		}
		
		return hcfgs;
	}, 
	
	/**
	 * 添加一行查询字段
	 */
	addQryField: function(qrycfg, mycols, qryrow) {
		var self = this;
		var label, field, coltype;
		
		for (var i = 0, c = 0, n = mycols.length; i < n; i++){
			var mc = mycols[i].col, mf = mycols[i].field; 
			if (mc == null || mf == null) continue;
			
			if (mf.name == qrycfg.colcode) {
				coltype = mf.type;
				if (!mc.hasOwnProperty('editor')) {
					if (coltype == 'string') { 
						field = {xtype:'textfield'};
					} else if (coltype == 'date') { 
						field = {xtype:'datefield', format:'Y-m-d'};
					} else {
						field = {xtype:'numberfield', maxLength:12};
					}
				} else {
					var oldcmp = mc.editor;
					var r = (!oldcmp.isXType('combo'));
					Ext.apply(oldcmp.initialConfig, {allowBlank:true, editable:r, cls:'', xtype:oldcmp.getXType()});
					field = oldcmp.initialConfig;
					if (oldcmp.isXType('combo')) {
						field.value = '';
					}
				}
				
				label = {xtype:'label', text:qrycfg.colname + ':'};
				
				//添加一个查询字段
				var len = qryrow.length;
				qryrow[len] = label;
				//保存查询配置值
				field.data = qrycfg;
				field.width = 100;
				field.name = qrycfg.colcode;
				field.listeners = {specialkey: function(f, e){
					if (e.getKey() == e.ENTER) {
						self.exeQry(f);
					}
				}};
				qryrow[len+1] = field;
				
				break;
			}
		}
		return qryrow;
	},
	
	/**
	 * 执行查询
	 */
	exeQry: function(b) {
		var hrs = b.ownerCt;//取行容器
		var hps = hrs.ownerCt;//取查询容器
		if (b.isXType('field')) {//如果字段按回车键，则需要查找按钮
			b = hps.findByType('button')[0];
		}
		var page = b.initialConfig.data;//取当前表格
		
		var vfs = JxToolCase.getQryField(hps);//取出所有有查询值的字段
		
		var query = JxQuery.getQuery(vfs);
		if (query == null) {
			query = ['', '', ''];
		} else {
			//添加树形过滤条件
			var tree_wsql = page.jxstarParam.tree_wsql;
			var tree_wtype = page.jxstarParam.tree_wtype;
			var tree_wvalue = page.jxstarParam.tree_wvalue;
			if (tree_wsql && tree_wsql.length > 0) {
				query[0] = tree_wsql + ' and (' + query[0] + ')';
			}
			if (tree_wvalue && tree_wvalue.length > 0) {
				query[1] = tree_wvalue + ';' + query[1];
			}
			if (tree_wtype && tree_wtype.length > 0) {
				query[2] = tree_wtype + ';' + query[2];
			}
		}
		
		Jxstar.loadData(page, {where_sql:query[0], where_value:query[1], where_type:query[2], is_query:1});
	},
	
	/**
	 * 取有查询值的查询字段数据
	 */
	getQryField: function(hps) {
		var vfs = new Ext.util.MixedCollection();
		hps.items.each(function(hrs){
			hrs.items.each(function(f){
				if (f.isXType('field')) {
					var v = f.getValue();
					if (Ext.isEmpty(v) == false) {
						var d = f.initialConfig.data;
						d.cond_value = v;
						vfs.add(d);
					}
				}
			});
		});
		return vfs;
	},
	
	/**
	* public 查询方案自定义界面
	* nodeg -- 当前功能的表格定义对象，用于取表格字段对象
	**/
	queryWindow: function(nodeg) {
		var self = this;
		self.funid = nodeg.nodeId;
		
		var	win = new Ext.Window({
			title:'查询方案自定义...',
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
	}
	
	});//Ext.apply

})();
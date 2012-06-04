﻿/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
  
/**
 * 构建查询工具栏控件
 * 
 * @author TonyTan
 * @version 1.0, 2012-04-16
 */
JxQueryExt = {};
(function(){

	Ext.apply(JxQueryExt, {
	
	initQrys:[['0', '--查询方案--'], ['1', '--自定义...']],
		
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
			var oldv = combo.getValue();//防止重复点击
			
			if (val != oldv && val == '0') {
				self.renderToolQry(nodeg);
			} else if (val != oldv && val == '1') {
				self.openToolQry(nodeg, combo);
			} else if (val != oldv) {
				var endcall = function(data) {
					self.renderToolQry(nodeg, data.qrycond);
				}
				var params = 'funid=sys_query&queryid=' + val +'&pagetype=grid&eventcode=selcase';
				Request.dataRequest(params, endcall);
			}
		});
		//加载查询方案
		self.loadQryCase(nodeg, qrycb);
	},
	
	/**
	 * 显示自定义查询方案
	 */
	openToolQry: function(nodeg, combo) {
		var win = this.queryWindow(nodeg);
		//关闭时重新加载查询方案
		win.on('destroy', function() {
			JxQueryExt.loadQryCase(nodeg, combo);
		});
	},
	
	/**
	 * 从后台加载查询方案
	 */
	loadQryCase: function(nodeg, combo) {
		var endcall = function(data) {
			//alert(Ext.encode(data));
			//刷新查询方案
			var qrycase = data.qrycase, iqs = JxQueryExt.initQrys;
			var qrys = [iqs[0], iqs[1]];
			//只有管理员才有自定义权限
			//if (JxUtil.isAdminUser()) qrys[1] = iqs[1];
			
			Ext.each(qrycase, function(item){
				qrys[qrys.length] = [item.value, item.text];
			});
			combo.getStore().loadData(qrys);
			//设置当前方案
			if (data.qryid.length > 0) {
				combo.setValue(data.qryid);
				JxQueryExt.renderToolQry(nodeg, data.qrycond);
			} else {
				combo.setValue('0');
				JxQueryExt.renderToolQry(nodeg);
			}
		}
		var params = 'funid=sys_query&qryfunid=' + nodeg.nodeId +'&pagetype=grid&eventcode=reloadcase';
		Request.dataRequest(params, endcall);
	},
	
	/**
	 * 查询条件显示在工具栏中
	 */
	renderToolQry: function(nodeg, qrycond) {
		var grid = nodeg.page;
		var renderQry = function() {
			if (Ext.isEmpty(grid.qryCt)) {
				JxHint.alert('查询字段容器未显示！');
				return;
			}
			grid.qryCt.removeAll(true);
			
			var hcfgs = [], rn = 1;
			//如果有查询条件，则是查询方案，否则为通用查询
			if (qrycond) {
				if (qrycond.length > 0) {
					hcfgs = JxQueryExt.showQryTool(nodeg, qrycond);
					rn = hcfgs.length;
				}
			} else {
				hcfgs = JxQueryExt.hcfg();
		        Jxstar.addBaseQry(nodeg, hcfgs);
				//如果查询做归档处理，则显示归档checkbox
				if (nodeg.define.isarch == '1') {
					hcfgs.add(JxQueryExt.archCfg);
				}
			}
			//添加到查询工具栏容器中
			grid.qryCt.add(hcfgs);
			
			//由于存在2行的情况，qryCt, grid.ownerCt需要doLayout
			grid.qryCt.setHeight(24*rn+2);
			grid.qryCt.doLayout();
			grid.setHeight(grid.ownerCt.getHeight());//单执行doLayout无效
			grid.ownerCt.doLayout();
		};
		
		//由于子表构建时tbar.el is null，所以在子表呈现时再触发
		if (grid.bwrap == null) {
			grid.on('render', renderQry);
		} else {
			renderQry();
		}
	},
	
	//私有方法
	hcfg: function(cfg) {//单行查询配置
		var ct = {
			name:JxUtil.newId()+'_qv',//选择窗口控件使用
			xtype:'container',
			layout:'hbox',
	    	border:false,
            layoutConfig: {
                padding:'1',
                align:'middle'
            },
            defaults:{margins:'0 0 0 5'},
            items:cfg||[]
        };
		if (cfg) {
			return ct;
		} else {
			return new Ext.Container(ct);
		}
	},
	
	//私有属性
	archCfg: {xtype:'checkbox', boxLabel:'含归档数据', width:80, name:'xx_isarch', checked:false},
	
	/**
	 * 根据配置的查询方案，显示查询面板
	 * cfg: {left_brack, colcode, colname, condtype, cond_value, right_brack, andor, coltype}
	 * row: [{cfg1}, {cfg2}, ...]
	 * datas: [{row1}, {row2}, ...]
	 */
	showQryTool: function(nodeg, qrycond) {
		if (qrycond == null || qrycond.length == 0) return [];
		
		var rowno = 0, datas = [];
		for (var i = 0, n = qrycond.length; i < n; i++) {//查询字段分行显示
			var qryrowno = qrycond[i].row_no;
			if (Ext.isEmpty(qryrowno)) qryrowno = '1';
			
			if (rowno == parseInt(qryrowno)) {
				var row = datas[rowno-1];
				row[row.length] = qrycond[i];
			} else {
				rowno = parseInt(qryrowno);//新的行号
				datas[rowno-1] = [qrycond[i]];
			}
		}
		
		var hcfgs = [];//所有查询字段控件
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
				//如果查询做归档处理，则显示归档checkbox
				if (nodeg.define.isarch == '1') {
					qryrow[qryrow.length] = self.archCfg;
				}
			}
			hcfgs[hcfgs.length] = self.hcfg(qryrow);
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
						var format = JxUtil.getDateFormat(mc.renderer);//设置日期控件的样式，可能是月份样式
						field = {xtype:'datefield', format:format};
					} else {
						field = {xtype:'numberfield', maxLength:12};
					}
				} else {
					var oldcmp = mc.editor;
					Ext.apply(oldcmp.initialConfig, {allowBlank:true, editable:true, cls:'', xtype:oldcmp.getXType()});
					field = oldcmp.initialConfig;
					if (oldcmp.isXType('combo')) {
						field.value = '';
					}
				}
				
				var str = qrycfg.colname;
				if (Ext.isEmpty(str)) str = mc.header;
				if (qrycfg.condtype == 'like') {
					str += ':';
				} else {
					str += qrycfg.condtype;
				}
				label = {xtype:'label', text:str};
				
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
		var isarch = hps.findByType('checkbox')[0];//取含归档的checkbox
		var query_type = 0;
		if (isarch && isarch.getValue() == '1') {//是否可以查询到已复核的记录
			query_type = 1;
		}
		
		var page = b.initialConfig.data;//取当前表格
		var vfs = JxQueryExt.getQryField(hps);//取出所有有查询值的字段
		
		var query = JxQuery.getQuery(vfs);
		Jxstar.myQuery(page, query, '1');
	},
	
	/**
	 * 取有查询值的查询字段数据
	 */
	getQryField: function(hps) {
		var vfs = new Ext.util.MixedCollection();
		hps.items.each(function(hrs){
			hrs.items.each(function(f){
				if (f.isXType('field') && f.getName() != 'xx_isarch') {
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
			items:[{
				xtype:'container',
				region:'west',
				layout:'fit',
				width:250,
				split:true,
				margins:'2 0 2 2'
			},{
				xtype:'container',
				region:'center',
				layout:'fit',
				margins:'2 2 2 0'
			}]
		});
		//构建表格对象
		Jxstar.createPage('sys_query', 'gridpage', win.getComponent(0));
		var param2 = {pageType:'subeditgrid', parentNodeId:'sys_query'};
		Jxstar.createPage('sys_qrydet', 'gridpage', win.getComponent(1), param2);
		
		//添加主从关系
		JxUtil.delay(1000, function(){
			var mg = win.getComponent(0).getComponent(0);
			var sg = win.getComponent(1).getComponent(0);		
			
			mg.on('rowclick', function(g, n, e){
				var record = g.getStore().getAt(n);
				if (record == null) return false;
				
				var fkval = record.get('sys_query__query_id');
				Jxstar.loadSubData(sg, fkval);
			});
			mg.getStore().on('load', function(s){
				if (mg.selectKeyId == null || mg.selectKeyId.length == 0) {
					mg.getSelectionModel().selectFirstRow();
					mg.fireEvent('rowclick', mg, 0);
				}
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
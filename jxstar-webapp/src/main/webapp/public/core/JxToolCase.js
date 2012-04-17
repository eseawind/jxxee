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
	
	/**
	 * 构建查询方案选项控件
	 */
	showCase: function(nodeg) {
		var self = this, grid = nodeg.page;
		var tbar = grid.getTopToolbar();
		
		tbar.add('-');
		
		var qrys = [['0', '--查询方案--'], ['1', '自定义...']];
		
		var qryid = JxUtil.newId() + '_qry';
		var qrycb = Jxstar.createCombo(qryid, qrys, 100);
		tbar.add(qrycb);
		
		var stas = [['0', '--统计方案--'], ['1', '自定义...']];
		
		var staid = JxUtil.newId() + '_sta';
		var stacb = Jxstar.createCombo(staid, stas, 100);
		tbar.add(stacb);
	},
	
	/**
	 * 根据配置的查询方案，显示查询面板
	 * cfg: {left_brack, colcode, condtype, cond_value, right_brack, andor, coltype}
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
				qryrow = self.addQryField(qrycfg, mycols, qryrow);
			}
			
			if (i == n-1) {//最后一行添加查询按钮
				qryrow[qryrow.length] = {xtype:'button',width:50,text:'查询'};
			}
			
			hcfgs[hcfgs.length] = hcfg(qryrow);
		}

		return hcfgs;
	}, 
	
	/**
	 * 添加一行查询字段
	 */
	addQryField: function(qrycfg, mycols, qryrow) {
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
					Ext.apply(oldcmp.initialConfig, {allowBlank:true, editable:r, cls:''});
					field = oldcmp.initialConfig;
				}
				
				label = {xtype:'label', text: mycols[i].col.header + ':'};
				
				//添加一个查询字段
				var len = qryrow.length;
				qryrow[len] = label;
				//保存查询配置值
				field.data = qrycfg;
				field.width = 100;
				qryrow[len+1] = field;
				
				break;
			}
		}
		return qryrow;
	}
	
	});//Ext.apply

})();
/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the GNU GPL Version 3.0
 */
  
/**
 * 构建统计报表表格
 * 
 * @author TonyTan
 * @version 1.0, 2011-01-01
 */
JxTotalGrid = {};
(function(){

	Ext.apply(JxTotalGrid, {
	
	/**
	* public 返回表格对象
	* data -- 参数格式{toolfn:fn, cols:[{col_code:, display:, format:, combo_code:, is_show:, col_width:},...], 
	*                  groups:[], reportId:''}
	**/
	createGrid: function(config) {
		var self = this;
		//构建工具栏，由于有相关控件的数据
		//所以在后台直接生成工具栏返回前台
		var toolbar = config.toolfn();
		
		//构建store
		var fields = self.createFields(config.cols);
		var store = new Ext.data.Store({
			reader: new Ext.data.JsonReader({
				root: 'root',
				totalProperty: 'total'
			}, fields)
		});
		
		//构建表格分组标题
		var group, titles = config.groups;
		if (titles.length > 0) {
			titles[0].colspan += 1;
			group = new Ext.ux.grid.ColumnHeaderGroup({rows: [titles]});
		}
		
		//构建表格
		var totalgrid = new Ext.grid.GridPanel({
			tbar: toolbar,
			store: store,
			columns: self.createColumns(config.cols),
			loadMask: true,
			columnLines: true,	//显示列分隔线
			store: store,
			stripeRows: true,	//显示斑马线
			enableHdMenu: false,
			enableColumnMove: false,
			plugins: group
		});
		//给统计参数赋缺省值
		totalgrid.on('afterrender', self.setToolDefault);
		
		//添加统计、打印、另存数据按钮
		toolbar.addButton({iconCls:'eb_empty', text:'统计', handler:function(){self.exeStat(config.nodeid, totalgrid);}});
		toolbar.addButton({iconCls:'eb_print', text:'打印', handler:function(){self.outputXls(config.reportId, totalgrid);}});
		toolbar.addButton({iconCls:'eb_expxls', text:'另存数据', handler:function(){Request.exportCSV(totalgrid, '统计数据.csv');}});
		
		return totalgrid;
	},
	
	//执行统计
	exeStat: function(nodeid, grid) {
		var tbar = grid.getTopToolbar();
		var params = '';
		var novalid = false;
		
		//取工具栏中的参数值与有效性
		tbar.items.each(function(item){
			if (item.isXType('field')) {
				if (item.isValid() == false) {
					novalid = true;
					return false;
				}
				var val = item.getValue();
				val = Ext.isDate(val) ? val.dateFormat('Y-m-d H:i:s') : val;
				params += '&' + item.getName() + '=' + val;
			}
		});
		if (novalid) {
			JxHint.alert(jx.event.datavalid);
			return;
		}
		
		//统计后加载数据
		var hdcall = function(data) {
			grid.getStore().loadData(data);
		};
		
		//发送后台请求
		params = 'funid=rpt_list&pagetype=grid&eventcode=totalexe&rpt_funid=' + nodeid + params;
		Request.postRequest(params, hdcall);
	},
	
	//执行打印输出到模板
	outputXls: function(reportId, grid) {
		if (Ext.isEmpty(reportId)) {
			JxHint.alert('没有找到报表定义ID，不能输出！');
			return false;
		}
		
		var tparams = '';
		var tbar = grid.getTopToolbar();
		//取工具栏中的参数
		tbar.items.each(function(item){
			if (item.isXType('field')) {
				var val = item.getValue();
				val = Ext.isDate(val) ? val.dateFormat('Y-m-d H:i:s') : val;
				tparams += '&' + item.getName() + '=' + val;
			}
		});
		
		//构建输出报表的参数
		var params = 'funid=rpt_list&printType=xls&reportId='+ reportId +'&user_id=' + Jxstar.session['user_id'] + tparams;
		this.postXls(grid, params);
	},
	
	//private 发送post请求输出报表
	postXls: function(grid, params) {
		var self = this;
		var hiddens = self.createHidden(grid);
		if (hiddens == null || hiddens.length == 0) {
			JxHint.alert('没有找到报表字段信息，不能输出！');
			return false;
		}
		
		var fd = Ext.DomHelper.append(Ext.getBody(), {
					tag:'form', 
					method:'post', 
					id:'frmOutputTotalXls', 
					name:'frmOutputTotalXls',
					action:Jxstar.path + "/reportAction.do?" + params,
					target:'_blank',
					cls:'x-hidden',
					cn:hiddens
				}, true);
		fd.dom.submit();
		fd.remove();
	},
	
	//private 把数据值保存到隐藏字段中
	createHidden: function(grid) {
		var hiddens = [];
		var store = grid.getStore();
		var cm = grid.getColumnModel();
		var rownum = store.getCount();//记录数
		var colnum = cm.getColumnCount();//字段个数
		var allfields = '';//记录所有字段名称
		
		var cnt = 0;//字段个数
		for (var i = 0; i < colnum; i++) {
			var name = cm.getDataIndex(i);
			if (name.length == 0) continue;
			
			allfields += name + ',';
			hiddens[cnt++] = {tag:'input',name:name,id:name,type:'hidden'};
		}
		//把字段名称也传到后台
		if (allfields.length > 1) {
			allfields = allfields.substr(0 , allfields.length - 1);
			hiddens[cnt++] = {tag:'input',name:'allfields',id:'allfields',value:allfields,type:'hidden'};
		} else {
			return null;
		}
		
		var colval = '';
		for (var i = 0; i < hiddens.length-1; i++) {
			for (var r = 0; r < rownum; r++) {
				var val = store.getAt(r).get(hiddens[i].name);
				if (Ext.isEmpty(val)) val = '';
				val = Ext.isDate(val) ? val.dateFormat('Y-m-d H:i:s') : val;
				colval += val + ',';
			}
			//添加结束标志，处理值为空的问题
			colval += 'end';
			hiddens[i].value = colval; colval = '';
		}
		
		return hiddens;
	},
	
	//private 构建表格列信息
	createColumns: function(cols) {
		var columns = [], self = this, cnt = 0;
		//添加行选控件
		var rn = new Ext.grid.RowNumberer();
		columns[cnt++] = rn;
		
		for (var i = 0; i < cols.length; i++) {
			var code = cols[i].col_code;
			var format = cols[i].format;
			
			var col = {header:cols[i].display, dataIndex:code, width:cols[i].col_width};
			self.setRenderer(format, col);
			
			columns[cnt++] = col;
		}
		
		return columns;
	},
	
	//private 给报表参数赋缺省值
	setToolDefault: function(grid) {
		var tbar = grid.getTopToolbar();
		//取工具栏中的参数
		tbar.items.each(function(item){
			if (item.isXType('field')) {
				var defaultval = item.defaultval;
				if (typeof defaultval == 'string' && defaultval.indexOf('fun_') == 0) {
					var val = eval('JxDefault.' + defaultval.split('fun_')[1]);
					item.setValue(val);
				}
			}
		});
	},
	
	//private 构建数据显示样式
	setRenderer: function(format, config) {
		if (format == 'text') return;
		
		if (format == 'int') {
			config.renderer = JxUtil.formatInt();
			return;
		} else if (format.indexOf('number') >= 0) {
			var n = 2;
			if (format.length > 6) n = format.charAt(6);
			config.renderer = JxUtil.formatNumber(n);
			return;
		}
		
		var str = 'Y-m-d'
		if (format == 'datetime') {
			str = 'Y-m-d H:i:s';
		} else if (format = 'datemin') {
			str = 'Y-m-d H:i';
		} else if (format = 'datemonth') {
			str = 'Y-m';
		} else if (format = 'date') {
			str = 'Y-m-d'
		} else if (format = 'dateyear') {
			str = 'Y'
		}
		if (format.indexOf('date') >= 0) {
			config.renderer = function(value) {
				return value ? value.format(str) : '';
			}
		}
	},
	
	//private 构建数据字段信息
	createFields: function(cols) {
		var fields = [], self = this;
		for (var i = 0; i < cols.length; i++) {
			var format = cols[i].format;
			var dataType = self.getDataType(format);
			
			fields[i] = {name:cols[i].col_code, type:dataType};
		}
		
		return fields;
	},
	
	//private 取数据类型
	getDataType: function(format) {
		if (format == 'text') {
			return 'string';
		}
		if (format.indexOf('number') > -1) {
			return 'float';
		}
		if (format.indexOf('date') > -1) {
			return 'date';
		}
		if (format == 'int') {
			return 'int';
		}
		return 'string';
	}
	
	});//Ext.apply

})();
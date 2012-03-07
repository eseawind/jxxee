/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */

/**
 * 报表设计器
 * 设置选择字段显示在哪个td的设计思路是：
 * 1、定义一个公共的sel_rpttddiv对象，标志当前所在的td；
 * 2、当前选择了哪条字段记录以curRecord参数记录在seldiv上；
 * 3、当前选择了哪个td以curTd参数记录在seldiv上；
 * 4、当前改变当前seldiv的位置时，清除原td上的值；
 **/

Jxstar.currentPage = {
	/**
	 * 当前报表ID
	 **/
	reportId:'',
	
	layoutEl:null,

	/**
	 * 显示设计器
	 **/
	render: function(reportId, parent) {
		var self = this;
		this.reportId = reportId;
		this.layoutEl = parent;
		
		//设计面板的工具栏
		var tbar = parent.getTopToolbar();
		//检查parent中是否有设计面板
		var designPanel = parent.getComponent(0);
		if (designPanel) {
			//删除所有子控件
			designPanel.removeAll(true);
			//删除设计对象，考虑要重新加载事件
			designPanel.destroy();
			designPanel = null;
			
			//删除所有新增按钮
			tbar.removeAll(true);
		} 
		
		//创建设计面板，用于处理滚动条
		var deshtml = '<div id=\'rpt_wall_top\' class=\'wall_top\'></div>'+
					  '<div id=\'rpt_wall_left\' class=\'wall_left\'></div>'+
					  '<div id=\'rpt_wall_center\' class=\'wall_center\'></div>';
		designPanel = new Ext.Panel({
			id:'rept_design_panel',
			border:false,
			autoScroll:true,
			html:deshtml			
		});

		parent.add(designPanel);
		//parent.getEl().setStyle('border-left-width', '1px');
		//销毁XLS模板中的TD对象，因为td添加了click事件，在IE中不能销毁
		designPanel.on('beforedestroy', function(){
			Ext.fly('rpt_wall_center').select('td').remove();
			return true;
		});
		
		//由于工具栏保存的事件对象是原self对象的，所以必须先删除再创建
		tbar.add(
			{text:jx.rpt.title, iconCls:'eb_save', handler:function(){self.showHead();}},	//'报表标题'
			{text:jx.rpt.area, iconCls:'eb_change', handler:function(){self.showArea();}},	//'报表区域'
			{xtype:'tbseparator'},
			{text:jx.base.refresh, iconCls:'eb_refresh', handler:function(){self.reloadDesign();}}	//'刷新'
		);

		//必须要刷新布局，否则取不到el
		parent.doLayout();
		this.design = designPanel;
		
		//加载设计文件
		this.readDesign(reportId);
	},
	
	/**
	 * 加载报表设计文件
	 **/
	readDesign: function(reportId) {
		var self = this;
		var params = '&funid=rpt_list&pagetype=grid&eventcode=loadfile&reportId='+reportId;
		//在chrome中，显示的表格宽高都是根据字体大小显示的，
		//是因为在update加载文件是执行了scripts造成的暂不处理该问题。
		var hdCall = function(data) {
			//添加设计边框
			self.fillReportWall();
			
			//添加选择td的标志
			Ext.fly('rpt_wall_center').insertHtml('beforeEnd', '<div id=\'sel_rpttddiv\' class=\'sel_rpttd\'></div>');
			
			//给所有td添加事件
			Ext.fly('rpt_wall_center').select('td').on('click', function(){self.clickTd(this)});
		};
		
		Request.fileUpdate('rpt_wall_center', params, hdCall);
	},
	
	/**
	 * 给设计模板的上边框与左边框添加序号
	 **/
	fillReportWall: function() {
		//报表模板
		var xlsTable = Ext.getDom('xls_parser_table');
		if (xlsTable == null) return;
		
		//取每行的高度
		var rowhs = [];
		for (var i = 0, n = xlsTable.rows.length; i < n; i++) {
			rowhs[i] = xlsTable.rows[i].offsetHeight;
		}
		this.fillLeftWall(rowhs);	
		
		//取每列的宽度
		var colws = [];
		var cells = xlsTable.rows[0].cells;
		for (var i = 0, n = cells.length; i < n; i++) {
			colws[i] = cells[i].offsetWidth;
		}
		this.fillTopWall(colws);
	},
	
	/**
	 * 给头部添加序号
	 * tops -- 每列的宽度
	 **/
	fillTopWall: function(tops) {
		var th = '', left = 22;
		for (var i = 0, n = tops.length; i < n; i++) {
			if (i > 0) left += tops[i-1];
		
			th += "<div id='top_wall_"+ i +"' class='tw_sub' style='width:"+ tops[i] +"px;left:"+ left +"px'>"+ i +"</div>"
		}
		Ext.fly('rpt_wall_top').insertHtml('beforeEnd', th);
	},
	
	/**
	 * 给左边框添加序号
	 * lefts -- 每行的高度
	 **/
	fillLeftWall: function(lefts) {
		var th = '', top = 0;
		for (var i = 0, n = lefts.length; i < n; i++) {
			if (i > 0) top += lefts[i-1];
		
			th += "<div id='left_wall_"+ i +"' class='lw_sub' style='height:"+ lefts[i] +"px;top:"+ top +"px;'>"+ i +"</div>"
		}
		Ext.fly('rpt_wall_left').insertHtml('beforeEnd', th);
	},
	
	/**
	 * 刷新设计信息
	 **/
	reloadDesign: function() {
		this.render(this.reportId, this.layoutEl);
	},
	
	/**
	 * 点击表格单元的事件
	 **/
	clickTd: function(seltd) {
		var td = Ext.get(seltd);
		//如果字体不为红色，表示不是空白内容区，不能设置
		var color = td.getStyle('color');
		if (color != 'rgb(255, 0, 0)' && color != 'red') {
			JxHint.alert(jx.rpt.selemp);//'当前选择的单元格不是内容区域，请选择空白栏！'
			return;
		}
		//选中标志
		var div = Ext.get('sel_rpttddiv');
		
		//设置选中标志的当前位置
		div.setX(td.getX());
		div.setY(td.getY());
		div.setWidth(td.getWidth());
		div.setHeight(td.getHeight());
		
		//如果选择了新的记录，则清除历史值
		if (div.oldRecord != null && div.curRecord != div.oldRecord) {
			div.curTd = null;
		}
		
		//如果选中了字段记录，则设置字段的位置信息，rpt_head|rpt_detail
		//div.curRecord,div.curTable这两个参数在选择字段明细记录设置
		if (div.curRecord != null && div.curTable != null) {
			//恢复原td的属性
			if (div.curTd != null) {
				//div.curTd.dom.innerHTML = div.oldTdHtml;
				div.curTd.dom.innerHTML = '';
			}
			//记录当前选中的td
			div.curTd = td;
			//原记录改为当前记录
			div.oldRecord = div.curRecord;
		
			//字段标签
			var display = div.curRecord.get(div.curTable+'__display');
			//保存原内容，设置新的内容
			//div.oldTdHtml = td.dom.innerHTML;
			td.dom.innerHTML = display;
			
			//设置当前位置
			div.curRecord.set(div.curTable+'__col_pos', seltd.id);
		}
	},
	
	/**
	 * 显示报表标题定义界面
	 **/
	showHead: function() {
		var self = this;
		//过滤条件
		var where_sql = 'rpt_head.report_id = ?';
		var where_type = 'string';
		var where_value = self.reportId;
		
		//加载数据
		var hdcall = function(grid) {
			grid.getBottomToolbar().hide();
			//显示数据
			JxUtil.delay(500, function(){
				//临时保存，关闭时用
				self.layoutEl.rpt_head = grid;
				//设置外键值
				grid.fkValue = where_value;
				Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});
			});
		};

		//显示数据
		Jxstar.showData({
			filename: '/jxstar/studio/grid_rpt_head.js',
			title: jx.rpt.titdef,	//'报表标题定义', 
			pagetype: 'subeditgrid',
			nodedefine: Jxstar.findNode('rpt_head'),
			width: 600,
			height: 250,
			modal: false,
			callback: hdcall
		});
	},
	
	/**
	 * 显示报表区域定义界面
	 **/
	showArea: function() {
		var self = this;
		//过滤条件
		var where_sql = 'rpt_area.report_id = ?';
		var where_type = 'string';
		var where_value = self.reportId;
		
		//加载数据
		var hdcall = function(grid) {
			grid.getBottomToolbar().hide();
			//显示数据
			JxUtil.delay(500, function(){
				//临时保存，关闭时用
				self.layoutEl.rpt_area = grid;
				//设置外键值
				grid.fkValue = where_value;
				Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});
			});
		};

		//显示数据
		Jxstar.showData({
			filename: '/jxstar/studio/grid_rpt_area.js',
			title: jx.rpt.aredef,	//'报表区域定义', 
			pagetype: 'subeditgrid',
			nodedefine: Jxstar.findNode('rpt_area'),
			width: 600,
			height: 250,
			modal: false,
			callback: hdcall
		});
	},
	
	showParam: function() {
		JxHint.alert('暂时不需要！');
	}
};

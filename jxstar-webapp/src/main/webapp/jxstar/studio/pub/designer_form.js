/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */

/**
 * form表单设计器
 *
 * 注意：各种布局元素都不能加边框，firefox会给加边框的对象计算宽度是加上边框的宽度
 *       拖动控件时不要移动到画布外了，否则控件会丢失，现在还没处理好这个文件，框架的范围控制没有处理好scroll值。
 * 页面控件保存时的处理规则：
 * 1、先找到设计容器中所有的控件元素，包括：form, column, field，后面保存一个就去掉一个，剩下的就是位置不对的控件；
 * 2、找到所有form控件，然后分别保存每个form布局内部的column，form布局不能重叠；
 * 3、找到所有column控件，然后分别保存每个column布局内部的field，column布局不能重叠；
 **/

Jxstar.currentPage = {
	/**
	 * 设计面板容器，所有控件都放在此容器内。
	 **/
	parentEl: null,
	
	/**
	 * 设计面板布局，是容器的父控件，用于取滚动条的距离。
	 **/
	layoutEl: null,

	/**
	 * 当前设计功能ID
	 **/
	nodeId: '',

	/**
	 * 布局元素ID序号，创建控件时用
	 **/
	compnum: 0,
	
	/**
	 * 缺省显示的列数
	 **/
	colnums: 2,
	
	/**
	 * 记录设计面板中所有的元素，保存的是DOM对象，格式：{form:[], column:[], field:[]}
	 **/
	designItems: null,
	
	/**
	 * 记录设计面板中所有的元素的DD对象，关闭页面时销毁
	 **/
	designDDs: [],
	
	/**
	 * 记录设计面板中所有的元素的Resize对象，关闭页面时销毁
	 **/
	designResizes: [],

	/**
	 * 布局元素初始位置，x表示left，y表示top，i表示间隔
	 **/
	initpos: {
		formx:10, formy:35,  formi:10,
		colx:5,	  coly:5,    coli:20,
		fieldx:5, fieldy:5, fieldi:8
	},

	/**
	 * 布局元素初始大小，w表示width，h表示height
	 **/
	initsize: {
		formw:720,  formh:380,
		colw: 220,   colh:360,
		fieldw:200, fieldh:22
	},
	
	/**
	 * 设置画布背景的列数、行数、列宽、行高
	 **/
	bgsize: {cols:6, rows:50, width:120, height:30},
	
	/**
	 * 销毁临时对象
	 **/
	destroy: function() {
		var self = this;
		Ext.each(self.designDDs, function(item){
			item.unreg();
			item = null;
		});
		Ext.each(self.designResizes, function(item){
			item.destroy(true);
			item = null;
		});
		self.designDDs = null;
		self.designResizes = null;
	},
	
	/**
	 * 初始化列与字段的宽度
	 **/
	initWidth: function(colsnum) {
		var self = this;
		self.colnums = colsnum;
		if (self.colnums == 2) {
			self.initsize.colw = 340;
			self.initsize.fieldw = 320;
		} else {
			self.initsize.colw = 220;
			self.initsize.fieldw = 200;
		}
	},

	/**
	 * 显示设计器
	 * nodeId -- 功能ID
	 * parent -- 设计面板的容器对象
	 **/
	render: function(nodeId, parent) {
		var self = this;
		//参数初始化
		self.nodeId = nodeId;
		
		//设置列的缺省宽度
		self.initWidth(self.colnums);
		
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
			tbar.add({text:' '});//chrome中用于布局
		} 
		//创建设计面板，用于处理滚动条
		designPanel = new Ext.Panel({
			id: 'des_form_panel',
			border: false
		});
		parent.add(designPanel);
		//销毁临时对象
		designPanel.on('beforedestroy', function(){
			self.destroy();
			return true;
		});
		
		//添加控件菜单
		var compMenu = [
			{text:jx.fun.addrow, iconCls:'eb_add', handler:function(){self.createComponent('fdes-formitem');}},		//'添加一行'
			{text:jx.fun.addcol, iconCls:'eb_add', handler:function(){self.createComponent('fdes-columnitem');}},	//'添加一列'
			{text:jx.fun.addfld, iconCls:'eb_add', handler:function(){self.createComponent('fdes-fielditem');}}		//'添加字段'
		];
		
		var onItemClick = function(item){
			var num = item.text.split(' ')[0];
			self.initWidth(num);
	    };
		var extMenu = [
			{text:jx.fun.ctlprop, handler:function(){self.updateProp();}},		//'控件属性'
			{text:jx.fun.delctl, handler:function(){self.deleteComponent();}},	//'删除控件'
			{text: 'form cols', menu:{items: [									//'设置表单列数'
             {text:'2 cols', checked: true, group: 'colsnum', checkHandler: onItemClick},
             {text:'3 cols', checked: false, group: 'colsnum', checkHandler: onItemClick}
             ]}
			},
			'-',
			//{text:jx.wfx.imp, iconCls:'eb_imp', handler:function(){JxHint.alert('演示版功能暂不提供！');}},	//'导入设计'
			{text:jx.wfx.exp, iconCls:'eb_exp', handler:function(){self.exportDesign();}}	//'导出设计'
		];
		
		//由于工具栏保存的事件对象是原self对象的，所以必须先删除再创建
		tbar.add(
			{text:jx.base.save, iconCls:'eb_save', handler:function(){self.saveDesign();}},			//'保存'
			{text:jx.fun.pub, iconCls:'eb_change', handler:function(){self.createPage();}},			//'发布'
			{text:jx.base.del, iconCls:'eb_delete', handler:function(){self.deleteDesign();}},		//'删除'
			{xtype:'tbseparator'},
			{text:jx.fun.synprop, iconCls:'eb_refresh', handler:function(){self.updateDesign();}},	//'同步属性'
			{text:jx.fun.setfld, iconCls:'eb_empty', handler:function(){self.selectField();}},		//'设置字段'
			{text:jx.fun.addlay, iconCls:'eb_form', handler:function(){self.createLayout(4, self.colnums);}},	//'添加布局'
			{xtype:'tbfill'},
			{xtype:'tbseparator'},
			{text:jx.fun.addctl, iconCls: 'eb_menu', menu: compMenu},		//'添加控件…'
			{text:jx.wfx.extdo, iconCls: 'eb_menu', menu: extMenu}			//'扩展操作…'
		);

		//必须要刷新布局，否则取不到el
		parent.doLayout();
		//parent.getEl().setStyle('border-left-width', '1px');
		self.parentEl = designPanel.el;
		//取设计面板的父对象，用于取滚动条的距离
		self.layoutEl = Ext.get(designPanel.el.findParent('div.x-panel-body', 2));
		
		//计算画布背景的高度
		var bgheight = self.bgsize.height * self.bgsize.rows;
		
		//显示设计画布
		self.parentEl.insertHtml('beforeEnd', 
						'<div id="maincanvas" class="fdes-canvas x-unselectable" style="height:'+ bgheight +'px;"></div>');

		//显示设计画布中的网格
		var vhtml = '';
		for (var i = 0; i < self.bgsize.cols; i++) {
			for (var j = 0; j < self.bgsize.rows; j++) {
				var stop = 10+j*self.bgsize.height;
				var sleft = 10+i*self.bgsize.width;
				vhtml += '<div class="fdes-grid x-unselectable" style="top:'+stop+'px;left:'+sleft+'px;"></div>';
			}
		}
		self.parentEl.insertHtml('beforeEnd', vhtml);
		
		//添加一个覆盖整个设计面板的DIV，用于处理底部的鼠标事件
		var maxw = self.parentEl.getWidth();
		self.parentEl.insertHtml('beforeEnd', 
						'<div id="maincanvas_tmp" class="fdes-canvas-bg x-unselectable" style="width:'+ maxw +'px;height:'+ bgheight +'px;"></div>');
		
		//初始化控件选择对象
		self.initDd();
		
		//加载设计文件
		self.readDesign();
	},

	/**
	 * 根据设计信息创建文件
	 **/
	createPage: function() {
		//设置请求的参数
		var params = 'funid=sys_fun_base&eventcode=createfd';
		params += '&selfunid='+this.nodeId+'&selpagetype=form&projectpath=' + Jxstar.session['project_path'];
		
		//发送请求
		Request.postRequest(params, null);
	},

	/**
	 * 保存设计文件，处理方法：
	 * 约定page第一层只能放formitem控件，formitem控件内只能放columnitem控件；
	 * columnitem控件内只能放fielditem控件；
	 * 子控件的中心点在那个控件内，则该子控件就算是它的子控件；
	 **/
	saveDesign: function() {
		var self = this;
		//清除选择控件的标志
		self.clearSelectDivs();
		
		//记录设计页面中所有的设计控件，确保不遗漏控件
		self.designItems = self.queryDesignItems();

		//根据页面控件解析出设计文件
		var filecont = "";
		var canvasEl = Ext.get('maincanvas');
		var pageXML = this.formItemToXML(canvasEl);
		if (pageXML.length == 0) return;
		
		//判断是否有遗漏的控件没有解析到设计文件中
		if (self.hasNoSaveItem(self.designItems)) {
			JxHint.alert(jx.fun.tip01);//'有遗漏的页面控件没有保存，请调整到合理的位置保存！'
			return;
		}
		
		filecont = "<?xml version='1.0' encoding='utf-8'?>\r";
		filecont += "<page state='design'>\r";
		filecont += pageXML;
		filecont += "</page>";
		
		var e = encodeURIComponent; //编码, 处理isHexDigit异常
		var params = 'funid=sys_fun_base&eventcode=savefd';
			params += '&selfunid='+this.nodeId+'&selpagetype=form';
			params += '&content='+ e(filecont);

		//发送请求保存设计文件到数据库中
		Request.postRequest(params, null);
	},

	/**
	 * 导出设计文件
	 * 
	 **/
	exportDesign: function() {
		var href = Jxstar.path + "/jxstar/studio/pub/exp_form_design.jsp?funid=" + this.nodeId;
		document.getElementById('frmhidden').src = href;
	},
	
	/**
	 * 重新加载设计文件
	 * 
	 **/
	reloadDesign: function() {
		var self = this;
		var hdcall = function() {
			//删除当前设计元素
			self.parentEl.select('div.fdes-fielditem, div.fdes-columnitem, div.fdes-formitem').remove();

			//重新加载设计文件
			self.readDesign();
		};
		//'当前修改如果没有保存则会丢失，确定刷新？'
		Ext.Msg.confirm(jx.base.hint, jx.fun.tip02, function(btn) {
			if (btn == 'yes') hdcall();
		});
	},

	/**
	 * 读取设计文件，并解析为页面控件
	 * 
	 **/
	readDesign: function() {
		var a = (new Date()).getTime(); 
		
		var self = this;
		//读取设计文件后的回调函数
		var hdCall = function(xml) {
			if (xml == null || xml.length == 0) {
				JxHint.alert(jx.fun.tip03);//'没有读取到FORM的设计文件！'
				return false;
			}
			
			var xdoc = Request.loadXML(xml);

			var pageDom = xdoc.getElementsByTagName("page").item(0);

			var state = self.readAttrVal(pageDom, 'state', 'default');
			//初始化控件ID序号
			self.compnum = 0;

			//生成所有form控件
			self.parseFormXML(pageDom, state);
			
			//把元素添加到页面中
			self.insertCompHtml();
			
			var b = (new Date()).getTime();
			JxHint.hint('use time(ms): ' + (b-a)); 
		};

		//从数据库中读取设计文件，colnums指表单缺省显示几列
		var params = 'funid=sys_fun_base&eventcode=query_formdes';
			params += '&selfunid='+ this.nodeId +'&colnums=' + this.colnums;
		Request.dataRequest(params, hdCall, {type:'xml', wait:true});
	},

	/**
	 * 删除设计文件，再打开时则显示缺省设计
	 **/
	deleteDesign: function() {
		var self = this;
		var hdcall = function() {
			var params = 'funid=sys_fun_base&eventcode=deletefd';
				params += '&selfunid='+self.nodeId+'&selpagetype=form';

			//发送请求保存设计文件到数据库中，删除后重新加载
			Request.postRequest(params, function() {
				//删除当前设计元素
				self.parentEl.select('div.fdes-fielditem, div.fdes-columnitem, div.fdes-formitem').remove();

				//重新加载设计文件
				self.readDesign();
			});
		};
		//'删除后将加载缺省设计，确定删除设计文件吗？'
		Ext.Msg.confirm(jx.base.hint, jx.fun.tip04, function(btn) {
			if (btn == 'yes') hdcall();
		});
	},
	
	/**
	 * 同步fielditem控件的xtype\title\visible属性，以字段列表中的为依据，不存在的fielditem控件将删除；
	 * 找到所有fielditem控件，分别检查每个控件与字段信息比较。
	 **/
	updateDesign: function() {
		var self = this;
		var propnum = 0;
		//字段数据格式：{'colcode': {xtype:'', title:'', visible:''}, ...}
		var hdCall = function(fds) {
			//取所有fielditem控件
			var fields = self.parentEl.query('div.fdes-fielditem');
			//分别检查每个fielditem设计元素
			for (var i = 0, n = fields.length; i < n; i++) {
				var item = fields[i];
				var colcode = self.readAttrVal(item, 'colcode', '');
				if (colcode.length == 0) continue;
				//根据字段名找到字段定义信息
				var fieldData = fds[colcode];
				//如果没有该字段，则删除控件
				if (fieldData == null && colcode.length > 0) {
					Ext.fly(item).remove();
					continue;
				}
				
				//同步属性
				var xtype = self.readAttrVal(item, 'xtype', '');
				if (fieldData.xtype != xtype && xtype != 'hidden') {
					item.setAttribute('xtype', fieldData.xtype);
					propnum++;
				}
				var title = self.readAttrVal(item, 'title', '');
				if (fieldData.title != title) {
					item.setAttribute('title', fieldData.title);
					item.innerHTML = fieldData.title;
					propnum++;
				}
				var visible = self.readAttrVal(item, 'visible', '');
				if (fieldData.visible == 'false' && visible == 'true') {
					item.setAttribute('visible', fieldData.visible);
					Ext.fly(item).addClass('fdes-fieldhidden');
					propnum++;
				}
			}
			
			JxHint.hint(String.format(jx.fun.syntip, propnum));//'同步了【'+propnum+'】个属性'
		};
		
		//从数据库中读取字段信息
		var params = 'funid=sys_fun_base&eventcode=query_field';
			params += '&selfunid='+ self.nodeId;
		Request.dataRequest(params, hdCall);
	},

	/**
	 * 修改属性，打开修改控件属性的对话框
	 * 只有formitem与fielditem可以设置属性，formitem是设置fieldset属性。
	 **/
	updateProp: function() {
		var self = this;
		if (self.selectDivs.length == 0) {
			JxHint.alert(jx.fun.tip05);//'当前没有选择的控件，请选择需要设置属性的控件！'
			return;
		}
		if (self.selectDivs.length > 1) {
			JxHint.alert(jx.fun.tip06);//'只能设置一个控件的属性，当前选择了多个控件！'
			return;
		}
		var curdom = self.selectDivs[0];
		var curel = Ext.fly(curdom);
		var propSrc = {};
		var winTitle = jx.fun.setprop;	//'设置字段控件属性';
		var isform = curel.hasClass('fdes-formitem');
		if (isform) {
			winTitle = jx.fun.setset;	//'设置FieldSet属性';
			propSrc = {
				//id: self.readAttrVal(curdom, 'id', ''),
				title: self.readAttrVal(curdom, 'title', ''),
				collapsible: self.readAttrVal(curdom, 'collapsible', 'false') == 'true',
				collapsed: self.readAttrVal(curdom, 'collapsed', 'false') == 'true'
			};
		}
		var iscolumn = curel.hasClass('fdes-columnitem');
		if (iscolumn) return;
		var isfield = curel.hasClass('fdes-fielditem');
		if (isfield) {
			propSrc = {
				//id: self.readAttrVal(curdom, 'id', ''),
				xtype: self.readAttrVal(curdom, 'xtype', ''),
				title: self.readAttrVal(curdom, 'title', ''),
				colcode: self.readAttrVal(curdom, 'colcode', ''),
				visible: self.readAttrVal(curdom, 'visible', 'true') == 'true'
			};
		}
		
		//创建属性表格
		var propsGrid = new Ext.grid.PropertyGrid({
			border: false,
			width: 300,
			source: propSrc
		});
		propsGrid.getColumnModel().setColumnWidth(0, 30);

		//创建对话框
		var win = new Ext.Window({
			title:winTitle,
			layout:'fit',
			width:300,
			height:250,
			modal:true,
			closeAction:'close',
			items:[propsGrid],

			buttons: [{
				text:jx.base.ok,	//'确定',
				handler:function(){
					var src = propsGrid.getSource();
					
					if (isfield || isform) curdom.setAttribute('title', src.title);
					//curdom.setAttribute('colwidth', src.colwidth);
					if (isform) curdom.setAttribute('collapsible', src.collapsible.toString());
					if (isform) curdom.setAttribute('collapsed', src.collapsed.toString());
					if (isfield) curdom.setAttribute('xtype', src.xtype);
					if (isfield) curdom.setAttribute('colcode', src.colcode);
					if (isfield) curdom.setAttribute('visible', src.visible.toString());
					//更新页面信息
					if (isfield) {
						if (curdom.innerHTML != src.title) {
							curdom.innerHTML = src.title;
						}
						if (src.visible == true || src.visible == 'true') {
							Ext.fly(curdom).removeClass('fdes-fieldhidden');
						} else {
							Ext.fly(curdom).addClass('fdes-fieldhidden');
						}
					}

					win.close();
				}
			},{
				text:jx.base.cancel,	//'取消',
				handler:function(){win.close();}
			}]
		});
		win.show();
	},
	
	/**
	 * 弹出字段列表对话框，设计面板上有的字段在列表中是选择状态，否则为非选择状态；
	 * 点击列表中的字段，可以反转选择状态，并添加或删除设计面板上的字段控件。
	 **/
	selectField: function() {
		var self = this;
		//添加或删除设计页面上的字段
		var clickField = function(list, index) {
			var store = list.getStore();
			var record = store.getAt(index);
			var colcode = record.get('colcode');
			//如果选择了就删除控件，否则添加控件
			if (list.isSelected(index)) {
				list.deselect(index);
				self.parentEl.select('div.fdes-fielditem[colcode='+ colcode +']').remove();
			} else {
				list.select(index);
				self.createComponent('fdes-fielditem', {
					colcode:colcode, 
					xtype:record.get('xtype'), 
					title:record.get('title'), 
					visible:record.get('visible')
				});
			}
		};
		//把设计面板中的所有字段标记为已选择
		var flagSelect = function(list) {
			var store = list.getStore();
			var fields = self.parentEl.query('div.fdes-fielditem');
			for (var i = 0, n = fields.length; i < n; i++) {
				var colcode = self.readAttrVal(fields[i], 'colcode');
				if (colcode.length > 0) {
					store.each(function(r){
						if (r.get('colcode') == colcode) {
							list.select(r);
							return false;
						}
						return true;
					});
				}
			}
		};
	
		//字段数据格式：{'colcode': {xtype:'', title:'', visible:''}, ...}
		var hdCall = function(fds) {
			//构建列表数据源，格式：[[colcode, xtype, title, visible],...]
			var data = [];
			for(key in fds){
				var item = fds[key];
                if(item !== undefined){
                    data[data.length] = [key, item.xtype, item.title, item.visible];
                }
            }
			var store = new Ext.data.ArrayStore({
				data: data,
				fields: ['colcode','xtype','title','visible']
			});
			//创建字段列表对象
			var list = new Ext.ListView({
				store: store,
				style: 'background-color:#fff;',
				hideHeaders: true,
				columns: [{//'名称'
					header: jx.fun.name, dataIndex: 'title', width:.4
				},{//'代码'
					header: jx.fun.code, dataIndex: 'colcode', width:.6
				}],
				listeners: {click: clickField, afterrender:flagSelect}
			});
			//创建对话框
			var win = new Ext.Window({
				title:jx.fun.selfld,	//'选择字段',
				layout:'fit',
				width:250,
				height:400,
				modal:true,
				closeAction:'close',
				items:[list]
			});
			win.show();
		};
		
		//从数据库中读取字段信息
		var params = 'funid=sys_fun_base&eventcode=query_field';
			params += '&selfunid='+ self.nodeId;
		Request.dataRequest(params, hdCall);
	},
	
	/**
	 * 批量创建布局元素，并设置为当前选择的控件。
	 * 
	 * rows -- 几行，一个背景格子的高度算一行
	 * cols -- 几列，两个背景格子的宽度算一列，最多三列
	 **/
	createLayout: function(rows, cols) {
		var self = this;
		//var divs = [], m = 0;
		
		//form的xy坐标
		var fx = self.initpos.formx;
		var fy = self.getFormBottom() + 10;
		
		//创建一个form，高度为rows
		var fh = rows*30 + 20;
		var fw = self.initsize.formw;
		var newEl = self.createComponent('fdes-formitem', {left:fx, top:fy, width:fw, height:fh});
		//divs[m++] = newEl.dom;
		
		//创建cols个colum
		for (var i = 0; i < cols; i++) {
			var cx = i*self.initsize.colw + i*20 + fx + 5;
			var cy = fy + 5;
			var cw = self.initsize.colw;
			var ch = rows*30;
			var newEl = self.createComponent('fdes-columnitem', {left:cx, top:cy, width:cw, height:ch});
			
			//divs[m++] = newEl.dom;
		}

		//标志选择的控件
		//self.flagSelectDivs(divs);
	},
	
	/**
	 * private 取最底部的form的底边位置
	 **/
	getFormBottom: function() {
		var self = this;
		var formItems = self.parentEl.query('div.fdes-formitem');
		
		var max = 0;
		for (var i = 0, n = formItems.length; i < n; i++) {
			var el = Ext.fly(formItems[i]);
			
			var bottom = el.getY() + el.getHeight();
			if (bottom > max) max = bottom;
		}
		//如果没有form，则设置为35
		if (max == 0) {
			max = 25;
		} else {
			max = max - self.parentEl.getY();
		}
		
		return max;
	},

	/**
	 * 根据样式创建缺省布局元素，工具栏按钮创建控件时使用
	 * 
	 * cls -- CSS样式名
	 * o -- 扩展参数对象，参数有：{left, top, width, height, colcode, title, visible, xtype}
	 **/
	createComponent: function(cls, o) {
		var self = this, o = o||{};
		var id = 'cust-comp' + self.compnum;
		//新建控件的位置
		var xy = ';top:'+ (o.top||45) +'px;left:'+ (o.left||750) +'px;';
		
		var style = '', hcls = '', prop = '', cont = id;
		if (cls == 'fdes-formitem') {
			style = 'width:' + (o.width||self.initsize.formw) + ';height:' + (o.height||self.initsize.formh);
		} else if (cls == 'fdes-columnitem') {
			style = 'width:' + (o.width||self.initsize.colw) + ';height:' + (o.height||self.initsize.colh);
		} else {
			//字段选择时用，添加新的字段控件
			if (o.title && o.title.length > 0) {
				cont = o.title;
				if (o.visible == 'false') hcls = ' fdes-fieldhidden';
				
				prop += ' title="'+ o.title +'"';
				prop += ' colcode="'+ o.colcode +'"';
				prop += ' visible="'+ o.visible +'"';
				prop += ' xtype="'+ o.xtype +'"';
			}
			style = 'width:' + self.initsize.fieldw + ';height:' + self.initsize.fieldh;
		}

		var html = '<div id='+id+' class="'+ cls + hcls +' x-unselectable" style="'+ style + xy +'"'+ prop +'>'+ cont +'</div>';
		
		return self.createComponentByHtml(id, html);
	},
	
	/**
	 * 根据html添加控件，并赋予可拖动与缩放的功能
	 * 
	 * id -- 控件ID
	 * html -- 控件的html
	 **/
	createComponentByHtml: function(id, html) {
		var self = this;
		self.compnum++;
		
		//添加控件并取当前控件
		var curEl = self.parentEl.insertHtml('beforeEnd', html, true);
		//添加移动与缩放属性
		self.addCompDD(curEl);
		
		return curEl;
	},
	
	/**
	 * 把readDesign方法中的元素对象的html添加到全局变量中
	 **/
	addCompHtml: function(id, html) {
		this.compnum++;
		if (this.compHtml == undefined) {
			this.compHtml = '';
		}
		
		//添加布局元素的html
		this.compHtml += html;
	},
	
	/**
	 * 把readDesign方法中的元素对象添加页面中
	 **/
	insertCompHtml: function() {
		var self = this;
		self.parentEl.insertHtml('beforeEnd', self.compHtml);
		
		var selector = 'div.fdes-fielditem, div.fdes-columnitem, div.fdes-formitem';
		//要添加true参数，否则取到的是fly共享对象
		self.parentEl.select(selector, true).each(self.addCompDD, self);
		
		//清除临时全局变量
		self.compHtml = null;
		delete self.compHtml;
	},
	
	/**
	 * 给布局元素添加移动、缩放特性
	 * el -- 元素
	 **/
	addCompDD: function(el) {
		var self = this;
		//创建拖动对象；暂时不处理限制移动范围，因为当设计面板的scroll.top大于0时，创建的控件移动有问题。
		var dd = new Ext.dd.DD(el.dom.id);
        dd.setXConstraint(800, 800, 10);
        dd.setYConstraint(1500, 1500, 10);//modify by tony.tan, 原来的值是500，调整为1500，方面调整多字段界面。
		self.designDDs.push(dd);
		
		//点击时，才创建可缩放对象，提供性能
		el.on('click', function(){
			var curEl = this, hasRe = false;
			Ext.each(self.designResizes, function(item){
				if (item.getEl().id == curEl.id) {
					hasRe = true; return;
				}
			});
			//如果已创建了缩放对象，则不用创建了
			if (hasRe) return;
			
			var re = new Ext.Resizable(curEl, {minWidth:120, minHeight:22});
			//调整form的高度，内部column高度自动调整
			self.resizeForm(re);
			self.designResizes.push(re);
		});
		
		//双击时显示属性设置
		el.on('dblclick', function(){self.updateProp();});
		//处理单个控件的选择、拖动事件
		self.initClickEl(el);
	},
	
	/**
	 * 根据form的调整高度，调整内部所有column的高度
	 * re -- 缩放对象
	 **/
	resizeForm: function(re) {
		var self = this;
		var curEl = re.getEl();
		if (curEl.hasClass('fdes-formitem')) {
			//缩放前记住有哪些子控件
			re.on('beforeresize', function(re){
				var formEl = re.getEl();
				re.childCols = self.findChilds(formEl.dom, 'div.fdes-columnitem');
				return true;
			}, self);
			//缩放后调整子控件的高度
			re.on('resize', function(re, w, h){
				Ext.each(re.childCols, function(item){
					Ext.fly(item).setHeight(h - 18);
				});
				re.childCols = null;
				return true;
			}, self);
		}
	},

	/**
	 * 删除控件
	 **/
	deleteComponent: function() {
		var self = this;
		if (self.selectDivs.length == 0) {
			JxHint.alert(jx.fun.tip07);//'当前没有选择的控件，请选择需要删除的控件！'
			return;
		}

		//var hdcall = function() {
			Ext.each(self.selectDivs, function(item){
				Ext.fly(item).remove();
			});
			self.selectDivs = [];
		//}

		//Ext.Msg.confirm('提示', '确定删除选择的控件吗？', function(btn) {
		//	if (btn == 'yes') hdcall();
		//});
	},

	/**
	 * 生成页面中所有form控件
	 * 
	 * pageDom -- 页面元素
	 * state -- 设计状态default|design
	 **/
	parseFormXML: function(pageDom, state) {
		var self = this;
		var formDoms = pageDom.getElementsByTagName("formitem");

		var defx = self.initpos.formx;
		var defy = self.initpos.formy, starty = defy;

		//生成每个form控件
		for (var i = 0, n = formDoms.length; i < n; i++) {
			//初始状态自动计算form的y坐标
			if (state == 'default') {
				defy = (self.initsize.formh)*i + i*(self.initpos.formi) + starty;
			}

			var node = formDoms.item(i);
			var x = self.readAttrVal(node, 'x', defx);
			var y = self.readAttrVal(node, 'y', defy);
			var w = self.readAttrVal(node, 'width', self.initsize.formw);
			var h = self.readAttrVal(node, 'height', self.initsize.formh);
			
			var id = 'form-comp'+self.compnum;
			//var id = self.readAttrVal(node, 'id', defid);
			var title = self.readAttrVal(node, 'title', '');
			var collapsible = self.readAttrVal(node, 'collapsible', '');
			var collapsed = self.readAttrVal(node, 'collapsed', '');

			var html = 
				'<div id="'+id+'" class="fdes-formitem x-unselectable" style="top:'+y+';left:'+x+';width:'+w+';height:'+h+
				';" title="'+title+'" collapsible="'+collapsible+'" collapsed="'+collapsed+'">F</div>';

			self.addCompHtml(id, html);
			
			//生成form内的所有column控件
			self.parseColumnXML(node, state, x, y);
		}
	},

	/**
	 * 生成form中所有column控件
	 * 
	 * formDom -- form设计信息
	 * state -- 设计状态default|design
	 * formx -- form元素的x坐标
	 * formy -- form元素的y坐标
	 **/
	parseColumnXML: function(formDom, state, formx, formy) {
		var self = this;
		var columnDoms = formDom.getElementsByTagName("columnitem");
		
		var defx = formx + self.initpos.colx, startx = defx;
		var defy = formy + self.initpos.coly;

		//生成每个column控件
		for (var i = 0, n = columnDoms.length; i < n; i++) {
			//初始状态自动计算column的x坐标
			if (state == 'default') {
				defx = (self.initsize.colw)*i + i*(self.initpos.coli) + startx;
			}

			var node = columnDoms.item(i);
			var x = self.readAttrVal(node, 'x', defx);
			var y = self.readAttrVal(node, 'y', defy);
			var w = self.readAttrVal(node, 'width', self.initsize.colw);
			var h = self.readAttrVal(node, 'height', self.initsize.colh);
			
			var id = 'col-comp'+self.compnum;
			//var id = self.readAttrVal(node, 'id', defid);
			var colwidth = self.readAttrVal(node, 'colwidth', '0.33');

			var html = 
				'<div id="'+id+'" class="fdes-columnitem x-unselectable" style="top:'+y+';left:'+x+';width:'+w+';height:'+h+
				';" colwidth="'+colwidth+'">C</div>';

			self.addCompHtml(id, html);
			
			//生成column内的所有field控件
			self.parseFieldXML(node, state, x, y);
		}
	},

	/**
	 * 生成页面中所有form控件
	 * 
	 * columnDom -- column设计信息
	 * state -- 设计状态default|design
	 * colx -- column元素的x坐标
	 * coly -- column元素的y坐标
	 **/
	parseFieldXML: function(columnDom, state, colx, coly) {
		var self = this;
		var fieldDoms = columnDom.getElementsByTagName("fielditem");

		var defx = colx + self.initpos.fieldx;
		var defy = coly + self.initpos.fieldy, starty = defy;

		//生成每个form控件
		for (var i = 0, n = fieldDoms.length; i < n; i++) {
			//初始状态自动计算field的y坐标
			if (state == 'default') {
				defy = (self.initsize.fieldh)*i + i*(self.initpos.fieldi) + starty;
			}

			var node = fieldDoms.item(i);
			var x = self.readAttrVal(node, 'x', defx);
			var y = self.readAttrVal(node, 'y', defy);
			var w = self.readAttrVal(node, 'width', self.initsize.fieldw);
			var h = self.readAttrVal(node, 'height', self.initsize.fieldh);
			
			var id = 'field-comp'+self.compnum;
			//var id = self.readAttrVal(node, 'id', defid);
			var title = self.readAttrVal(node, 'title');
			var colcode = self.readAttrVal(node, 'colcode');
			var visible = self.readAttrVal(node, 'visible');
			var xtype = self.readAttrVal(node, 'xtype');

			//修改隐藏字段的样式
			var hiddenCls = '';
			if (visible == 'false')	{
				hiddenCls = 'fdes-fieldhidden';
			}

			var html =  
				'<div id="'+id+'" class="fdes-fielditem x-unselectable '+hiddenCls+'" style="top:'+y+';left:'+x+';width:'+w+';height:'+h+
				';" title="'+title+'" colcode="'+colcode+
				'" visible="'+visible+'" xtype="'+xtype+'">'+ title +'</div>';

			self.addCompHtml(id, html);
		}
	},
	
	/**
	 * 取页面中所有页面控件，保存设计文件时用
	 **/
	queryDesignItems: function() {
		var self = this;
		var formItems = self.parentEl.query('div.fdes-formitem');
		var columnItems = self.parentEl.query('div.fdes-columnitem');
		var fieldItems = self.parentEl.query('div.fdes-fielditem');
		
		return {form:formItems, column:columnItems, field:fieldItems};
	},
	
	/**
	 * 判断是否所有控件都保存了
	 * items -- 遗漏控件，格式：{form:[], column:[], field:[]}
	 **/
	hasNoSaveItem: function(items) {
		if (items.form.length > 0) return true;
		if (items.column.length > 0) return true;
		if (items.field.length > 0) return true;
		return false;
	},
	
	/**
	 * 取页面中所有form控件，暂时只考虑一层form控件
	 * 
	 * parent -- 画布控件
	 **/
	formItemToXML: function(parent) {
		var self = this;
		var formcont = "";
		var formitems = self.findChilds(parent, 'div.fdes-formitem');
		if (formitems.length == 0) {
			JxHint.alert(jx.fun.tip08);//'没有找到FORM布局控件，不能保存！'
			return formcont;
		}
		
		//按y坐标值排序
		self.orderComponent(formitems, 'y');
		//判断form是否有重叠
		if (!self.validCompRegion(formitems)) {
			JxHint.alert(jx.fun.tip09);//'FORM布局控件有重叠，不能保存！'
			return formcont;
		}

		//组合每个formitem的设计信息
		for (var i = 0, n = formitems.length; i < n; i++) {
			var fe = Ext.fly(formitems[i]);
			var x = fe.getX() - self.parentEl.getX();
			var y = fe.getY() - self.parentEl.getY();
			var w = fe.getWidth();
			var h = fe.getHeight();

			var id = self.readAttrVal(formitems[i], 'id');
			var title = self.readAttrVal(formitems[i], 'title');
			var collapsible = self.readAttrVal(formitems[i], 'collapsible');
			var collapsed = self.readAttrVal(formitems[i], 'collapsed');
			
			//取一列的控件信息
			var colXML = self.columnItemToXML(formitems[i]);
			if (colXML.length == 0) return '';
			
			formcont += "\t<formitem x='"+ x +"' y='"+ y +"' width='"+ w +"' height='"+ h +
						"' id='"+ id +"' title='"+ title +"' collapsible='"+ collapsible +
						"' collapsed='"+ collapsed +"'>\r";
			formcont += colXML;
			formcont += "\t</formitem>\r";
			
			//标记该控件已保存了
			self.designItems.form.remove(formitems[i]);
		}

		return formcont;
	},

	/**
	 * 取某form中所有column控件
	 * parent -- form布局控件
	 **/
	columnItemToXML: function(parent) {
		var self = this;
		var colcont = "";
		var colitems = self.findChilds(parent, 'div.fdes-columnitem');
		if (colitems.length == 0) {
			JxHint.alert(jx.fun.tip10);//'没有找到COLUMN布局控件，不能保存！'
			return colcont;
		}
		
		//按x坐标值排序
		self.orderComponent(colitems, 'x');
		//判断COLUMN是否有重叠
		if (!self.validCompRegion(colitems)) {
			JxHint.alert(jx.fun.tip11);//'COLUMN布局控件有重叠，不能保存！'
			return colcont;
		}

		//组合每个columnitem的设计信息
		for (var i = 0, n = colitems.length; i < n; i++) {
			var fe = Ext.fly(colitems[i]);
			var x = fe.getX() - self.parentEl.getX();
			var y = fe.getY() - self.parentEl.getY();
			var w = fe.getWidth();
			var h = fe.getHeight();

			var id = self.readAttrVal(colitems[i], 'id');
			//var colwidth = self.readAttrVal(colitems[i], 'colwidth');

			//重新计算列的宽度
			var scale = (w/(self.initsize.formw)).toFixed(2);
			if (scale >= 0.9) {
				scale = 0.99;
			} else if (scale >= 0.6) {
				scale = 0.66;
			} else if (scale > 0.45 && scale < 0.6) {
				scale = 0.495;
			} else {
				scale = 0.33;
			}

			colcont += "\t\t<columnitem x='"+ x +"' y='"+ y +"' width='"+ w +"' height='"+ h +
						"' id='"+ id +"' colwidth='"+ scale +"'>\r";

			colcont += self.fieldItemToXML(colitems[i]);
			
			colcont += "\t\t</columnitem>\r";
			
			//标记该控件已保存了
			self.designItems.column.remove(colitems[i]);
		}

		return colcont;
	},

	/**
	 * 取某列中所有的输入控件
	 * parent -- 列布局控件
	 **/
	fieldItemToXML: function(parent) {
		var self = this;
		var fieldcont = "";
		var fielditems = self.findChilds(parent, 'div.fdes-fielditem');

		//按y坐标值排序
		self.orderComponent(fielditems, 'y');

		//组合每个fielditem的设计信息
		for (var i = 0, n = fielditems.length; i < n; i++) {
			var fe = Ext.fly(fielditems[i]);
			var x = fe.getX() - self.parentEl.getX();
			var y = fe.getY() - self.parentEl.getY();
			var w = fe.getWidth();
			var h = fe.getHeight();

			var id = self.readAttrVal(fielditems[i], 'id');
			var title = self.readAttrVal(fielditems[i], 'title');
			var colcode = self.readAttrVal(fielditems[i], 'colcode');
			var visible = self.readAttrVal(fielditems[i], 'visible', 'true');
			var xtype = self.readAttrVal(fielditems[i], 'xtype');

			//计算控件宽度的比例，默认100%，如果宽度小于缺省值一定值时才计算比例
			var anchor = 100;
			if (w < self.initsize.fieldw-30) {
				anchor = parseInt(w*100/(self.initsize.fieldw));
			}

			//如果控件的高度超过缺省值的1.5，则认为是area控件否则是text
			if (h > (self.initsize.fieldh * 1.5)) {
				xtype = 'area';
			}

			//判断是否隐藏控件
			if (visible != 'true') {
				xtype = 'hidden';
			} else {
				if (xtype == 'hidden') xtype = 'text';
			}

			fieldcont += "\t\t\t<fielditem x='"+ x +"' y='"+ y +"' width='"+ w +"' height='"+ h +
						 "' id='"+ id +"' title='"+ title +"' colcode='"+ colcode +
						 "' visible='"+ visible +"' xtype='"+ xtype +"' anchor='"+anchor+"'/>\r";
						 
			//标记该控件已保存了
			self.designItems.field.remove(fielditems[i]);
		}

		return fieldcont;
	},

	/**
	 * 读取对象指定属性的值
	 * element -- 对象
	 * attrName -- 属性名
	 * defval -- 如果没有该属性或属性值为空的缺省值
	 **/
	readAttrVal: function(element, attrName, defval) {
		var val = element.getAttribute(attrName) || '';
		if (val.length == 0) val = defval||'';

		return val;
	},

	/**
	 * 根据控件的某个属性值排序
	 * comps -- 控件数组
	 **/
	orderComponent: function(comps, flag) {
		var mincomp, currval, minval = 0;
		for (var i = 0, n = comps.length; i < n; i++) {
			if (flag == 'x') {
				minval = Ext.fly(comps[i]).getX();
			} else {
				minval = Ext.fly(comps[i]).getY();
			}

			for (var j = i+1, m = comps.length; j < m; j++) {
				if (flag == 'x') {
					currval = Ext.fly(comps[j]).getX();
				} else {
					currval = Ext.fly(comps[j]).getY();
				}

				if (minval > currval) {
					mincomp = comps[i];
					comps[i] = comps[j];
					comps[j] = mincomp;
					minval = currval;
				}
			}
		}
	},
	
	/**
	 * 检查控件的边界不能重叠，判断重叠的方法：
	 * 一个div任意相邻的两条边如果都在另一个div中，说明它们重叠。
	 * comps -- 控件数组
	 **/
	validCompRegion: function(comps) {
		for (var i = 0, n = comps.length; i < n; i++) {
			var oneEl = Ext.fly(comps[i]);
			var x1 = oneEl.getX();
			var y1 = oneEl.getY();
			var r1 = x1 + oneEl.getWidth();
			var b1 = y1 + oneEl.getHeight();
			
			for (var j = i+1, m = comps.length; j < m; j++) {
				var twoEl = Ext.fly(comps[j]);
				var x2 = twoEl.getX();
				var y2 = twoEl.getY();
				var r2 = x2 + twoEl.getWidth();
				var b2 = y2 + twoEl.getHeight();
				
				//判断左、上两条边在one中
				if ((x1 < x2 && r1 > x2) &&
					(y1 < y2 && b1 > y2)) {
					return false;
				}
				//判断上、右条边在one中
				if ((y1 < y2 && b1 > y2) &&
					(x1 < r2 && r1 > r2)) {
					return false;
				}
				//判断右、下条边在one中
				if ((x1 < r2 && r1 > r2) &&
					(y1 < b2 && b1 > b2)) {
					return false;
				}
				//判断下、左条边在one中
				if ((y1 < b2 && b1 > b2) &&
					(x1 < x2 && r1 > x2)) {
					return false;
				}
			}
		}
		return true;
	},
	
	/**
	 * public，现在主要用于表单设计器中
	 * 找某种类型的子元素，如果子控件的中心点在本元素内就算是它的子元素
	 * parent -- 父元素
	 * selector -- 查询匹配符
	 **/
	findChilds: function(parent, selector) {
		var self = this;
		//返回的子元素
		var rets = [], m = 0;
		var parentEl = Ext.fly(parent);

		//取父元素的top与bottom的值
		var topMin = parentEl.getY();
		var topMax = topMin + parentEl.getHeight();
		
		//取父元素的left与right的值
		var leftMin = parentEl.getX();
		var leftMax = leftMin + parentEl.getWidth();
		
		//取className的所有子元素
		var childs = self.parentEl.query(selector);

		//判断是否父控件内
		for (var i = 0, n = childs.length; i < n; i++) {
			var childEl = Ext.fly(childs[i]);

			var cx = childEl.getX();
			var cy = childEl.getY();
			var cw = childEl.getWidth();
			var ch = childEl.getHeight();
			
			//计算子控件的中心点位置
			var rx = cx + cw/2;
			var ry = cy + ch/2;

			if (rx >= leftMin && rx <= leftMax && 
				ry >= topMin && ry <= topMax) {
				rets[m++] = childs[i];
			}
		}

		return rets;
	},
	
	//===========================下面是一个独立的类，为了调用方便放到一个文件中了===================================
	//使用了上面的参数有：
	//parentEl -- 作为容器对象
	//findChilds -- 取指定控件位置内的控件
	/**
	 * 当前批量选择的控件，是dom对象数组
	 **/
	selectDivs: [],
	
	/**
	 * 记录是否开始多选控件的状态，
	 * 在mousemove，并按住Ctrl键时，设置值为true，mouseup时设置为false
	 **/
	selectDowned: false,
	
	/**
	 * 记录开始多选时的鼠标位置
	 **/
	selectOldXY: [],
	
	/**
	 * 记录是否开始拖动选择的状态，
	 * 在mousemove，并按住Ctrl键时，设置值为true，mouseup时设置为false
	 **/
	moveDowned: false,
	
	/**
	 * 当前点击拖动的控件，是Element对象
	 **/
	moveDownEl: null,
	
	/**
	 * 记录开始拖动时的鼠标位置
	 **/
	moveOldX: 0,
	moveOldY: 0,
	
	/**
	 * 记录批量选择的控件外围位置，{x, y, width, height}
	 **/
	moreDivPos: null,
	
	/**
	 * 初始化，给容器添加事件
	 **/
	initDd: function() {
		var self = this;
		//添加批量选择控件的事件
		self.parentEl.on('mousedown', self.moreMouseDown, self);
		self.parentEl.on('mouseup', self.moreMouseUp, self);
		self.parentEl.on('mousemove', self.moreMouseMove, self);
		//如果是点击画布，则清除控件选择
		/*self.parentEl.on('click', function(e, t){
			if (e.ctrlKey) return;
			var el = Ext.fly(t);
			if (!el.hasClass('fdes-formitem') && 
				!el.hasClass('fdes-columnitem') && 
				!el.hasClass('fdes-fielditem')) {
				//销毁标志DIV，有时误操作没有销毁
				var flagEl = self.parentEl.first('#select_flag_div');
				if (flagEl) flagEl.remove();
				//清除选择的对象
				self.clearSelectDivs();
			}
		});*/
	},
	/******************************下面是处理选择多个控件的操作**********************************/
	/**
	 * private
	 * 开始框选控件：创建框选标志DIV，要求按住CTRL键
	 **/
	moreMouseDown: function(e) {
		var self = this;
		//必须要按ctrl键才有效
		//if (!e.ctrlKey) return;	//简化处理，不需要按CTRL键
		self.parentEl.select('#select_flag_div').remove();
		self.selectDowned = true;
		//取消文本选择
		if (Ext.isIE) {
			self.parentEl.dom.onselectstart = function(){return false;};
		}
		
		var xy = e.getXY();
		//鼠标位置必须去掉容器控件的位置
		var pxy = self.parentEl.getXY();
		var x = xy[0] - pxy[0];
		var y = xy[1] - pxy[1];
		//保存鼠标点击的位置
		self.selectOldXY = [x, y];
		//创建鼠标框选标志DIV
		self.parentEl.insertHtml('afterBegin', 
		'<div id="select_flag_div" class="fdes-selectdiv" style="left:'+ x +'px;top:'+ y +'px;"></div>');
	},
	
	/**
	 * private
	 * 结束框选控件：添加选择的控件对象；销毁框选标志DIV
	 **/
	moreMouseUp: function(e) {
		var self = this;
		if (!self.selectDowned) return;
		//清除状态信息
		self.clearSelectDivs();
		if (Ext.isIE) {
			self.parentEl.dom.onselectstart = null;
		}
		
		//取框选标志DIV
		var flagEl = self.parentEl.first('#select_flag_div');
		//取选择的控件
		var divs = self.findChilds(flagEl, 'div.fdes-fielditem, div.fdes-columnitem, div.fdes-formitem');
		//标志选择的控件
		self.flagSelectDivs(divs);
		
		//销毁标志
		flagEl.remove();
	},
	
	/**
	 * private
	 * 调整框选标志的大小
	 **/
	moreMouseMove: function(e) {
		var self = this;
		if (!self.selectDowned) return;
		//取框选标志DIV
		var flagEl = self.parentEl.first('#select_flag_div');
		var xy = e.getXY();
		var pxy = self.parentEl.getXY();
		//取当前鼠标相对位置、与鼠标点击时的位置
		var x = xy[0] - pxy[0], y = xy[1] - pxy[1];
		var ox = self.selectOldXY[0], oy = self.selectOldXY[1];
		
		//取绝对值，设置框选对象的宽与高
		var w = Math.abs(x - ox);
		var h = Math.abs(y - oy);
		flagEl.setWidth(w);
		flagEl.setHeight(h);
		
		//设置选择的区域
		if (x > ox && y < oy) {			//表示鼠标向上移动
			flagEl.setTop(y);
		} else if (x < ox && y < oy) {	//表示鼠标向左上移动
			flagEl.setTop(y);
			flagEl.setLeft(x);
		} else if (x < ox && y > oy) {	//表示鼠标向左移动
			flagEl.setLeft(x);
		}
	},
	
	/**
	 * 设置选择对象的样式
	 * selected -- true 表示选择，false 表示取消选择
	 **/
	selectCss: function(selected) {
		var divs = this.selectDivs;
		for (var i = 0, n = divs.length; i < n; i++) {
			var childEl = Ext.fly(divs[i]);
			
			if (selected) {
				childEl.addClass('fdes-selectcomp');
			} else {
				childEl.removeClass('fdes-selectcomp');
			}
		}
	},
	
	/**
	 * public
	 * 标志当前控件为选择的控件
	 **/
	flagSelectDivs: function(divs) {
		if (divs == null || divs.length == 0) return;
		
		var self = this;
		//清除原来的控件
		self.selectCss(false);
	
		//标志新的选择的控件
		self.selectDivs = divs;
		//标志选择的字段样式
		self.selectCss(true);
		//保存选择的控件初始位置
		self.selectXY();
		//保存选择的控件的外围位置
		self.moreDivPos = self.getMoreDivPos();
	},
	
	/**
	 * public
	 * 清除选择控件的标记
	 **/
	clearSelectDivs: function() {
		var self = this;
		self.selectCss(false);
		self.selectDivs = [];
		self.moreDivPos = null;
		self.selectDowned = false;
	},
	
	/**
	 * public
	 * 判断当前选择的元素是否在批量选择元素中
	 * curDiv -- 当前选择当个元素
	 **/
	isSelectDiv: function(curDiv) {
		var divs = this.selectDivs;
		for (var i = 0, n = divs.length; i < n; i++) {
			var div = divs[i];
			if (curDiv.id == div.id) return true;
		}
		return false;
	},
	
	/**
	 * private
	 * 保存当前选择的元素初始XY
	 **/
	selectXY: function() {
		var self = this;
		var divs = self.selectDivs;
		for (var i = 0, n = divs.length; i < n; i++) {
			self.saveOldXY(divs[i]);
		}
	},
	
	/**
	 * private
	 * 保存一个选择的元素初始XY，考虑了滚动条的位置
	 **/
	saveOldXY: function(div) {
		var childEl = Ext.fly(div);
		//要处理滚动条的距离
		var scroll = this.layoutEl.getScroll();
		if (scroll.top != 0) {
			var oldX = childEl.getX() + scroll.left;
			var oldY = childEl.getY() + scroll.top;
			div.oldXY = [oldX, oldY];
		} else {
			div.oldXY = childEl.getXY();
		}
	},
	
	/******************************下面是处理选择单个控件的操作**********************************/
	/**
	 * public
	 * 初始化控件事件。下面的方法必须放到新的function中，否则会报错，暂时还未查到原因
	 *
	 * 移动控件有两种方法：
	 * 1、记录当前选择的控件，根据控件移动位置确定其它控件的移动位置，现在采用此方法：问题是点击的控件与其它移动不同步
	 * 2、记录当前鼠标点击的位置，根据鼠标移动位置确定其它控件的移动位置，问题有：要取消dd移动设置，且不能处理移动步长设置
	 **/
	initClickEl: function(clickEl) {
		var self = this;
		clickEl.on('mousedown', function(e){self.oneMouseDown(clickEl, e);});
		clickEl.on('mousemove', function(e){self.oneMouseMove(e);});
		clickEl.on('mouseup', function(e){self.oneMouseUp(e);});
	},
	
	/**
	 * public
	 * 单击容器中的控件，并给控件标志
	 **/
	oneMouseDown: function(clickEl, e) {
		var self = this;
		
		//判断当前点击的控件是否在已选控件中
		var isMore = self.isSelectDiv(clickEl.dom, self.selectDivs);
		
		//是已选控件：如果按住CTRL，则取消选择，否则标志开始移动
		if (isMore) {
			if (e.ctrlKey) {
				clickEl.removeClass('fdes-selectcomp');
				self.selectDivs.remove(clickEl.dom);
				//重新计算选择控件的外围位置
				self.moreDivPos = self.getMoreDivPos();
			} else {
				//如果没有按住CTRL键，则标志开始拖动
				if (self.selectDivs.length > 1) {
					self.moveOldX = clickEl.getX();
					self.moveOldY = clickEl.getY();
					self.moveDowned = true;
					self.moveDownEl = clickEl;
				}
			}
		} else {
		//不是已选控件：如果按住CTRL，则添加为已选，否则清除原已选标志新已选
			self.oneClickEl(clickEl, e);
		}
	},
	
	/**
	 * public
	 * 处理容器中控件的鼠标移动事件
	 **/
	oneMouseMove: function(e) {
		var self = this;
		if (!self.moveDowned) return;
		var scroll = self.layoutEl.getScroll();
		//取鼠标移动的间隔值，要考虑滚动条的位置
		var curEl = self.moveDownEl;
		var dx = curEl.getX() - self.moveOldX - scroll.left;
		var dy = curEl.getY() - self.moveOldY - scroll.top;
		
		//判断控件是否超过边框
		var vx = self.validMoreDivX(dx);
		var vy = self.validMoreDivY(dy);
		
		//批量选择的控件都要移动
		for (var i = 0, n = self.selectDivs.length; i < n; i++) {
			var item = self.selectDivs[i];
			var itemEl = Ext.fly(item);
			//oldXY是自定义属性，在批量选择控件时设置
			var oldXY = item.oldXY;
			
			//如果选择框的左右边都在容器范围内，则可以调整X值
			if (vx) {
				itemEl.setX(oldXY[0] + dx);
			}
			//如果选择框的上下边都在容器范围内，则可以调整Y值
			if (vy) {
				itemEl.setY(oldXY[1] + dy);
			}
		}
	},
	
	/**
	 * public
	 * 处理容器中控件的鼠标提起事件
	 **/
	oneMouseUp: function(e) {
		var self = this;
		if (!self.moveDowned) return;
		
		//重新设置选择控件的原位置与边框大小
		self.selectXY();
		self.moreDivPos = self.getMoreDivPos();
		
		//清除状态值
		self.moveOldX = 0;
		self.moveOldY = 0;
		self.moveDownEl = null;
		self.moveDowned = false;
	},
	
	/**
	 * private
	 * 单击容器中的控件，如果没有按CTRL，则值保留当前控件为已选
	 **/
	oneClickEl: function(clickEl, e) {
		var self = this;
		if (!e.ctrlKey) {
			self.clearSelectDivs();
		}
		
		//添加到选择的控件中
		var len = self.selectDivs.length;
		self.selectDivs[len] = clickEl.dom;
		clickEl.addClass('fdes-selectcomp');
		
		//保存控件初始位置
		self.saveOldXY(clickEl.dom);
		//重新计算选择控件的外围位置
		self.moreDivPos = self.getMoreDivPos();
	},
	//=======================下面三个方法是处理多选控件移动时不能超出边框=====================
	/**
	 * private
	 * 取批量控件的位置数组值，返回[x, y, width, height]
	 **/
	getMoreDivPos: function() {
		var self = this;
		//取最左部控件的left值，取最小值
		var minx = 1000000;
		for (var i = 0, n = self.selectDivs.length; i < n; i++) {
			var itemEl = Ext.fly(self.selectDivs[i]);
			
			if (itemEl.getX() < minx) minx = itemEl.getX();
		}
		//取最上部控件的top值，取最小值
		var miny = 1000000;
		for (var i = 0, n = self.selectDivs.length; i < n; i++) {
			var itemEl = Ext.fly(self.selectDivs[i]);
			
			if (itemEl.getY() < miny) miny = itemEl.getY();
		}
		//取最右部控件的right边框位置，取最大值
		var maxr = 0;
		for (var i = 0, n = self.selectDivs.length; i < n; i++) {
			var itemEl = Ext.fly(self.selectDivs[i]);
			
			var right = itemEl.getX() + itemEl.getWidth();
			if (right > maxr) maxr = right;
		}
		//取最下部控件的bottom边框位置，取最大值
		var maxb = 0;
		for (var i = 0, n = self.selectDivs.length; i < n; i++) {
			var itemEl = Ext.fly(self.selectDivs[i]);
			
			var bottom = itemEl.getY() + itemEl.getHeight();
			if (bottom > maxb) maxb = bottom;
		}
		
		var width = maxr-minx;
		var height = maxb-miny;
		var pxy = self.parentEl.getXY();
		var x = minx - pxy[0];
		var y = miny - pxy[1];
		//测试边框计算是否准确
		//self.parentEl.insertHtml('afterBegin', 
		//'<div id="select_flag_div1" class="fdes-selectdiv" style="left:'+ x +'px;top:'+ y +'px;width:'+ width +'px;height:'+ height +'px;"></div>');
		
		return {x:x, y:y, width:width, height:height};
	},
	
	/**
	 * private
	 * 检查批量控件移动的X值是否在容器内
	 **/
	validMoreDivX: function(movex) {
		var self = this;
		//取容器的x与width
		var px = 0;//self.parentEl.getX();
		var pw = self.parentEl.getWidth();
		
		//取批量控件边框的x与width
		var sx = self.moreDivPos.x;
		var sw = self.moreDivPos.width;
		
		//说明左边超界
		if ((sx + movex) < px) return false;
		//说明右边超界
		if ((sx + sw + movex) > (px + pw)) return false;
		
		return true;
	},
	
	/**
	 * private
	 * 检查批量控件移动的Y值是否在容器内
	 **/
	validMoreDivY: function(movey) {
		var self = this;
		//取容器的y与height
		var py = 0;//self.parentEl.getY();
		var ph = self.parentEl.getHeight() - 20;
		
		//取批量控件边框的y与height
		var sy = self.moreDivPos.y;
		var sh = self.moreDivPos.height;
		
		//说明上边超界
		//if ((sy + movey) < py) return false; //modify by tony.tan, 方面调整多字段界面。
		//说明下边超界
		//if ((sy + sh + movey) > (py + ph)) return false; //modify by tony.tan, 方面调整多字段界面。
		
		return true;
	}
};

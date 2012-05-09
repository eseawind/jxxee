/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 表格页面的基类对象。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

Ext.ns('Jxstar');
Jxstar.GridNode = function(config){
	//节点配置信息
	this.config = config;
	//表格定义信息
	this.param = config.param;
	//选择模式[check|row]
	this.selectModel = this.param.selectModel||'';

	//功能定义ID
	this.nodeId = this.param.funid;
	//功能页面类型，用于判断显示哪些事件按钮与是否生成可编辑表格
	this.pageType = this.param.isedit=='1'?'editgrid':'grid';

	//功能定义对象
	this.define = Jxstar.findNode(this.nodeId);
	//事件定义对象
	this.event = new Jxstar.GridEvent(this.define);

	//功能页面对象
	this.page = null;
	
	//父功能ID，用于控制子功能的操作权限
	this.parentNodeId = '';

	//是否设计状态 0 运行状态 1 设计状态
	this.state = '0';
	
	//当前功能权限信息，与读取按钮信息同时读出来
	this.right = {edit:'1', print:'1', audit:'1', other:'1'};
	
	//处理字段多语言文字
	if (this.state == '0') {
		JxLang.gridField(this.nodeId, this.param.cols);
	}
};

Jxstar.GridNode.prototype = {
	/**
	 * 显示功能页面，外部调用主要方法。
	 * pageType -- 页面类型，根据需要在显示时确定页面用途类型
	 * parentNodeId -- 父功能ID
	 **/
	showPage: function(pageType, parentNodeId){
		//如果外部给页面类型，则取外部的值
		if (pageType != null) {
			this.pageType = pageType;
			//如果是可编辑子表，则该为可编辑页面类型
			if (pageType == 'subgrid' && this.param.isedit=='1') {
				this.pageType = 'subeditgrid';
			}
			if (pageType == 'grid' && this.param.isedit=='1') {
				this.pageType = 'editgrid';
			}
		}
		
		//设置父功能ID
		if (parentNodeId != null) this.parentNodeId = parentNodeId;

		//创建页面
		if (!this.createPage()) return;
		//扩展自定义事件信息
		this.extEvent();
		//如果是下拉选项数据，则不要工具栏
		if (this.pageType.indexOf('notool') < 0) {
			//创建工具栏，同时执行页面扩展方法
			this.createTool();
		}
		//添加页面扩展方法（临时处理，还需要检查在页面扩展中可能需要处理按钮的情况）
		this.initPage();

		//返回页面对象
		return this.page;
	},

	/**
	 * 创建功能内容对象，用于扩展。
	 **/
	createPage: function(){
		var gm = this.param;
		if (gm == null || gm.cols == null || gm.cols.length == 0) {
			//'创建页面的字段参数为空！'
			JxHint.alert(jx.node.nofields);
			return false;
		}

		var grid = null, self = this;
		//用于保存字段信息
		var fields = [], mycols = gm.cols;
		//用于添加列序号列与复选框列
		var cols = [];
		//添加序号列
		var rn = new Ext.grid.RowNumberer();
		cols[0] = rn;
		
		//定义列控件序号、列字段序号
		var sn = 1, fn = 0;
		
		//这些类型的表格不需要显示checkbox
		var noCheck = (self.pageType == 'notoolgrid') || 
					  (self.pageType == 'combogrid');
		
		var sm = null;
		//添加复选框
		if (self.selectModel == 'check' || (self.selectModel == '' && !noCheck)) {
			sm = new Ext.grid.CheckboxSelectionModel();
			cols[sn] = sm;
			sn++;
		}
		
		//添加扩展插件列
		if (self.param.plugins != null) {
			cols[sn] = self.param.plugins;
			sn++;
		}
		
		//组合列信息
		for (var i = 0; i < mycols.length; i++) {
			//如果没有列则不处理
			var mc = mycols[i].col;
			if (mc == null) continue;
			
			//取字段信息
			var mf = mycols[i].field;
			if (mf != null) {
				fields[fn++] = mf;
			
				//列的排序字段就采用字段名
				mc.dataIndex =  mf.name;
				//以字段名作为列ID
				mc.id =  mf.name;
			}
			
			//把列信息组合
			cols[sn++] = mc;
		}
		//创建列显示对象
		var cm = new Ext.grid.ColumnModel(cols);
		
		//查询数据URL
		var url = Jxstar.path + '/commonAction.do?eventcode=query_data&funid=queryevent&pagetype='+self.pageType;
			url += '&query_funid='+gm.funid+'&user_id='+Jxstar.session['user_id'];
		
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
			}, fields),
			remoteSort: true,
			sortInfo: gm.sorts,
			pruneModifiedRecords: true
		});
		//如果表格内容有修改，则提示是否取消编辑。
		var dataModify = function(st, rs){
			//开始查询数据的时间
			Jxstar.st = (new Date()).getTime();
			
			var mrow = st.getModifiedRecords();//取记录集中修改的内容
			if (mrow.length > 0) {
				//'重新加载数据后，新增或修改记录会丢失，请确认是否保存修改内容！'
				if (confirm(jx.node.reloaddata)) {
					self.event.editSave();
					return false;
				}
			}
			return true;
		};
		store.on('beforeload', dataModify);
		
		//配置信息
		var config = {
			loadMask: true,
			columnLines: true,	//显示列分隔线
			store: store,
			cm: cm,
			sm: sm,
			stripeRows: true,	//显示斑马线
			enableHdMenu: (self.state != '0'),		//运行时屏蔽表头菜单
			enableColumnMove: (self.state != '0'),	//运行时禁止表头移动

			clicksToEdit:1		//单击编辑数据
		};
		//显示查询过滤器
		/*if (self.state == '0' && self.param.hasQuery === '1') {
			var filter = new Jxstar.JxFilter();
			config.plugins = [filter];
		}*/
		//添加扩展插件
		if (self.param.plugins != null) {
			config.plugins = self.param.plugins;
		}

		//如果是下拉选项数据，则不要工具栏self.pageType != 'combogrid' && 
		if (self.pageType.indexOf('notool') < 0) {
			var tcfg = {deferHeight:true, items:[{text:' '}]};
			//处理：FF下工具栏高度为27px，IE为29px，通过下面设置后为27px
			if (Ext.isIE) tcfg.style = 'padding:1px;';
			//创建工具栏，先创建一个空按钮，保证在chrome中显示正常
			var tbar = new Ext.Toolbar(tcfg);
			config.tbar = tbar;
		}

		//设计状态不需要分页栏
		if (self.state == '0' && self.pageType.indexOf('notool') < 0 && !self.param.hidePageTool) {
			config.bbar = new Ext.PagingToolbar({
				deferHeight:true,
				pageSize: Jxstar.pageSize,
				store: store,
				plugins: (self.pageType != 'combogrid') ? new Ext.ux.JxPagerTool() : null,
				displayInfo: (self.pageType != 'combogrid'),
				displayMsg: '共 {2} 条',	//'显示 {0} -- {1}  共 {2} 条'
				emptyMsg: jx.node.datano		//'没有记录'
			});
		}

		//创建表对象
		if (self.pageType.indexOf('edit') >= 0) {
			grid = new Ext.grid.EditorGridPanel(config);
			//已复核的记录不能编辑
			grid.on('beforeedit', function(event) {
				var r = event.record;
				var a = self.define.auditcol;
				var s = r.get(a);	//记录状态值
				if (s == null || s.length == 0) s = '0';
				if (s != '0' && s != '6') return false;
				
				//没有编辑权限的不能编辑
				if (self.right.edit == '0') return false;
				
				//没有保存按钮或不可用，则不能编辑
				var tools = event.grid.getTopToolbar();
				var saveBtn = JxUtil.getButton(tools, 'save_eg');
				if (saveBtn == null || saveBtn.disabled) return false;
				
				return true;
			});
		} else {
			grid = new Ext.grid.GridPanel(config);
			//双击打开form记录
			grid.on('rowdblclick', function(grid, n, event) {
				if (self.pageType == 'grid' || self.pageType == 'chkgrid') {
					self.event.showForm();
				} else if (self.pageType == 'subgrid') {
					self.event.showSubForm();
				} else if (self.pageType == 'import') {
					self.event.imp();
				} else if (self.pageType == 'imptype') {
					self.event.impType();
				}
			});
		}
		//记录当前选择的记录行号
		grid.getSelectionModel().on('rowselect', function(select, index, record){
			grid.selectKeyId = record.get(self.define.pkcol);
		});
		//加载数据后调用回调函数
		store.on('load', function(){
			Jxstar.loadDataBc(grid);
			
			//加载数据所花的时间
			Jxstar.et = (new Date()).getTime(); 
			var useTime = Jxstar.et - Jxstar.st;
			JxHint.hint('use time(ms): ' + useTime); 
			/*if (useTime >= 5000) {
				//'页面加载时间超过{0}ms，请您关闭浏览器重启应用系统！'
				var msg = String.format(jx.node.limittime, useTime);
				alert(msg);
			}*/
			
			//每次加载数据后，IE强制回收内存
			if(Ext.isIE){CollectGarbage();}
		});
		//添加表格控件注销事件，效果不明显
		grid.on('beforedestroy', function(gp){
			gp.pkName = null;			delete gp.pkName;
			gp.fkName = null;			delete gp.fkName;
			gp.fkValue = null;			delete gp.fkValue;
			gp.pageType = null;			delete gp.pageType;
			gp.isShow = null;			delete gp.isShow;
			gp.selectKeyId = null;		delete gp.selectKeyId;
			gp.jxstarParam = null;		delete gp.jxstarParam;
			gp.gridNode.destroy();
			gp.gridNode = null;			delete gp.gridNode;
			gp.cmpTree = null;			delete gp.cmpTree;
			gp.treeNodeAttr = null;		delete gp.treeNodeAttr;
			
			if (gp.qryCt) {Ext.destroy(gp.qryCt, gp.qryCt.el);}
			gp.qryCt = null;			delete gp.qryCt;
			gp = null;
			
			return true;
		});
		
		//设置单选模式
		if (self.selectModel == 'row' || (noCheck && self.selectModel != 'check')) {
			grid.getSelectionModel().singleSelect = true;
		}

		//构建表格相关参数对象
		grid.jxstarParam = {};
		//添加功能主键与外键
		grid.pkName = self.define.pkcol;
		grid.fkName = self.define.fkcol;
		
		//初始是否显示数据，在Jxstar中加载数据
		grid.isShow = gm.isshow;
		grid.pageType = self.pageType;
		
		//临时处理办法，将来采用全局对象来管理程序对象
		grid.gridNode = self;
		//设置事件对象的页面
		self.event.setPage(grid);
		//设置页面对象
		self.page = grid;
		
		//如果显示查询方案，则添加查询工具栏，避免出现表格延时移动
		if (self.state == '0' && (self.param.hasQuery == null || self.param.hasQuery==true)) {
			if (Jxstar.systemVar.useCase == '1') {
				grid.on('render', function(g){
					if (Ext.isEmpty(g.tbar)) return;
					g.qryCt = new Ext.Container({
						renderTo:g.tbar,
						style:'padding:1px;',
						cls:'tool-query x-small-editor',
						height:26
					});
				});
			}
		}

		return true;
	},

	/**
	 * 创建工具栏对象。
	 **/
	createTool: function(){
		var params = 'funid=queryevent&eventcode=query_loadtb&selpfunid='+this.parentNodeId;
		if (this.state == '1') {
			params += '&selfunid=sys_fun_base&selpagetype=desgrid';
		} else {
			params += '&selfunid='+this.nodeId + '&selpagetype='+this.pageType;
		}
		
		var self = this;
		var hdCall = function(json) {
			//如果打开功能立即关闭，会存在page为null
			if (self.page == null || json == null) return;
			//取按钮数组
			var items = json.buttons;
			//取权限信息
			var right = json.right;
			if (right) self.right = right;
			
			var ei = self.event;
			var tbar = self.page.getTopToolbar();
			
			//保存按钮快捷键与事件
			//var akeys = [];
			//标示按钮段号，如果在不同的段位加分隔栏
			var dnum = 0;
			//保存扩展按钮
			var extItems = [];
			
			//给按钮对象分配事件
			for (var i = 0, n = items.length; i < n; i++){
				//处理按钮多语言文字
				JxLang.eventLang(self.nodeId, items[i]);
			
				//按钮显示类型[tool|menu]
				var showType = items[i].showType;
			
				if (items[i].method.length > 0) {
					var h = ei[items[i].method];
					var a = items[i].args;
					//自定义方法用事件代码作为参数
					if (items[i].method == 'customEvent') {
						a = [items[i].eventCode];
					}
					
					items[i].scope = ei;
					if (a != null && a.length > 0) {
						items[i].handler = h.createDelegate(ei, a);
					} else {
						items[i].handler = h;
					}
				}
				
				//如果没有定义事件的样式，则取缺省样式
				var hasCss = Ext.util.CSS.getRule('.'+items[i].iconCls);
				if (hasCss == null && showType != 'menu') {
					items[i].iconCls = 'eb_empty';
				}
				
				//添加分隔栏
				var idx = items[i].eventIndex;
				if (idx == null || idx.length == 0) idx = '0';
				idx = parseInt(parseInt(idx)/100);
				if (idx > dnum) {
					if (i > 0) {
						if (extItems.length > 0) {
							extItems[extItems.length] = '-';
						} else {
							tbar.add('-');
						}
					}
					dnum = idx;
				}

				//如果是显示到菜单，则添加扩展栏中
				if (showType == 'menu') {
					extItems[extItems.length] = items[i];
				} else {
					//添加按钮
					tbar.add(items[i]);	
				}

				//给按钮事件分配快捷键:CTRL+CHAR
				/*if (items[i].accKey.length > 0 && items[i].method.length > 0) {
					var akey = {};
					akey.key = items[i].accKey;
					akey.ctrl = true;
					akey.fn = items[i].handler;
					akeys.push(akey);
				}*/
			}
			//添加扩展工具栏
			var fn = self.config.toolext;
			if (fn && typeof fn == 'function') {
				fn(self, tbar, extItems);
			}
			
			//添加扩展按钮
			if (extItems.length > 0) {
				var extMenu = new Ext.menu.Menu({items: extItems});
				tbar.add({
					eventCode: 'ext_menu',
					text:jx.node.extmenu,//'扩展操作…'
					iconCls: 'eb_menu',
					menu: extMenu
				});
			}

			//添加查询条件
			if (self.state == '0' && (self.param.hasQuery == null || self.param.hasQuery==true)) {
				//右对齐
				tbar.add('->');
				//判断是采用原公共查询还是采用新的查询模式
				if (Jxstar.systemVar.useCase == '1') {
					JxQueryExt.showCase(self);
					if (',grid,editgrid,query,'.indexOf(','+self.pageType+',') >= 0) {
						JxGroupExt.showCase(self);
					}
				} else {
					Jxstar.createSimpleQuery(self);
				}
			}
			
			if (tbar.items != null && tbar.items.getCount() == 1) {
				tbar.hide();
			} else {
				tbar.doLayout();
			}
			
			//把快捷键事件分配给表格对象
			//if (akeys.length > 0) {
			//	var map = new Ext.KeyMap(self.id, akeys);
			//}
		};

		Request.dataRequest(params, hdCall);
	},

	/**
	 * 扩展自定义事件到this.event中。
	 **/
	extEvent: function(){
		var scope = this;
		var cfg = this.config.eventcfg;
		if (cfg) {
			Ext.apply(this.event, cfg);
		}
	},
		
	/**
	 * 页面加载完后执行的方法，参数有表格对象与功能定义对象。
	 **/
	initPage: function(){
		var scope = this;
		var fn = this.config.initpage;
		if (typeof fn == 'function') {
			fn(scope);
		}
	},
	
	/**
	 * 设置设计状态 0 运行状态 1 设计状态。
	 **/
	setState: function(state) {
		this.state = state;
	},
	
	/**
	 * 销毁grid页面对象
	 **/
	destroy: function() {
		this.config = null;			delete this.config;
		this.param = null;			delete this.param;
		this.selectModel = null;	delete this.selectModel;
		this.nodeId = null;			delete this.nodeId;
		this.pageType = null;		delete this.pageType;
		this.id = null;				delete this.id;
		this.define = null;			delete this.define;
		this.event.myDestroy();
		this.event = null;			delete this.event;
		this.page = null;			delete this.page;
		this.parentNodeId = null;	delete this.parentNodeId;
		this.state = null;			delete this.state;
		this.right = null;			delete this.right;
	}
};

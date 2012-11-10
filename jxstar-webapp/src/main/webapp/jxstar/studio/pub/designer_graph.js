/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */

/**
 * 导航流程图设计器
 **/
Jxstar.currentPage = {
	/**
	 * 设计面板容器
	 **/
	layoutEl: null,

	/**
	 * 设计面板
	 **/
	parentEl: null,

	/**
	 * 当前设计流程ID
	 **/
	graphId: '',

	/**
	 * 布局元素ID序号
	 **/
	compnum: 0,

	/**
	 * 当前选中的控件，方便删除当前控件
	 **/
	currentComp: null,

	/**
	 * 当前绘图对象
	 **/
	editor: null,

	/**
	 * 显示设计器
	 **/
	render: function(graphId, runState, parent, grid) {
		var self = this;
		//参数初始化
		this.graphId = graphId;
		this.layoutEl = parent;
		
		//设计面板html
		//mx_toolbar_nav,mx_graph_nav在editor.xml中用到，mx_splash在mxCanvas.js中用到
		var htmls = [
		'<div id="mx_page_nav" style="background-color:#deecfd;height:100%;">',
		'<table border="0" width="90%">', 
			'<tr>',
				'<td id="mx_toolbar_nav" style="width:16px;padding-left:5px;" valign="top">',
				'</td>',
				'<td valign="top" style="border-width:1px;border-style:solid;border-color:#99BBE8;">',
					'<div id="mx_graph_nav" style="position:relative;height:480px;width:100%;background-color:white;overflow:hidden;cursor:default;">',
						'<center id="mx_splash" style="padding-top:230px;">',
							'<img src="public/lib/graph/images/loading.gif">',
						'</center>',
					'</div>',
				'</td>',
			'</tr>',
		'</table>',
		'</div>'];
		
		//设计面板的工具栏
		var tbar = parent.getTopToolbar();
		//检查parent中是否有设计面板
		var designPanel = parent.getComponent(0);
		if (designPanel) {
			//删除所有新增按钮
			tbar.removeAll(true);
			tbar.add({text:' '});//chrome中用于布局
		} else {
			//创建设计面板，用于处理滚动条
			designPanel = new Ext.Panel({
				border: false,
				height: 500,
				html: htmls.join('')
			});
			
			parent.add(designPanel);
		}
		//销毁设计面板中的对象，有部分vml对象不能删除
		parent.on('beforedestroy', function(){
			if (Jxstar.editorNav) {
				Jxstar.editorNav.destroy();
				mxClient.dispose();
				Jxstar.editorNav = null;
			}
			
			designPanel.removeAll(true);
			designPanel.destroy();
			designPanel = null;
			return true;
		});
		
		var imageMenu = [
			{text:jx.base.del+' Del', handler:function(){self.editor.execute('delete');}},		//删除
			{text:jx.base.undo+' Ctrl+Z', handler:function(){self.editor.execute('undo');}},	//撤销
			{text:jx.base.cut+' Ctrl+X', handler:function(){self.editor.execute('cut');}},		//剪切
			{text:jx.base.copy+' Ctrl+C', handler:function(){self.editor.execute('copy');}},	//复制
			{text:jx.base.paste+' Ctrl+V', handler:function(){self.editor.execute('paste');}},	//粘贴
			{text:jx.wfx.group, handler:function(){self.editor.execute('group');}},				//分组
			{text:jx.wfx.ungroup, handler:function(){self.editor.execute('ungroup');}},			//取消分组
			{text:jx.wfx.setpic, handler:function(){self.setImagePath();}}						//设置图片
		];
		var sizeMenu = [
			{text:jx.wfx.zoomin, handler:function(){self.editor.execute('zoomIn');}},			//'放大'
			{text:jx.wfx.zoomout, handler:function(){self.editor.execute('zoomOut');}},			//'缩小'
			{text:jx.wfx.actual, handler:function(){self.editor.execute('actualSize');}},		//'实际'
			{text:jx.wfx.fit, handler:function(){self.editor.execute('fit');}}					//'填充'
		];
		var extMenu = [
			{text:jx.wfx.del, iconCls:'eb_delete', handler:function(){self.deleteDesign();}},	//'删除设计'
			//{text:jx.wfx.imp, iconCls:'eb_imp', handler:function(){self.importDesign();}},	//'导入设计'
			{text:jx.wfx.exp, iconCls:'eb_exp', handler:function(){self.exportDesign();}}		//'导出设计'
		];
		
		//由于工具栏保存的事件对象是原self对象的，所以必须先删除再创建
		tbar.add(
			{text:jx.base.save, iconCls:'eb_save', handler:function(){self.saveDesign();}},		//'保存'
			{xtype:'tbseparator'},
			{text:jx.wfx.extdo, iconCls: 'eb_menu', menu: extMenu},								//'扩展操作…'
			{xtype:'tbseparator'},
			{text:jx.wfx.prop, iconCls:'eb_prop', id:'set_attri', handler:function(){self.modifyDefine();}},//'设置属性'
			{xtype:'tbfill'},
			{xtype:'tbseparator'},
			{text:jx.wfx.picdo, iconCls: 'eb_menu', menu: imageMenu},							//'图形操作…'
			{text:jx.wfx.sizedo, iconCls: 'eb_menu', menu: sizeMenu}							//'缩放操作…'
		);

		//必须要刷新布局，否则取不到el
		parent.doLayout();
		self.parentEl = designPanel.el;
		
		//创建绘图对象，在layout中清空
		if (Jxstar.editorNav == null) {
			//加载图形库
			JxUtil.loadJxGraph();
			var editor = new mxCanvas('public/lib/graph/config/editor_nav.xml');
			self.editor = editor;
			Jxstar.editorNav = editor;
		} else {
			self.editor = Jxstar.editorNav;
		}
		
		//如果过程已禁用，则流程图不能修改了；
		//如果过程已启用，理论上应该不能修改，如果要修改则需要创建新版本；
		//现在的处理方式是只能修改节点属性，但流程图不能修改；
		self.disableDesign(runState);
		
		//加载设计文件
		self.readDesign();
	},
	
	/**
	 * 处理流程图的可编辑性。
	 **/
	disableDesign: function(runState) {
		var disabled = (runState != '0');
		
		//禁用的流程图不能编辑，启用的流程图只能选择节点设置属性
		this.editor.graph.setEnabled(runState != '3');
		this.editor.graph.setConnectable(!disabled);
		this.editor.graph.setDropEnabled(!disabled);
		this.editor.graph.setCellsDeletable(!disabled);
		this.editor.graph.setCellsMovable(!disabled);
		//只有定义时，才可以用图形按钮
		Ext.fly('mx_toolbar_nav').setDisplayed(!disabled);
		//处理工具栏状态，定义时所有按钮可以用，启用时设置属性可以用，禁用时都不可用
		var tbar = this.layoutEl.getTopToolbar();
		tbar.setDisabled(disabled);
		tbar.getComponent('set_attri').setDisabled(runState == '3');
	},
	
	/**
	 * 保存设计文件，不检查图形的合理性。
	 **/
	saveDesign: function() {
		var self = this,
			enc = new mxCodec(),
			graph = self.editor.graph,
			nodeGraph = enc.encode(graph.getModel());
		//设计文件转换为xml文件
		var xmlFile = mxUtils.getPrettyXml(nodeGraph);
		var e = encodeURIComponent; //编码, 处理isHexDigit异常
		var params = 'funid=wfnav_graph&eventcode=savedesign&pagetype=formdes&graph_id=' + 
					  self.graphId + '&xmlfile=' + e(xmlFile);
		Request.postRequest(params, null);
	},
	
	/**
	 * 从系统中读取设计文件。
	 **/
	readDesign: function() {
		var self = this;
		//读取设计文件后的回调函数
		var hdCall = function(xmlfile) {
			if (xmlfile == null || xmlfile.length == 0) { 
				xmlfile = "<?xml version='1.0' encoding='utf-8'?>";
				xmlfile += "<mxGraphModel><root><mxCell id='0'/><mxCell id='1' parent='0'/></root></mxGraphModel>";
			}
			
			var doc = mxUtils.parseXml(xmlfile);
			var dec = new mxCodec(doc);
			dec.decode(doc.documentElement, self.editor.graph.getModel());
		};

		//从数据库中读取设计文件
		var params = 'funid=wfnav_graph&eventcode=readdesign&pagetype=formdes';
			params += '&graph_id='+ self.graphId;
		Request.dataRequest(params, hdCall, {type:'xml', wait:true});
	},
	
	/**
	 * 创建只有开始与结束节点的图形。
	 * 由于不能把nodetype属性值带上，暂时不使用该方法。
	 **/
	createDesign: function() {
		var self = this, 
			graph = self.editor.graph,
			model = graph.getModel(),
			//parent = model.getCell('1'),
			parent = graph.getDefaultParent();
		
		model.beginUpdate();
		try {
			var startNode = graph.insertVertex(parent, null, jx.wfx.start, 20, 20, 80, 40, 'hexagon');//'开始'
			var endNode = graph.insertVertex(parent, null, jx.wfx.end, 30, 250, 40, 40, 'doubleEllipse');//'结束'
		} finally {
			model.endUpdate();
		}
	},
	
	/**
	 * 删除当前设计文件，同时删除流程定义信息。
	 **/
	deleteDesign: function() {
		var self = this, 
			graph = self.editor.graph,
			parent = graph.getDefaultParent();
		
		//删除后台设计文件
		var endcall = function() {
			graph.selectCells(true, true, parent);
			var cells = graph.getSelectionCells();
			graph.removeCells(cells, true);
		};
		
		var hdcall = function() {
			var params = 'funid=wfnav_graph&eventcode=deldesign&pagetype=formdes&graph_id=' + self.graphId;
			Request.postRequest(params, endcall);
		};
		//'确定删除当前所有设计信息吗？'
		Ext.Msg.confirm(jx.base.hint, jx.wfx.delyes, function(btn) {
			if (btn == 'yes') hdcall();
		});
	},
	
	/**
	 * 导出设计文件为xml文件到前台。
	 **/
	exportDesign: function() {
		var self = this,
			enc = new mxCodec(),
			node = enc.encode(self.editor.graph.getModel()),
			xmlFile = mxUtils.getPrettyXml(node);

		var fileWin = new Ext.Window({
			title:jx.wfx.showdes,	//'显示设计文件',
			layout:'fit',
			width:750,
			height:500,
			resizable: true,
			modal: true,
			closeAction:'close',
			items:[{xtype:'textarea', name:'wfnav_graph__design_file', border:false, value:xmlFile, 
						 style:'font-size:12px;border-width:0;line-height:20px;', readOnly:true}]
		});
		fileWin.show();
	},
	
	/**
	 * 选择设计文件导入到设计器中。
	 **/
	importDesign: function() {
		JxHint.alert('暂未实现！');
	},
	
	/**
	 * 修改流程元素定义属性。
	 **/
	modifyDefine: function() {
		var self = this,
			graph = self.editor.graph,
			cell = graph.getSelectionCell();
		if (cell == null) {
			JxHint.alert(jx.wfx.nopic);	//'没有选择图形元素！'
			return;
		}

		var objId = cell.getId();		//元素ID
		var enc = new mxCodec();
		var node = enc.encode(cell);	//解析为DOM对象时自定义属性才可以识别
		var nodetype = node.getAttribute('nodetype');	//取节点类型，如果是线则为空
		var source = node.getAttribute('source');		//取线的来源节点ID，如果是节点则值为空
		
		var funDefine = null;
		if (nodetype == 'task') {
		//设置任务属性
			funDefine = Jxstar.findNode('wfnav_node');
			funDefine.width = 650; funDefine.height = 350;
		} else {
			JxHint.alert(jx.wfx.tip02);//'当前选择元素不需要设置属性！'
			return;
		}
		
		self.setProcessAttr(objId, self.graphId, funDefine);
	},
	
	/**
	 * private 设置元素属性
	 * cellId -- 元素ID
	 * graphId -- 过程定义ID
	 * define -- 功能定义对象
	 **/
	setProcessAttr: function(cellId, graphId, define) {
		var funId = define.nodeid;
		var tableName = define.tablename;
		var fieldId = 'node_id';
		//加载判断条件属性
		var hdcall = function(page) {
			JxUtil.delay(500, function(){
				//加载显示数据
				var options = {
					where_sql: tableName + '.'+ fieldId +' = ? and '+ tableName +'.graph_id = ?',
					where_type: 'string;string',
					where_value: cellId+';'+graphId,
					callback: function(data) {
						//如果没有数据则执行新增
						if (data.length == 0) {
							page.formNode.event.create();
							
							//添加节点ID与过程ID缺省值
							page.getForm().set(tableName + '__' + fieldId, cellId);
							page.getForm().set(tableName + '__graph_id', graphId);
						} else {
							var r = page.formNode.event.newRecord(data[0]);
							
							page.getForm().myRecord = r;
							page.getForm().loadRecord(r);
						}
					}
				};
				Jxstar.queryData(funId, options);
			});
		};
		
		var pageurl = (funId == 'wf_nodeattr') ? define.layout : define.formpage;
		//显示数据对话框
		Jxstar.showData({
			filename: pageurl,
			title: define.nodetitle,
			width: define.width,
			height: define.height,
			nodedefine: define,
			callback: hdcall
		});
	},
	
	/**
	 * public 设置任务节点的图片文件
	 **/
	setImagePath: function() {
		var self = this;
			graph = self.editor.graph;
			curCell = graph.getSelectionCell();
		if (curCell == null) {
			JxHint.alert(jx.wfx.nopic);	//'没有选择图形元素！'
			return;
		}
		
		var style = curCell.getStyle();
		if (style.indexOf('image') != 0) {
			JxHint.alert(jx.wfx.tip03);	//'当前选择的图形元素不是图片节点，不能设置图片！'
			return;
		}
		
		//修改任务节点的图片样式；后台节点定义信息中图片文件；
		var hdcall = function(fileName) {
			graph.setCellStyles("image", fileName, [curCell]);
		};
		//'输入图片文件名' //缺省如
		Ext.Msg.prompt(jx.wfx.picname, jx.wfx.defval+': public/lib/graph/images/dude.png', function(btn, text) {
			if (btn != 'ok') return;
			if (text.length == 0) {
				JxHint.alert(jx.wfx.tip04);	//'请输入图片文件名含路径！'
				return;
			}
			
			//采用相对路径，去掉第一个/
			if (text.charAt(0) == '/') {
				text = text.substring(1);
			}
			
			hdcall(text);
		});
	}
};

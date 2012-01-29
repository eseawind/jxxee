/**
 * 流程设计器
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
	processId: '',

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
	render: function(processId, runState, parent, grid) {
		var self = this;
		//参数初始化
		this.processId = processId;
		this.layoutEl = parent;
		//表格事件对象
		var gevent = grid.gridNode.event;	
		
		//设计面板html
		var htmls = [
		'<div id="mx_page" style="background-color:#deecfd;height:100%;">',
		'<table border="0" width="90%">', 
			'<tr>',
				'<td id="mx_toolbar" style="width:16px;padding-left:5px;" valign="top">',
				'</td>',
				'<td valign="top" style="border-width:1px;border-style:solid;border-color:#99BBE8;">',
					'<div id="mx_graph" style="position:relative;height:480px;width:100%;background-color:white;overflow:hidden;cursor:default;">',
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
			if (Jxstar.editor) {
				Jxstar.editor.destroy();
				mxClient.dispose();
				Jxstar.editor = null;
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
			{text:jx.wfx.check, iconCls:'eb_check', handler:function(){gevent.checkwf();}},		//'验证定义'
			{text:jx.wfx.del, iconCls:'eb_delete', handler:function(){self.deleteDesign();}},	//'删除设计'
			//{text:jx.wfx.imp, iconCls:'eb_imp', handler:function(){self.importDesign();}},	//'导入设计'
			{text:jx.wfx.exp, iconCls:'eb_exp', handler:function(){self.exportDesign();}}		//'导出设计'
		];
		
		//由于工具栏保存的事件对象是原self对象的，所以必须先删除再创建
		tbar.add(
			{text:jx.base.save, iconCls:'eb_save', handler:function(){self.saveDesign();}},		//'保存'
			{text:jx.wfx.enable, iconCls:'eb_enable', handler:function(){gevent.enablewf();}},	//'启用流程'
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
		parent.getEl().setStyle('border-left-width', '1px');
		self.parentEl = designPanel.el;
		
		//创建绘图对象，在layout中清空
		if (Jxstar.editor == null) {
			//加载图形库
			JxUtil.loadJxGraph();
			var editor = new mxCanvas('public/lib/graph/config/editor.xml');
			self.editor = editor;
			Jxstar.editor = editor;
		} else {
			self.editor = Jxstar.editor;
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
		var disabled = (runState != '1');
		
		//禁用的流程图不能编辑，启用的流程图只能选择节点设置属性
		this.editor.graph.setEnabled(runState != '3');
		this.editor.graph.setConnectable(!disabled);
		this.editor.graph.setDropEnabled(!disabled);
		this.editor.graph.setCellsDeletable(!disabled);
		this.editor.graph.setCellsMovable(!disabled);
		//只有定义时，才可以用图形按钮
		Ext.fly('mx_toolbar').setDisplayed(!disabled);
		//处理工具栏状态，定义时所有按钮可以用，启用时设置属性可以用，禁用时都不可用
		var tbar = this.layoutEl.getTopToolbar();
		tbar.setDisabled(disabled);
		tbar.getComponent('set_attri').setDisabled(runState == '3');
	},
	
	/**
	 * 保存设计文件，保存前先检查图形的合理性，同时检查流程定义信息是否创建完整。
	 **/
	saveDesign: function() {
		var self = this,
			enc = new mxCodec(),
			graph = self.editor.graph,
			nodeGraph = enc.encode(graph.getModel()),
			rootNode = nodeGraph.getElementsByTagName('root')[0],
			mxCells = rootNode.childNodes;

		//提取所有流程节点与流转
		var mxNodes = [], mxLines = [], mxTaskNodes = [], mxBackLines = [];
		Ext.each(mxCells, function(item, i){
			var nodetype = item.getAttribute('nodetype');
			if (nodetype != null && nodetype.length > 0) {
				mxNodes.push(item);
				//取任务节点
				if (nodetype == 'task') {
					mxTaskNodes.push(item);
				}
			}
			var edge = item.getAttribute('edge');
			if (edge != null && edge.length > 0) {
				if (item.getAttribute('style') == 'straightConnector') {
				//取退回路径
					mxBackLines.push(item);
				} else {
				//取正常路径
					mxLines.push(item);
				}
			}
		});
		
		//检查图形的合理性
		if (!self.validDesign(mxNodes, mxLines)) return;
		//检查退回路径的合理性
		if (!self.validBackLines(mxTaskNodes, mxBackLines, mxLines)) return;
		//保存节点与线的设计信息
		var paramEl = self.paramDesign(mxNodes, mxLines);
		//设计文件转换为xml文件
		var xmlFile = mxUtils.getPrettyXml(nodeGraph);
		var e = encodeURIComponent; //编码, 处理isHexDigit异常
		var params = 'funid=wf_process&eventcode=savedesign&pagetype=formdes&process_id=' + 
					  self.processId + paramEl + '&xmlfile=' + e(xmlFile);
		Request.postRequest(params, null);
	},
	
	/**
	 * 检查图形的合理性。
	 **/
	validDesign: function(mxNodes, mxLines) {
		var self = this;
		//检查图形元素之间的有效性
		if (!self.validAllLine(mxLines)) return false;
		if (!self.validStartNode(mxNodes, mxLines)) return false;
		if (!self.validEndNode(mxNodes, mxLines)) return false;
		if (!self.validTaskNode(mxNodes, mxLines)) return false;
		if (!self.validSelectNode(mxNodes, mxLines)) return false;
		if (!self.validForkNode(mxNodes, mxLines)) return false;
		if (!self.validJoinNode(mxNodes, mxLines)) return false;
		
		return true;
	},
	
	/**
	 * 提取图形元素信息。
	 **/
	paramDesign: function(mxNodes, mxLines) {
		var params = '';
		//提取节点元素信息
		var nodeIds = [], nodeTypes = [], nodeTitles = [];
		for (var i = 0, n = mxNodes.length; i < n; i++) {
			var item = mxNodes[i];
			nodeIds[i] = item.getAttribute('id');
			nodeTypes[i] = item.getAttribute('nodetype');
			nodeTitles[i] = item.getAttribute('value');
		}
		
		//提取线条元素信息
		var lineIds = [], lineTypes = [], lineTitles = [], 
			lineSources = [], lineTargets = [];
		for (var i = 0, n = mxLines.length; i < n; i++) {
			var item = mxLines[i];
			lineIds[i] = item.getAttribute('id');
			lineTypes[i] = (item.getAttribute('style') == 'straightConnector') ? '1' : '0';
			lineTitles[i] = item.getAttribute('value');
			lineSources[i] = item.getAttribute('source');
			lineTargets[i] = item.getAttribute('target');
		}
		
		var e = encodeURIComponent; //编码，处理中文
		var params = '&nodeIds='+ nodeIds +'&nodeTypes='+ nodeTypes +'&nodeTitles='+ e(nodeTitles) +'&lineIds=' + 
					  lineIds + '&lineTypes='+ e(lineTypes) +'&lineTitles=' + e(lineTitles) + '&lineSources=' + 
					  lineSources + '&lineTargets=' + lineTargets;
		return params;
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
		var params = 'funid=wf_process&eventcode=readdesign&pagetype=formdes';
			params += '&process_id='+ self.processId;
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
			var params = 'funid=wf_process&eventcode=deldesign&pagetype=formdes&process_id=' + self.processId;
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
			items:[{xtype:'textarea', name:'wf_process__design_file', border:false, value:xmlFile, 
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
			funDefine = Jxstar.findNode('wf_nodeattr');
			funDefine.width = 650; funDefine.height = 400;
		} else if (nodetype == 'subprocess') {
		//设置子过程节点
			funDefine = Jxstar.findNode('wf_subprocess');
			funDefine.width = 400; funDefine.height = 150;
		} else if (source != null && source.length > 0) {
		//设置判断条件
			var srcNode = self.findNode(source);
			var srcType = srcNode.getAttribute('nodetype');
			if (srcType != 'select' && srcType != 'fork') {
				JxHint.alert(jx.wfx.tip01);//'只有判断与并发节点的流出线才需要设置条件！'
				return;
			}
			
			funDefine = Jxstar.findNode('wf_condition');
			funDefine.width = 500; funDefine.height = 200;
		} else {
			JxHint.alert(jx.wfx.tip02);//'当前选择元素不需要设置属性！'
			return;
		}
		
		self.setProcessAttr(objId, self.processId, funDefine);
	},
	
	/**
	 * private 设置元素属性
	 * cellId -- 元素ID
	 * processId -- 过程定义ID
	 * define -- 功能定义对象
	 **/
	setProcessAttr: function(cellId, processId, define) {
		var funId = define.nodeid;
		var tableName = define.tablename;
		var fieldId = (tableName == 'wf_condition') ? 'line_id' : 'node_id';
		//加载判断条件属性
		var hdcall = function(page) {
			JxUtil.delay(500, function(){
				if (funId == 'wf_nodeattr') {
					page = page.getComponent(0).getComponent(0);
				}
				//加载显示数据
				var options = {
					where_sql: tableName + '.'+ fieldId +' = ? and '+ tableName +'.process_id = ?',
					where_type: 'string;string',
					where_value: cellId+';'+processId,
					callback: function(data) {
						//如果没有数据则执行新增
						if (data.length == 0) {
							page.formNode.event.create();
							
							//添加节点ID与过程ID缺省值
							page.getForm().set(tableName + '__' + fieldId, cellId);
							page.getForm().set(tableName + '__process_id', processId);
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
	},
	
	/*************************** 私有方法：检验图形的合理性 ****************************/
	/**
	 * 检查所有的线都必须有来源与目标节点
	 **/
	validAllLine: function(mxLines) {
		var self = this;
		for (var i = 0, n = mxLines.length; i < n; i++) {
			var item = mxLines[i];
			var lineId = item.getAttribute('id');
			var sourceId = item.getAttribute('source');
			if (sourceId == null || sourceId.length == 0) {
				self.focusNode(lineId);
				JxHint.alert(jx.wfx.tip05);//'当前线没有设置来源节点！'
				return false;
			}
			var targetId = item.getAttribute('target');
			if (targetId == null || targetId.length == 0) {
				self.focusNode(lineId);
				JxHint.alert(jx.wfx.tip06);//'当前线没有设置目标节点！'
				return false;
			}
		}
		
		return true;
	},
	
	/**
	 * 检查所有退回线的来源与目标节点必须是任务节点，且不能在并发节点的分支路径上；
	 **/
	validBackLines: function(mxTaskNodes, mxBackLines, mxLines) {
		if (mxBackLines.length == 0) return true;
		
		var self = this;
		//检查每条退回路径的合法性
		for (var i = 0, n = mxBackLines.length; i < n; i++) {
			var line = mxBackLines[i];
			var lineId = line.getAttribute('id');
			
			//检查来源节点与目标节点是否为任务节点
			var srcId = line.getAttribute('source');
			var tagId = line.getAttribute('target');
			var srcNode, tagNode;
			for (var j = 0, m = mxTaskNodes.length; j < m; j++) {
				var node = mxTaskNodes[j];
				
				var nodeId = node.getAttribute('id');
				if (srcId == nodeId) srcNode = node;
				if (tagId == nodeId) tagNode = node;
			}
			
			if (srcNode == null) {
				self.focusNode(lineId);
				JxHint.alert(jx.wfx.tip07);//'退回路径的来源节点不是任务节点！'
				return false;
			}
			if (tagNode == null) {
				self.focusNode(lineId);
				JxHint.alert(jx.wfx.tip08);//'退回路径的目标节点不是任务节点！'
				return false;
			}
			
			//检查目标节点不能在分支路径上，方法：递归检查目标节点的上一个节点不是并发节点
			if (self.findPreForkNode(tagId, mxLines)) {
				self.focusNode(lineId);
				JxHint.alert(jx.wfx.tip09);//'退回路径的目标节点不能在分支路径上！'
				return false;
			}
			//检查来源节点不能在分支路径上
			if (self.findPreForkNode(srcId, mxLines)) {
				self.focusNode(lineId);
				JxHint.alert(jx.wfx.tip10);//'退回路径的来源节点不能在分支路径上！'
				return false;
			}
		}
		
		return true;
	},
	
	/**
	 * 一个流程图只能有一个开始节点；
	 * 开始节点没有流入线，只能有一条流出线；
	 **/
	validStartNode: function(mxNodes, mxLines) {
		var self = this;
		//检查只有一个开始节点
		var startNum = 0, startId = '';
		Ext.each(mxNodes, function(item){
			var nodetype = item.getAttribute('nodetype');
			if (nodetype == 'start') {
				startNum++;
				startId = item.getAttribute('id');
			}
		});
		if (startNum != 1) {
			JxHint.alert(jx.wfx.tip11);//'开始节点有且只有一个！'
			return false;
		}
		
		//开始节点只能有一条流出线，没有流入线
		var lineNum = self.nodeLineNums(startId, mxLines);
		if (lineNum.outNum != 1) {
			self.focusNode(startId);
			JxHint.alert(jx.wfx.tip12);//'开始节点必须且只能有一条流出线！'
			return false;
		}
		if (lineNum.inNum != 0) {
			self.focusNode(startId);
			JxHint.alert(jx.wfx.tip13);//'开始节点不能有流入线！'
			return false;
		}
		
		return true;
	},
	
	/**
	 * 一个流程图只能有一个结束节点；
	 * 结束节点没有流出线，有一条或多条流入线；
	 **/
	validEndNode: function(mxNodes, mxLines) {
		var self = this;
		//检查必须至少有一个结束节点
		var endNum = 0, endIds = [];
		Ext.each(mxNodes, function(item){
			var nodetype = item.getAttribute('nodetype');
			if (nodetype == 'end') {
				endNum++;
				endIds.push(item.getAttribute('id'));
			}
		});
		if (endNum != 1) {
			JxHint.alert(jx.wfx.tip14);//'结束节点有且只有一个！'
			return false;
		}
		
		//检查结束节点没有流出线
		for (var i = 0, n = endIds.length; i < n; i++) {
			var lineNum = self.nodeLineNums(endIds[i], mxLines);
			if (lineNum.outNum != 0) {
				self.focusNode(endIds[i]);
				JxHint.alert(jx.wfx.tip15);//'结束节点不能有流出线！'
				return false;
			}
			if (lineNum.inNum == 0) {
				self.focusNode(endIds[i]);
				JxHint.alert(jx.wfx.tip16);//'结束节点必须有一条流入线！'
				return false;
			}
		}
		
		return true;
	},
	
	/**
	 * 一个流程图至少有一个任务节点；
	 * 任务节点有一条或多条流入线，只能有一条流出线；
	 **/
	validTaskNode: function(mxNodes, mxLines) {
		var self = this;
		//检查必须至少有一个任务节点
		var taskNum = 0, taskIds = [];
		Ext.each(mxNodes, function(item){
			var nodetype = item.getAttribute('nodetype');
			if (nodetype == 'task' || nodetype == 'subprocess') {
				taskNum++;
				taskIds.push(item.getAttribute('id'));
			}
		});
		if (taskNum == 0) {
			JxHint.alert(jx.wfx.tip17);//'必须至少有一个任务节点！'
			return false;
		}
		
		//检查任务节点必须有一条流入线，只能有一条流出线；
		for (var i = 0, n = taskIds.length; i < n; i++) {
			var lineNum = self.nodeLineNums(taskIds[i], mxLines);
			if (lineNum.outNum != 1) {
				self.focusNode(taskIds[i]);
				JxHint.alert(jx.wfx.tip18);//'任务节点必须且只能有一条流出线！'
				return false;
			}
			if (lineNum.inNum == 0) {
				self.focusNode(taskIds[i]);
				JxHint.alert(jx.wfx.tip19);//'任务节点必须有一条流入线！'
				return false;
			}
		}
		
		return true;
	},
	
	/**
	 * 判断节点有一条或多条流入线，有多条流出线；
	 **/
	validSelectNode: function(mxNodes, mxLines) {
		var self = this,
			nodeIds = [];
		Ext.each(mxNodes, function(item){
			var nodetype = item.getAttribute('nodetype');
			if (nodetype == 'select') {
				nodeIds.push(item.getAttribute('id'));
			}
		});
		
		//检查有一条或多条流入线，有多条流出线
		for (var i = 0, n = nodeIds.length; i < n; i++) {
			var lineNum = self.nodeLineNums(nodeIds[i], mxLines);
			if (lineNum.outNum <= 1) {
				self.focusNode(nodeIds[i]);
				JxHint.alert(jx.wfx.tip20);//'判断节点必须有多条流出线！'
				return false;
			}
			if (lineNum.inNum == 0) {
				self.focusNode(nodeIds[i]);
				JxHint.alert(jx.wfx.tip21);//'判断节点必须有一条流入线！'
				return false;
			}
		}
		
		return true;
	},
	
	/**
	 * 并发节点有一条或多条流入线，有多条流出线；
	 **/
	validForkNode: function(mxNodes, mxLines) {
		var self = this, 
			nodeIds = [];
		Ext.each(mxNodes, function(item){
			var nodetype = item.getAttribute('nodetype');
			if (nodetype == 'fork') {
				nodeIds.push(item.getAttribute('id'));
			}
		});
		
		//检查有一条或多条流入线，有多条流出线
		for (var i = 0, n = nodeIds.length; i < n; i++) {
			var lineNum = self.nodeLineNums(nodeIds[i], mxLines);
			if (lineNum.outNum <= 1) {
				self.focusNode(nodeIds[i]);
				JxHint.alert(jx.wfx.tip22);//'并发节点必须有多条流出线！'
				return false;
			}
			if (lineNum.inNum == 0) {
				self.focusNode(nodeIds[i]);
				JxHint.alert(jx.wfx.tip23);//'并发节点必须有一条流入线！'
				return false;
			}
			//清除检查用的临时节点
			self.tmpNode = null;
			//检查每条流出路径向下必须都汇聚到同一个聚合节点
			if (!self.validForkHasJoin(nodeIds[i], mxLines)) {
				self.focusNode(nodeIds[i]);
				JxHint.alert(jx.wfx.tip24);//'并发节点流出路径中的聚合节点设置不正确！'
				return false;
			}
		}
		
		return true;
	},
	
	/**
	 * 聚合节点必须有多条流入线，只能有一条流出线；
	 **/
	validJoinNode: function(mxNodes, mxLines) {
		var self = this,
			nodeIds = [];
		Ext.each(mxNodes, function(item){
			var nodetype = item.getAttribute('nodetype');
			if (nodetype == 'join') {
				nodeIds.push(item.getAttribute('id'));
			}
		});
		
		//检查必须有多条流入线，只能有一条流出线；
		for (var i = 0, n = nodeIds.length; i < n; i++) {
			var lineNum = self.nodeLineNums(nodeIds[i], mxLines);
			if (lineNum.outNum != 1) {
				self.focusNode(nodeIds[i]);
				JxHint.alert(jx.wfx.tip25);//'聚合节点必须且只能有一条流出线！'
				return false;
			}
			if (lineNum.inNum <= 1) {
				self.focusNode(nodeIds[i]);
				JxHint.alert(jx.wfx.tip26);//'聚合节点必须有多条流入线！'
				return false;
			}
			//清除检查用的临时节点
			self.tmpNode = null;
			//检查每条流入路径向上必须都汇聚到同一个并发节点
			if (!self.validJoinHasFork(nodeIds[i], mxLines)) {
				self.focusNode(nodeIds[i]);
				JxHint.alert(jx.wfx.tip27);//'聚合节点流入路径中的并发节点设置不正确！'
				return false;
			}
		}
		
		return true;
	},
	
	//统计节点的流入与流出线数量
	nodeLineNums: function(nodeId, mxLines) {
		var inNum = 0, outNum = 0;
		Ext.each(mxLines, function(item){
			var source = item.getAttribute('source');
			var target = item.getAttribute('target');
			//统计流出线数量
			if (source == nodeId) {
				outNum++;
			}
			//统计流入线数量
			if (target == nodeId) {
				inNum++;
			}
		});
		return {inNum:inNum, outNum:outNum};
	},
	
	//检查并发节点的每条流出路径是否含聚合节点，且必须是同一个聚合节点
	validForkHasJoin: function(nodeId, mxLines) {
		var self = this;
		var lines = self.findOutLines(nodeId, mxLines);
		
		//递归检查每条流出线，如果存在一条路径流转到结束节点，则不正确
		for (var i = 0, n = lines.length; i < n; i++) {
			var targetId = lines[i].getAttribute('target');
			var targetNode = self.findNode(targetId);
			var targetType = targetNode.getAttribute('nodetype');
			var targetTitle = targetNode.getAttribute('value');//JxHint.alert('targetTitle:' + targetTitle);
			if (targetType == 'end') {
				return false;
			} else {
				if (targetType == 'join') {
				//如果是聚合节点，第一次记录聚合节点ID，第二次则检查是否为同一个聚合节点
					if (self.tmpNode == null) {
						self.tmpNode = targetId;
					} else {
						if (self.tmpNode != targetId) return false;
					}
				} else {
				//继续向下流出线检查
					if (!self.validForkHasJoin(targetId, mxLines)) {
						return false;
					}
				}
			}
		}
		
		return true;
	},
	
	//检查聚合节点的每条流入路径是否含并发节点，且必须是同一个并发节点
	validJoinHasFork: function(nodeId, mxLines) {
		var self = this;
		var lines = self.findInLines(nodeId, mxLines);
		
		//递归检查每条流入线，如果存在一条路径流转到开始节点，则不正确
		for (var i = 0, n = lines.length; i < n; i++) {
			var sourceId = lines[i].getAttribute('source');
			var sourceNode = self.findNode(sourceId);
			var sourceType = sourceNode.getAttribute('nodetype');
			var sourceTitle = sourceNode.getAttribute('value');//JxHint.alert('sourceTitle:' + sourceTitle);
			if (sourceType == 'start') {
				return false;
			} else {
				if (sourceType == 'fork') {
				//如果是并发节点，第一次记录并发节点ID，第二次则检查是否为同一个并发节点
					if (self.tmpNode == null) {
						self.tmpNode = sourceId;
					} else {
						if (self.tmpNode != sourceId) return false;
					}
				} else {
				//继续向上流入线检查
					if (!self.validJoinHasFork(sourceId, mxLines)) {
						return false;
					}
				}
			}
		}
		
		return true;
	},
	
	//取节点流出线对象，返回数组
	findOutLines: function(nodeId, mxLines) {
		return this.findLines(nodeId, mxLines, 'source');
	},
	
	//取节点流人线对象，返回数组
	findInLines: function(nodeId, mxLines) {
		return this.findLines(nodeId, mxLines, 'target');
	},
	findLines: function(nodeId, mxLines, attr) {
		var lines = [];
		for (var i = 0, n = mxLines.length; i < n; i++) {
			var item = mxLines[i];
			var source = item.getAttribute(attr);
			if (source == nodeId) {
				lines.push(item);
			}
		}
		return lines;
	},
	
	//取节点对象
	findNode: function(nodeId) {
		var graph = this.editor.graph;
		var cell = graph.getModel().getCell(nodeId);
		var enc = new mxCodec();
		return enc.encode(cell);
	},
	
	//聚焦指定的节点对象
	focusNode: function(nodeId) {
		var graph = this.editor.graph;
		var cell = graph.getModel().getCell(nodeId);
		graph.setSelectionCell(cell);
	},
	
	/**
	 * 递归检查目标节点的上一个节点是否为并发节点
	 **/
	findPreForkNode: function(nodeId, mxLines) {
		var self = this;
		var inLines = self.findInLines(nodeId, mxLines);
		if (inLines == null || inLines.length == 0) return false;
		//取其中一条路径就可以了，因为如果有并发节点，每条路径都可以找到它
		var srcNodeId = inLines[0].getAttribute('source');
		var srcNode = self.findNode(srcNodeId);
		var nodeType = srcNode.getAttribute('nodetype');
		if (nodeType == 'fork') {
			return true;
		} else {
			self.findPreForkNode(srcNodeId, mxLines);
		}
		return false;
	}
	
};

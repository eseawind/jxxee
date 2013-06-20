﻿/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 附件相关处理工具：
 * 1、表格记录附件浏览功能扩展。
 * 2、表单附件字段处理工具类。
 * 3、图片浏览控件扩展。
 * 
 * 远程附件管理存在的问题：
 * 1、表格附件标记功能都已实现远程预览；
 * 2、Form中的附件字段，不能支持上传远程附件的功能、查看与删除都没有问题；
 *    如果远程上传，则把附件字段设置为只读，且通过菜单按钮上传此字段中的图文附件；
 * 
 * @author TonyTan
 * @version 1.0, 2011-11-22
 */
JxAttach = {};

(function(){

	Ext.apply(JxAttach, {
		//附件管理模式设置、及URL设置
		uploadType: '0',
		uploadUrl: '',
		
		//在表格中添加附件列，此方法用在表格INC文件的第一行
		addAttachCol: function(cols, index) {
			//添加一列
			var item = {col:
				{header:'<div class="hd_attach" title="附件标志">&#160;</div>', width:22, name:'attachcol', 
					xtype:'actioncolumn', menuDisabled:true, align:'center', 
					renderer:function(){
						return '<div unselectable="on" class="x-grid3-cell-inner">&nbsp;</div>';
					}
				}
			};
			if (!index) index = 0;
			cols.insert(index, item);
		},
		
		//取表格中定义附件列序号
		getAttachColNum: function(grid) {
			var isCheck = grid.getSelectionModel() instanceof Ext.grid.CheckboxSelectionModel;
		
			var mycols = grid.gridNode.param.cols;
			for (var i = 0, n = mycols.length; i < n; i++) {
				if (mycols[i].col.name == 'attachcol') {
					//排除序号列与checkbox列
					return i + (isCheck ? 2:1);
				}
			}
			return -1;
		},
	
		//根据contentType取dsoframer程序的名称
		officeAppName: function(contentType) {
			if (contentType.indexOf('word') >= 0) {
				return 'Word.Document';
			} else if (contentType.indexOf('excel') >= 0 || contentType.indexOf('spreadsheetml.sheet') >= 0) {
				return 'Excel.Sheet';
			}
			
			return '';
		},
	
		//在线浏览office文档
		previewOffice: function(attachId, attachName, appName, tabPanel) {
			var objid = "objAttach_" + attachId;
			var tabid = 'tabAttach_' + attachId;
			var divid = "divAttach_" + attachId;
			
			//如果已经打开，则直接退出
			var tab = tabPanel.getComponent(tabid);
			if (tab) {
				tabPanel.activate(tab);
				return;
			}
			
			var div_html = '<div id="'+ divid +'" class="login_loading">'+
						'<img src="resources/images/jxstar32.gif" width="32" height="32"'+
						'style="margin-right:8px;float:left;vertical-align:bottom;"/>'+
						'<span id="loading-msg">正在加载'+ attachName +'...</span>'+
						'</div>';
			
			var url = Jxstar.path;
			if (JxAttach.uploadType == '1') {
				url = JxAttach.uploadUrl;
			}
			url += "/fileAction.do?funid=sys_attach&pagetype=editgrid&eventcode=down&nousercheck=1&dataType=byte&keyid="+attachId;
			var html = div_html + 
						'<OBJECT classid="clsid:00460182-9e5e-11d5-b7c8-b8269041dd57" id="'+ objid +'" '+
						'style="left:0px; top:0px; width:10px; height:10px" '+
						'viewastext codebase=public/lib/dso/dsoframer.ocx#version=2,2,0,8>'+
						'<PARAM NAME="_ExtentX" VALUE="6350">'+
						'<PARAM NAME="_ExtentX" VALUE="6350">'+
						'<PARAM NAME="_ExtentY" VALUE="6350">'+
						'<PARAM NAME="BorderColor" VALUE="-2147483632">'+
						'<PARAM NAME="BackColor" VALUE="-2147483643">'+
						'<PARAM NAME="ForeColor" VALUE="-2147483640">'+
						'<PARAM NAME="TitlebarColor" VALUE="-2147483635">'+
						'<PARAM NAME="TitlebarTextColor" VALUE="-2147483634">'+
						'<PARAM NAME="BorderStyle" VALUE="0">'+
						'<PARAM NAME="Titlebar" VALUE="0">'+
						'<PARAM NAME="Toolbars" VALUE="0">'+
						'<PARAM NAME="Menubar" VALUE="0">'+
						'</OBJECT>';
			
			var cfg = {
				id:tabid,
				pagetype:'formpic',
				title:'浏览-' + attachName,
				layout:'fit',
				border:false,
				closable:true,
				iconCls:'tab_form',
				html:html
			};
			tab = tabPanel.add(cfg);
			tabPanel.activate(tab);
			
			var obj = Ext.getDom(objid);
			obj.Open(url, true, appName);
			
			Ext.fly(divid).hide();
			Ext.fly(obj).setStyle({left:0, top:0, width:'100%', height:'100%'});
		},
		
		//在线浏览PDF文档，此OCX控件暂时不支持流文件
		previewPDF: function(attachId, attachName, tabPanel) {
			var objid = "objAttachPDF_" + attachId;
			var tabid = 'tabAttachPDF_' + attachId;
			
			//如果已经打开，则直接退出
			var tab = tabPanel.getComponent(tabid);
			if (tab) {
				tabPanel.activate(tab);
				return;
			}
			
			var url = Jxstar.path;
			if (JxAttach.uploadType == '1') {
				url = JxAttach.uploadUrl;
			}
			url += "/fileAction.do?funid=sys_attach&pagetype=editgrid&eventcode=down&nousercheck=1&dataType=byte&keyid="+attachId;
			var html = '<OBJECT classid="clsid:ca8a9780-280d-11cf-a24d-444553540000" id="'+ objid +'" '+
						'style="left: 0px; top: 0px; width: 100%; height: 100%" border="0">'+
						'<param name="src" value="'+ url +'">'+
						'</OBJECT>';
			
			var cfg = {
				id:tabid,
				pagetype:'formpic',
				title:'浏览-' + attachName,
				layout:'fit',
				border:false,
				closable:true,
				iconCls:'tab_form',
				html:html
			};
			tab = tabPanel.add(cfg);
			tabPanel.activate(tab);
		},
		
		//在线浏览图片
		previewImage: function(attachId, attachName, tabPanel) {
			var objid = "objAttachIMG_" + attachId;
			var tabid = 'tabAttachIMG_' + attachId;
			
			//如果已经打开，则直接退出
			var tab = tabPanel.getComponent(tabid);
			if (tab) {
				tabPanel.activate(tab);
				return;
			}
			
			var url = Jxstar.path;
			if (JxAttach.uploadType == '1') {
				url = JxAttach.uploadUrl;
			}
			url += "/fileAction.do?funid=sys_attach&pagetype=editgrid&eventcode=down&nousercheck=1&dataType=byte&keyid="+attachId;
			var html = '<img src="'+ url +'" title="'+ attachName +'">';
			
			var cfg = {
				id:tabid,
				pagetype:'formpic',
				title:'浏览-' + attachName,
				layout:'fit',
				border:false,
				closable:true,
				autoScroll:true,
				iconCls:'tab_form',
				html:html
			};
			tab = tabPanel.add(cfg);
			tabPanel.activate(tab);
		},
		
		//添加在线预览菜单
		previewMenu: function(data, tabPanel) {
			var previewFn, menu;
			//word，xls有预览功能
			var appName = JxAttach.officeAppName(data.content_type);
			if (Ext.isIE && appName.length > 0) {
				//不能直接使用外部变量
				previewFn = function(obj){
					var md = obj.initialConfig.data;
					var attachId = md.attach_id;
					var attachName = md.attach_name;
					var appName = JxAttach.officeAppName(md.content_type);
					JxAttach.previewOffice(attachId, attachName, appName, tabPanel);
				};
			}
			//PDF文件有预览功能，此OCX控件不支持流文件
			if (Ext.isIE && data.content_type == 'application/pdf') {
				previewFn = function(obj){
					var md = obj.initialConfig.data;
					var attachId = md.attach_id;
					var attachName = md.attach_name;
					JxAttach.previewPDF(attachId, attachName, tabPanel);
				};
			}
			//图片文件有预览功能，在Firefox中也可以浏览
			if (data.content_type.indexOf('image') == 0) {
				previewFn = function(obj){
					var md = obj.initialConfig.data;
					var attachId = md.attach_id;
					var attachName = md.attach_name;
					JxAttach.previewImage(attachId, attachName, tabPanel);
				};
			}
			
			if (previewFn) {
				menu = {items:[{
					text:'在线浏览', 
					data:data, handler:previewFn}
				]};
			}
			return menu;
		},
	
		//表格中有附件的记录，添加附件标志
		viewAttachFlag: function(grid) {
			if (grid == null) return;
			//附件管理类型与集中管理路径
			JxAttach.uploadType = Jxstar.systemVar.uploadType;
			JxAttach.uploadUrl = Jxstar.systemVar.uploadUrl;
			
			//父页面控件
			var tabPanel = grid.findParentByType('tabpanel');
			var attachColNum = JxAttach.getAttachColNum(grid);
			
			//如果定义了附件列，或者标识了需要显示附件，则处理附件标志显示
			if (!(attachColNum >= 0 || grid.isShowAttach == true)) return;
			if (attachColNum < 0) attachColNum = 0;
			
			var store = grid.getStore();
			var cnt = store.getCount();
			if (cnt == 0) return;
			
			var define = grid.gridNode.define;
			
			//组织机构与用户的附件不显示
			if (define.tablename == 'sys_dept' || define.tablename == 'sys_user') return;
			
			var pkcol = define.pkcol;
			var pks = '';
			for (var i = 0; i < cnt; i++) {
				var record = store.getAt(i);
				pks += record.get(pkcol) + ',';
			}
			pks = pks.substr(0, pks.length-1);
			//alert('pks=' + pks);
			var hdCall = function(data) {
				if (data.length == 0) return;
				
				var attachs = [], mitems = [];
				var rownum = -1;
				for (var i = 0; i < data.length; i++) {
					var row_num = parseInt(data[i].row_num);
					var data_id = data[i].data_id;
					var attach_id = data[i].attach_id;
					var attach_name = data[i].attach_name;
					var content_type = data[i].content_type;
					
					if (rownum != row_num) {
						mitems = [];
					}
					
					//构建附件菜单
					var cfg = {
						id:attach_id,
						text:attach_name, 
						handler:function(){
							var params = 'funid=sys_attach&keyid='+ this.id +'&pagetype=editgrid&eventcode=down';
							//发送下载请求
							if (JxAttach.uploadType == '1') {
								var url = JxAttach.uploadUrl + '/fileAction.do?' + params + '&dataType=byte&nousercheck=1';
								Ext.fly('frmhidden').dom.src = url;
							} else {
								Request.fileDown(params);
							}
						}
					};
					//处理office文件与pdf文件的预览
					var menu = JxAttach.previewMenu(data[i], tabPanel);
					if (menu) cfg.menu = menu;
					//添加附件菜单
					mitems[mitems.length] = cfg;
					
					if (rownum != row_num) {
						rownum = row_num;
						
						var td = grid.getView().getCell(row_num, attachColNum);
						Ext.fly(td.firstChild).addClass('flag_attach');
						
						//把菜单配置对象保存起来
						var tdel = Ext.get(td);
						tdel.myitems = mitems;
						
						tdel.on('click', function(){
							var menu = new Ext.menu.Menu({items:[this.myitems]});
							menu.on('hide', function(m){
								m.myitems = null;
								m.destroy();
							});
							menu.show(this);
						});
					}
				}
			};
			
			//从后台查询任务信息
			var params = 'funid=queryevent&pagetype=grid&eventcode=query_attach';
				params += '&tablename='+ define.tablename +'&keyids='+ pks;
			Request.dataRequest(params, hdCall);
		},
	
		/********************下面的方法是用于表单附件字段********************/
		//public 表格提交时判断必填附件是否有上传
		checkGrid: function(grid) {
			var records = JxUtil.getSelectRows(grid);
			if (!JxUtil.selected(records)) return;
			
			var tabPanel = grid.findParentByType('tabpanel');
			if (tabPanel == null) return;
			
			var formTab = tabPanel.getComponent(1);
			if (formTab == null) return;
			var formPanel = formTab.getComponent(0);
			if (formPanel == null || formPanel.isXType('form') == false) return;
			var fields = formPanel.findByType('fileuploadfield');
			if (fields == null || fields.length == 0) return;
			
			//根据表单中的必填标记判断表格中的数据
			for(var j = 0; j < records.length; j++) {
				var data = records[j];
				for(var i = 0; i < fields.length; i++) {
					var f = fields[i];
					if (f.allowBlank == false) {
						var val = data.get(f.name);
						if (val == null || val.length == 0) {
							JxHint.alert('【' + f.fieldLabel + '】栏目没有上传附件，不能提交！');
							return false;
						}
					}
				}
			}
		},
	
		//public 检查附件字符是否必填且没有上传附件
		checkAttach: function(form) {
			var fields = form.findByType('fileuploadfield');
			if (fields == null || fields.length == 0) return true;
			
			for(var i = 0; i < fields.length; i++) {
				var f = fields[i];
				if (f.allowBlank == false) {
					var val = f.getValue();
					if (val == null || val.length == 0) {
						JxHint.alert('【' + f.fieldLabel + '】栏目没有上传附件，不能提交！');
						return false;
					}
				}
			}
			return true;
		},
		
		//public 选择附件前判断，如果是已签字的记录不能调整
		beforeChange: function(fileField) {
			if (fileField.disabled) return;
			var param = JxAttach.attachParam(fileField, '');
			if (param == null) return;
			
			var form = param.form;
			var dataId = form.get(param.define.pkcol);
			if (dataId == null || dataId.length == 0) {
				JxHint.alert(jx.event.nosave);
				return false;
			}
			
			//设置业务状态值
			var audit0 = '0', audit6 = '6';
			if (param.define.status) {
				audit0 = param.define.status['audit0'];
			}
			var audit = audit0;
			if (param.define.auditcol.length > 0) {
				audit = form.get(param.define.auditcol);
			}
			if (audit != audit0 && audit != audit6) {
				JxHint.alert('业务记录已提交，不能修改附件！');
				return false;
			}
		},
	
		//public 表单中的附件控件显示附件方法
		showAttach: function(mya) {
			if (mya == null || mya.parentNode == null) return;
			var fileField = Ext.getCmp(mya.parentNode.id);
			if (fileField == null) return;
			
			var param = JxAttach.attachParam(fileField, 'fdown');
			if (param == null) return;
			
			//发送下载请求
			if (JxAttach.uploadType == '1') {
				var url = JxAttach.uploadUrl + '/fileAction.do?' + param.params + '&dataType=byte&nousercheck=1';
				Ext.fly('frmhidden').dom.src = url;
			} else {
				Request.fileDown(param.params);
			}
		},
		
		//public 表单中的附件控件删除附件方法
		deleteAttach: function(mya) {
			if (mya == null || mya.parentNode == null) return;
			var fileField = Ext.getCmp(mya.parentNode.id);
			if (fileField == null) return;
			if (fileField.disabled) return;
			
			var hdcall = function() {
				var param = JxAttach.attachParam(fileField, 'fdelete');
				if (param == null) return;
				//设置业务状态值
				var audit0 = '0', audit6 = '6';
				if (param.define.status) {
					audit0 = param.define.status['audit0'];
				}
				var audit = audit0;
				if (param.define.auditcol.length > 0) {
					audit = param.form.get(param.define.auditcol);
				}
				if (audit != audit0 && audit != audit6) {
					JxHint.alert('业务记录已提交，不能删除附件！');
					return false;
				}
				//清除附件字段值
				var hdcall = function() {
					fileField.setValue('');
					if (!Ext.isEmpty(param.form.myRecord)) {
						param.form.myRecord.set(fileField.name, '');
						param.form.myRecord.commit();
					}
				};
				
				//发送删除请求
				if (JxAttach.uploadType == '1') {//删除远程附件
					var url = JxAttach.uploadUrl + '/fileAction.do?' + param.params + '&nousercheck=1';
					Ext.fly('frmhidden').dom.src = url;
					//延时执行回调函数，index.jsp中的frmhidden.load事件会提示执行完成！
					JxUtil.delay(800, function(){
						hdcall();
					});
				} else {
					Request.postRequest(param.params, hdcall);
				}
			};
			
			//确定删除选择的记录吗？
			Ext.Msg.confirm(jx.base.hint, jx.event.delyes, function(btn) {
				if (btn == 'yes') hdcall();
			});
		},
		
		//public 保存表单中的附件信息
		saveAttach: function(fileField) {
			if (fileField.disabled) return;
			var param = JxAttach.attachParam(fileField, 'fcreate');
			if (param == null) return;
			
			var form = param.form;
			var dataId = form.get(param.define.pkcol);
			if (dataId == null || dataId.length == 0) {
				JxHint.alert(jx.event.nosave);
				return false;
			}
			
			var hdcall = function() {
				if (!Ext.isEmpty(form.myRecord)) {
					form.myRecord.set(fileField.name, fileField.getValue());
					form.myRecord.commit();
				}
			}
			//上传附件
			var params = param.params + '&attach_name='+ encodeURIComponent(fileField.getValue());
			Request.fileRequest(form, params, hdcall);
		},
		
		//private 公共参数处理
		attachParam: function(fileField, eventCode) {
			//取到表单相关信息
			var fileForm = fileField.findParentByType('form');
			if (Ext.isEmpty(fileForm)) {
				JxHint.alert('没有找到Form表单对象，不能上传附件！');
				return;
			}
			
			var form = fileForm.getForm();
			var define = fileForm.formNode.define;
			
			var nodeId = define.nodeid;
			var tableName = define.tablename;
			var dataId = form.get(define.pkcol);
			if (Ext.isEmpty(dataId)) {
				JxHint.alert(jx.event.nosave);
				return;
			}
			var fieldName = fileField.name.split('__')[1];
			
			//上传参数
			var params = 'funid=sys_attach&pagetype=editgrid&eventcode='+ eventCode;
				params += '&attach_field='+ fieldName +'&dataid='+ dataId;
				params += '&table_name='+ tableName +'&datafunid='+ nodeId;
		
			return {form:form, params:params, define:define};
		}
		
	});//Ext.apply

})();

/**
 * 下面的处理图片浏览的工具类。
 * 
 **/
var ImageShower = function(config){
		this.config = config;
};

ImageShower.prototype = {
	lookup : {},
	
	show: function() {
		this.initTemplates();
		this.store = new Ext.data.JsonStore({
			url: this.config.url,
			root: 'data',
			fields: [
				'name', 'url', 'title'
			],
			listeners: {
				'load': {fn:function(){ this.view.select(0); }, scope:this, single:true}
			}
		});
		this.store.load();
		
		var formatData = function(data){
			data.shortName = Ext.util.Format.ellipsis(data.title, 15);
			data.sizeString = '34';//formatSize(data);
			data.dateString = new Date().format("m/d/Y g:i a");
			this.lookup[data.name] = data;
			return data;
		};
		
		this.view = new Ext.DataView({
			store: this.store,
			tpl: this.thumbTemplate,
			singleSelect: true,
			autoHeight:true,
			overClass:'x-view-over',
			itemSelector:'div.thumb-wrap',
			emptyText: 'No images to display',

			prepareData: formatData.createDelegate(this),
			
			listeners: {
				'selectionchange': {fn:this.showDetails, scope:this, buffer:100},
				'loadexception'  : {fn:this.onLoadException, scope:this},
				'beforeselect'   : {fn:function(view){
					return view.store.getRange().length > 0;
				}}
			}
		});
		
		var tabid = 'images-view';
		//如果存在，则先删除
		var panel = this.config.parentCtl.getComponent(tabid);
		if (panel) {
			var dv = panel.getComponent(0);
			dv.removeAll(true);
			dv.add(this.view);
		} else {
			var cfg = {
				id:tabid,
				pagetype:'formpic',
				title:'图片浏览',
				layout: 'border',
				border:false,
				closable: true,
				iconCls:'tab_form',
				items:[{
					id: 'img-chooser-view',
					region: 'west',
					split: true,
					width: 160,
					minWidth: 160,
					maxWidth: 300,
					autoScroll: true,
					items: this.view
				},{
					id: 'img-detail-panel',
					region: 'center',
					autoScroll: true
				}]
			};
			panel = this.config.parentCtl.add(cfg);
		}
		
		return panel;
	},
	
	initTemplates : function(){
		this.thumbTemplate = new Ext.XTemplate(
			'<tpl for=".">',
				'<div class="thumb-wrap" id="{name}">',
				'<div class="thumb"><img src="{url}" title="{title}"></div>',
				'<span>{shortName}</span></div>',
			'</tpl>',
			'<div class="x-clear"></div>'
		);
		this.thumbTemplate.compile();

		this.detailsTemplate = new Ext.XTemplate(
			'<div class="details">',
				'<tpl for=".">',
					'<img src="{url}"  style="width:100%;height:100%;">',
				'</tpl>',
			'</div>'
		);
		this.detailsTemplate.compile();
	},

	showDetails : function(){
		var selNode = this.view.getSelectedNodes();
		var detailEl = Ext.getCmp('img-detail-panel').body;
		if(selNode && selNode.length > 0){
			selNode = selNode[0];
			var data = this.lookup[selNode.id];
			detailEl.hide();
			this.detailsTemplate.overwrite(detailEl, data);
			detailEl.slideIn('l', {stopFx:true,duration:.2});
		}else{
			detailEl.update('');
		}
	},

	onLoadException : function(v,o){
		this.view.getEl().update('<div style="padding:10px;">Error loading images.</div>');
	}
};
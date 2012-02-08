/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 表单附件字段处理工具类。
 * 
 * @author TonyTan
 * @version 1.0, 2011-11-22
 */
JxAttach = {};

(function(){

	Ext.apply(JxAttach, {
		//public 表格提交时判断必填附件是否有上传
		checkGrid: function(grid) {
			var records = grid.getSelectionModel().getSelections();
			if (!JxUtil.selected(records)) return;
			
			var tabPanel = grid.findParentByType('tabpanel');
			if (tabPanel == null) return;
			
			var formTab = tabPanel.getComponent(1);
			if (formTab == null) return;
			var formPanel = formTab.getComponent(0);
			if (formPanel == null) return;
			var fields = formPanel.findByType('fileuploadfield');
			if (fields == null || fields.length == 0) return;
			
			//根据表单中的必填标记判断表格中的数据
			for(var j = 0; j < records.length; j++) {
				var data = records[j];
				for(var i = 0; i < fields.length; i++) {
					var f = fields[i];
					if (f.allowBlank == false) {
						var val = data[f.name];
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
			var param = JxAttach.attachParam(fileField, '');
			if (param == null) return;
			
			var form = param.form;
			var dataId = form.get(param.define.pkcol);
			if (dataId == null || dataId.length == 0) {
				JxHint.alert(jx.event.nosave);
				return false;
			}
			
			var audit = '0';
			if (param.define.auditcol.length > 0) {
				audit = form.get(param.define.auditcol);
			}
			if (audit != '0' && audit != '6') {
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
			Request.fileDown(param.params);
		},
		
		//public 表单中的附件控件删除附件方法
		deleteAttach: function(mya) {
			if (mya == null || mya.parentNode == null) return;
			var fileField = Ext.getCmp(mya.parentNode.id);
			if (fileField == null) return;
			
			var param = JxAttach.attachParam(fileField, 'fdelete');
			if (param == null) return;
			
			var audit = '0';
			if (param.define.auditcol.length > 0) {
				audit = param.form.get(param.define.auditcol);
			}
			if (audit != '0' && audit != '6') {
				JxHint.alert('业务记录已提交，不能删除附件！');
				return false;
			}
			//清除附件字段值
			var hdcall = function() {
				fileField.setValue('');
				param.form.myRecord.set(fileField.name, '');
				param.form.myRecord.commit();
			};
			
			//发送下载请求
			Request.postRequest(param.params, hdcall);
		},
		
		//public 保存表单中的附件信息
		saveAttach: function(fileField) {
			var param = JxAttach.attachParam(fileField, 'fcreate');
			if (param == null) return;
			
			var form = param.form;
			var dataId = form.get(param.define.pkcol);
			if (dataId == null || dataId.length == 0) {
				JxHint.alert(jx.event.nosave);
				return false;
			}
			
			var hdcall = function() {
				form.myRecord.set(fileField.name, fileField.getValue());
				form.myRecord.commit();
			}
			//上传附件
			var params = param.params + '&attach_name='+ encodeURIComponent(fileField.getValue());
			Request.fileRequest(form, params, hdcall);
		},
		
		//private 公共参数处理
		attachParam: function(fileField, eventCode) {
			//取到表单相关信息
			var fileForm = fileField.findParentByType('form');
			if (fileForm == null) return;
			
			var form = fileForm.getForm();
			var define = fileForm.formNode.define;
			
			var nodeId = define.nodeid;
			var tableName = define.tablename;
			var dataId = form.get(define.pkcol);
			var fieldName = fileField.name.split('__')[1];
			
			//上传参数
			var params = 'funid=sys_attach&pagetype=editgrid&eventcode='+ eventCode;
				params += '&attach_field='+ fieldName +'&dataid='+ dataId;
				params += '&table_name='+ tableName +'&datafunid='+ nodeId;
		
			return {form:form, params:params, define:define};
		}
		
	});//Ext.apply

})();

/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 处理选择控件的数据赋值。
 * 
 * @author TonyTan
 * @version 1.0, 2010-11-22
 */
JxSelect = {};

(function(){

	Ext.apply(JxSelect, {
		/**
		* 创建下拉选择数据的窗口对象
		* 
		* config: 选择数据的配置，参数有：						
			pageType: 'combogrid',
			nodeId: 'jz_type_v',
			isSame: '0',	//是否同名赋值
			sourceField: 'jz_type.type_name;type_id',
			targetField: 'jz_list.type_name;type_id',
			whereSql: '',
			whereValue: '',
			whereType: ''
		* targetId: 目标对象ID，可能是node_funid_editgrid或form
		*/
		createSelectWin: function(config, parentField, targetId) {
			if(parentField.readOnly || parentField.disabled){
				return;
			}
			
			var self = this;
			var nodeId = config.nodeId;
			
			//功能对象信息
			var define = Jxstar.findNode(nodeId);
			if (define == null) {
				JxHint.alert(String.format(jx.star.nopage, nodeId));	//'没有定义【{0}】功能页面信息！'
				return;
			}
			
			//取创建页面的函数
			var hdCall = function(f) {
				var page = f(define, {pageType:config.pageType});
				//创建表格对象
				if (typeof page.showPage == 'function') {
					page = page.showPage(config.pageType);
				}
				//设置页面高度
				page.height = 495;
				//创建对话框
				var	win = new Ext.Window({
					title: jx.base.select+define.nodetitle,	//'选择'
					layout: 'fit',
					width: 750,
					height: 500,
					border: false,
					modal: true,
					closeAction: 'close',
					items: [page]
				});
				win.show();
				
				//如果是布局页面，grid显示会延时，所以需要延时函数
				JxUtil.delay(500, function(){
					//如果page不是grid，则认为是树形页面，取左边的grid
					var selgrid = page;
					if (!selgrid.isXType('grid')) {
						selgrid = selgrid.getComponent(1);
						if (selgrid == null) {
							JxHint.alert(jx.star.nogrid);	//'选择功能页面不能识别表格，请检查！'
							return false;
						} else {
							selgrid = selgrid.getComponent(0);
						}
					}
					var whereValue = config.whereValue;
					//解析查询参数值中的[]字段变量，如果在查询栏中使用，则会选择不到值
					if (whereValue != null && whereValue.indexOf('[') >= 0) {
						var tagRecord = self.selectTagRecord(parentField, targetId);
						whereValue = JxUtil.parseWhereValue(whereValue, tagRecord);
					}
					//显示表格对象后再加载数据才稳定
					Jxstar.loadData(selgrid, {where_sql:config.whereSql, where_value:whereValue, where_type:config.whereType});
					
					//添加选择数据的方法
					selgrid.on('rowdblclick', function(grid, n, event){
						//取选择的来源记录数据
						var srcRecord = grid.getSelectionModel().getSelections();
						if (srcRecord == null || srcRecord.length == 0) {
						//如果选择的记录为空，则说明是清空选择的数据
							var store = grid.getStore();
							srcRecord = []; srcRecord[0] = JxUtil.emptyRecord(store);
						}

						//取选择字段的容器对象，根据它判断是在grid控件中还是在查询控件中
						var fieldCt = parentField.ownerCt;
						//查询值或统计参数值的输入控件赋值
						if (fieldCt && fieldCt.id.indexOf('_qv') > 0) {
							self.setControlData(srcRecord[0], parentField, config.sourceField, config.targetField);
						} else {
							//取目标grid或form，根据ID查找
							var tagRecord = self.selectTagRecord(parentField, targetId);
							//给目标表赋值
							self.setSelectData(srcRecord, tagRecord, config.isSame, config.sourceField, config.targetField)
						}
						//隐藏选择的窗口
						win.close();
					});
				});
			};

			//异步从JS文件加载功能对象
			var pathname = config.layoutPage;
			if (pathname == null || pathname.length == 0) {
				pathname = define.gridpage;
			}
			if (pathname == null || pathname.length == 0){
				JxHint.alert(jx.star.noselect);	//'设计状态，不能显示选择窗口！'
				return;
			}
			Request.loadJS(pathname, hdCall);
		},

		/**
		* 创建下拉选择数据的窗口对象
		* 
		* config: 选择数据的配置，参数有：						
			pageType: 'combogrid',
			nodeId: 'jz_type_v',
			isSame: '0',	//是否同名赋值
			sourceField: 'jz_type.type_name;type_id',
			targetField: 'jz_list.type_name;type_id',
			whereSql: '',
			whereValue: '',
			whereType: ''
		* menuDiv: 右键菜单显示块
		* targetId: 目标对象ID，可能是node_funid_editgrid或form
		*/
		createComboGrid: function(config, menuDiv, targetId) {
			var self = this;
			var nodeId = config.nodeId;
			var parentField = menuDiv.parentField;
			
			//功能对象信息
			var define = Jxstar.findNode(nodeId);
			if (define == null) {
				JxHint.alert(String.format(jx.star.nopage, nodeId));	//没有定义【{0}】功能页面信息！
				return;
			}
			
			//刷新表格中的数据
			var refreshData = function(page) {
				//解析查询参数值中的[]字段变量，如果在查询栏中使用，则会选择不到值
				var whereValue = config.whereValue;
				if (whereValue != null && whereValue.indexOf('[') >= 0) {
					var tagRecord = self.selectTagRecord(parentField, targetId);
					whereValue = JxUtil.parseWhereValue(whereValue, tagRecord);
				}
				//显示表格对象后再加载数据才稳定
				Jxstar.loadData(page, {where_sql:config.whereSql, where_value:whereValue, where_type:config.whereType});
			}

			//取创建页面的函数
			var hdCall = function(f) {
				var page = f(define, {pageType:config.pageType});
				//创建表格对象
				if (typeof page.showPage == 'function') {
					page = page.showPage(config.pageType);
				}
				//设置grid高度
				page.height = 295;
				//把新页面添加到目标窗口中
				menuDiv.add(page);
				//重新显示目标窗口
				menuDiv.doLayout();
				
				//创建时显示数据
				refreshData(page);
				//显示时，刷新表格中的数据
				menuDiv.on('show', function(){
					refreshData(page);
				});
				menuDiv.on('destroy', function(){
					config = null;
					targetId = null;
					refreshData = null;
				});
				
				//添加选择数据的方法
				page.on('rowclick', function(grid, index, e){
					//rowclick事件会执行两次，用下面的方法判断不重复执行
					if (!menuDiv.isVisible()) return false;

					//取选择的来源记录数据
					var srcRecord = grid.getSelectionModel().getSelections();
					if (srcRecord == null || srcRecord.length == 0) {
					//如果选择的记录为空，则说明是清空选择的数据
						var store = grid.getStore();
						srcRecord = []; srcRecord[0] = JxUtil.emptyRecord(store);
					}
						
					//取选择字段的容器对象，根据它判断是在grid控件中还是在查询控件中
					var fieldCt = parentField.ownerCt;
					//查询值或统计参数值的输入控件赋值
					if (fieldCt && fieldCt.id.indexOf('_qv') > 0) {
						self.setControlData(srcRecord[0], parentField, config.sourceField, config.targetField);
					} else {
						//取目标grid或form，根据ID查找
						var tagRecord = self.selectTagRecord(parentField, targetId);
						//给目标表赋值
						self.setSelectData(srcRecord, tagRecord, config.isSame, config.sourceField, config.targetField)
					}
					//隐藏选择的窗口
					menuDiv.hide();
				});
			};

			//异步从JS文件加载功能对象
			var pathname = define.gridpage;
			if (pathname == null || pathname.length == 0){
				JxHint.alert(jx.star.noselect);	//'设计状态，不能显示选择窗口！'
				return;
			}
			Request.loadJS(pathname, hdCall);
		},
		
		/**
		* private 取目标grid或form，根据ID查找。选择窗口或下拉GRID控件使用。
		* parentField -- 当前选择控件的字段对象
		* targetId -- 当前选择控件所在的PanelID，现在取消通过Ext.getCmp(targetId)的方式找控件
		*/
		selectTagRecord: function(parentField, targetId) {
			var tagRecord;
			if (targetId.indexOf('grid') >= 0) {
				var gdom = parentField.el.findParentNode('div.x-grid-panel');
				var grid = Ext.getCmp(gdom.id);
				if (grid) {
					var selRecord = grid.getSelectionModel().getSelections();
					if (selRecord && selRecord.length > 0) {
						tagRecord = selRecord[0];
					}
				}
			} else {
				var form = parentField.ownerCt;
				//有些自定义的form页面，字段的容器对象就是form
				if (form.isXType('form') == false) {
					form = form.findParentByType('form');
				}
				
				if (form) {
					tagRecord = form.getForm();
				}
			}
			
			return tagRecord;
		},
	
		/**
		* 处理选择表格数据的赋值方法，
		* 
		* srcRecord: 来源记录
		* fieldCtl: 目标选择控件
		* sourceField: 来源字段
		* targetField: 目标字段，如果是统计参数，不能添加表名
		*/
		setControlData: function(srcRecord, fieldCtl, srcField, tagField) {
			var fieldCt = fieldCtl.ownerCt;
			//统计条件值输入控件
			if (fieldCt.isXType('toolbar')) {
				var srcNames = srcField.split(';');
				var tagNames = tagField.split(';');
				if (srcNames[0].length == 0 || tagNames[0].length == 0) {
					JxHint.alert(jx.star.noselfield);
					return false;
				}
				//取来源字段的表名
				var srcTable = srcNames[0].split(".")[0];
				
				for(var i = 0, n = srcNames.length; i < n; i++) {
					if (srcNames[i].length == 0 || 
						tagNames[i] == null || tagNames[i].length == 0) continue;
						
					//构建来源数据字段名
					var srcTmps = srcNames[i].split(".");
					if(srcTmps.length > 1){
						srcName = srcTmps[0] + '__' + srcTmps[1];
						srcTable = srcTmps[0];
					}else{
						srcName = srcTable + "__" + srcNames[i];
					}
					//取来源字段的值
					var srcValue = srcRecord.get(srcName);
					//找到目标控件
					var tagName = tagNames[i].replace('.', '__');
					var fields = fieldCt.find('name', tagName);
					if (fields == null || fields.length == 0) continue;
					//给目标控件赋值
					fields[0].setValue(srcValue);
				}
			} else {
			//查询值输入控件
				var srcName = srcField.split(';')[0].replace('.', '__');
				if (srcName == null || srcName.length == 0) {
					JxHint.alert(jx.star.nosrc);	//'没有定义来源字段，不能选择记录！'
					return false;
				}
				var srcValue = srcRecord.get(srcName);
				
				fieldCtl.setValue(srcValue);
			}
		},

		/**
		* 处理选择表格数据的赋值方法，
		* 
		* srcRecord: 来源记录，是一个数组
		* tagRecord: 目标记录
		* isSame: 是否同名赋值 '1', '0'
		* sourceField: 来源字段，格式：tablename.field;field;tablename1.field...
		* targetField: 目标字段，格式：tablename.field;field;tablename1.field...
		*/
		setSelectData: function(srcRecord, tagRecord, isSame, sourceField, targetField) {
			var self = this;
			//来源字段名、目标字段名
			var srcFieldName, tagFieldName;

			//如果允许同名字段赋值，则先处理同名字段的值
			var tagData = tagRecord.data;
			if (tagData == null) {//为空说明是form
				tagData = tagRecord.getFieldValues();
			}
			if (isSame == '1'){
				for(srcFieldName in srcRecord[0].data) {
					var srctmp = srcFieldName.split("__")[1];
					for(tagFieldName in tagData) {
						var tagtmp = tagFieldName.split("__")[1];
						//auditing字段的值不赋值
						if (srctmp.indexOf('auditing') < 0 && srctmp == tagtmp) {
							//取值赋给目标数据对象
							tagRecord.set(tagFieldName, self.getValue(srcRecord, srcFieldName));
						}
					}
				}
			}

			//如果定义了来源字段名与目标字段名根据对应关系赋值
			if (sourceField != null && sourceField.length > 0) {
				//分解来源字段名与目标字段名
				var srcFields = sourceField.split(";");
				var tagFields = targetField.split(";");
				//第一个字段名必需带表名
				var srcTableName = srcFields[0].split(".")[0];
				var tagTableName = tagFields[0].split(".")[0];

				//根据每个字段，取来源数据写入目标数据对象中
				for (var i = 0; i < srcFields.length; i++) {
					//构建来源数据字段名
					var srcTmps = srcFields[i].split(".");
					if(srcTmps.length > 1){
						srcFieldName = srcTmps[0] + '__' + srcTmps[1];
						srcTableName = srcTmps[0];
					}else{
						srcFieldName = srcTableName + "__" + srcFields[i];
					}

					//构建目标数据字段名
					var tagTmps = tagFields[i].split(".");
					if(tagTmps.length > 1){
						tagFieldName = tagTmps[0] + '__' + tagTmps[1];
						tagTableName = tagTmps[0];
					}else{
						tagFieldName = tagTableName + "__" + tagFields[i];
					}

					//取值赋给目标数据对象
					tagRecord.set(tagFieldName, self.getValue(srcRecord, srcFieldName));
				}
			}
		},
		
		getValue: function(records, field) {
			var isMore = (records.length > 1);
			if (isMore) {
				var value = '';
				for (var i = 0, n = records.length; i < n; i++) {
					value += records[i].get(field) + ';';
				}
				return value;
			} else {
				return records[0].get(field);
			}
		}
	});//Ext.apply

})();

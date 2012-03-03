/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 前台框架代号为：jxstar，Jxstar类为核心公共对象。
 * 
 * 扩展表格Grid对象的属性：
 * pkName -- 主键名
 * fkName -- 外键名，在FORM记录保存后回写需要用到
 * fkValue -- 外键值，在保存数据时必须传递到后台
 * pageType -- 页面类型
 * isShow -- 是否初始显示数据
 * selectKeyId -- 选择的单条记录ID，用于识别当前选择的记录
 *
 * treeParam -- 点击的树形节点信息
 *
 * jxstarParam.old_wsql -- 原查询语句，如数据导入窗口的过滤语句，在通用查询时用到
 * jxstarParam.old_wtype -- 原查询参数类型
 * jxstarParam.old_wvalue -- 原查询参数值
 * jxstarParam.tree_wsql -- 树型查询语句，在通用查询时用到
 * jxstarParam.tree_wtype -- 树型查询参数类型
 * jxstarParam.tree_wvalue -- 树型查询参数值
 *
 * 还有Grid.Event.dataImport、upload方法中有使用自定义参数，在方法中消除
 * 
 * 扩展表单Form对象的属性：
 * myGrid -- 对应的表格对象
 * myRecord -- 当前显示的记录对象
 * myStore -- 当前显示的记录库
 * fkName -- 外键字段名
 * fkValue -- 外键值
 * srcEvent -- 新增来源事件名
 * 
 * ColumnModel.config 增加 defaultval 配置项，配置缺省值，
 * 可以是字符串与函数，在editgrid中新增记录时给缺省值。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

Ext.ns('Jxstar');
(function(){

	Ext.apply(Jxstar, {
		//每页记录数
		pageSize: 50,

		//当前程序会话信息
		session: {},
		
		//当前用户授权的功能ID，在显示功能菜单时添加授权功能ID
		rightNodes: [],
		
		//流程绘图对象，在designer_process.render方法中创建绘图对象
		editor: null,
		
		/**
		* 关闭首页中打开的功能
		* nodeId：功能ID
		*/
		closeNode: function(nodeId) {
			var mainTab = Ext.getCmp('sys_main_tab');
			if (mainTab == null) return;
			
			var funTab = mainTab.getComponent('fun_' + nodeId);
			if (funTab != null) {
				mainTab.remove(funTab, true);
				funTab = null;
				mainTab = null;
			}
		},
		
		/**
		* 在首页的TAB上打开一个功能页面，
		* 
		* nodeId：功能ID
		* pageParam: 页面参数对象
		*	pageType -- 页面类型
		*	parentNodeId -- 父功能ID
		*   isQuery -- 是否工具栏查询，如果是1，则不保存原始查询SQL
		*	whereSql -- 过滤wheresql语句
		*	whereValue -- 过滤语句参数值
		*	whereType -- 过滤语句参数类型
		*	showType -- 审批界面显示样式：grid, form, report
		*	updateId -- 指定form要显示的记录ID
		*/
		createNode: function(nodeId, pageParam) {
			if (nodeId == null || nodeId.length == 0) {
				JxHint.alert(jx.star.noid);	//'打开的功能ID为空！'
				return false;
			}
			
			//功能对象信息
			var define = Jxstar.findNode(nodeId);
			if (define == null) {
				JxHint.alert(String.format(jx.star.nopage, nodeId));	//'没有定义【{0}】功能页面信息！'
				return false;
			}
			
			//检查用户是否有该功能的权限
			if (!Jxstar.validNode(nodeId)) {
				JxHint.alert(String.format(jx.star.noright, nodeId));	//'用户没有该【{0}】功能的授权！'
				return false;
			}
			
			//取主功能TAB
			var mainTab = Ext.getCmp('sys_main_tab');
			if (mainTab == null) return;
			
			var funTitle = define.nodetitle;
			
			//如果打开了功能界面就显示，否则创建功能界面
			var funTab = mainTab.getComponent('fun_' + define.nodeid);
			
			//如果是审批界面，功能标题上添加'--审批'
			if (pageParam && pageParam.showType && pageParam.showType.length > 0) {
				if (pageParam.pageType && pageParam.pageType == 'check') {
					funTitle += '--' + jx.base.check;	//审批
				}
				if (funTab != null) {//如果已显示，则先删除该功能再显示
					mainTab.remove(funTab, true);
					funTab = null;
				}
			}
			
			if (funTab == null) {
				var index = mainTab.items.length;
				if (index > 8) {
					JxHint.alert(jx.star.morefun);	//'打开的功能数量过多,请关闭不必要的功能标签页！'
					return false;
				}
				
				//异步加载功能对象后再显示
				var hdCall = function(f) {
					var page = f(define, pageParam);
					//如果不是layout页面，是GridNode页面，则有showPage方法
					if (typeof page.showPage == 'function') {
						pageParam = pageParam || {};
						page = page.showPage(pageParam.pageType, pageParam.parentNodeId);
					}

					funTab = mainTab.add({
						id: 'fun_' + define.nodeid,
						title: funTitle,
						border: false,
						layout: 'fit',
						closable: true,
						autoScroll: true,
						iconCls: 'function',
						items: [page],
						listeners: {//下面的方法有利于释放内存对象
							beforedestroy: function(){
								page = null;
								funTab = null;
							},
							destroy: function(){
								if(Ext.isIE){CollectGarbage();}//IE强制回收内存
							}
						}
					});
					mainTab.activate(funTab);
					
					//显示表格对象后再加载数据才稳定
					if (page.isXType('grid')) {
						if (pageParam && pageParam.whereSql && pageParam.whereSql.length > 0) {
							Jxstar.loadData(page, {where_sql:pageParam.whereSql, where_value:pageParam.whereValue, where_type:pageParam.whereType, is_query:pageParam.isQuery});
						} else {
							Jxstar.loadInitData(page);
						}
					}
					page = null;
				};

				//异步从JS文件加载功能对象
				var pathname = define.layout;
				if (pathname == null || pathname.length == 0) pathname = define.gridpage;
				if (pathname == null || pathname.length == 0 || pathname.indexOf('.jsp') > -1) {
					JxHint.alert(jx.star.dontuse);	//'演示系统，该功能不能使用！'
					return false;
				}
				Request.loadJS(pathname, hdCall);
			} else {
				mainTab.activate(funTab);
			}
		},

		/**
		* 创建页面对象，可以是form与grid
		* 
		* nodeId：功能ID
		* pageName：页面类型gridpage|formpage 
		* target：功能对象显示的窗口
		* pageParam: 页面参数对象，与上面的参数相同
		*/
		createPage: function(nodeId, pageName, target, pageParam) {
			if (nodeId == null || nodeId.length == 0) {
				JxHint.alert(jx.star.noid);	//'打开的功能ID为空！'
				return;
			}

			//功能对象信息
			var define = Jxstar.findNode(nodeId);
			if (define == null) {
				JxHint.alert(String.format(jx.star.nopage, nodeId));	//'没有定义【{0}】功能页面信息！'
				return;
			}

			//取创建页面的函数
			var hdCall = function(f) {
				var page = f(define, pageParam);
				//如果不是layout页面，是GridNode页面，则有showPage方法
				if (typeof page.showPage == 'function') {
					pageParam = pageParam || {};
					page = page.showPage(pageParam.pageType, pageParam.parentNodeId);
				}

				//把新页面添加到目标窗口中
				target.add(page);
				//重新显示目标窗口
				target.doLayout();
				//显示表格对象后再加载数据才稳定
				if (page.isXType('grid')) {
					if (pageParam && pageParam.whereSql && pageParam.whereSql.length > 0) {
						Jxstar.loadData(page, {where_sql:pageParam.whereSql, where_value:pageParam.whereValue, where_type:pageParam.whereType, is_query:pageParam.isQuery});
					} else {
						Jxstar.loadInitData(page);
					}
					
					//打开功能缺省显示界面，可以显示：grid, form, chkreport
					if (pageParam && pageParam.showType && (pageParam.showType == 'form' || pageParam.showType == 'report')) {
						var store = page.getStore(); if (store == null) return;
						store.on('load', function(){
							if (page == null) return;
							//找到指定的行
							var row = 0;
							if (pageParam.updateId != null && pageParam.updateId.length > 0) {
								row = store.find(define.pkcol, pageParam.updateId);
							}
							if (row < 0) return true;
							page.getSelectionModel().selectRow(row);
							//显示审批单
							if (pageParam.showType == 'report') {
								page.gridNode.event.viewHtmlReport();
							} else {
								//显示form界面
								page.gridNode.event.showForm();
							}
							page = null;
						});
					}
				}
			};

			//异步从JS文件加载功能对象
			var pageUrl = define[pageName];
			if (pageUrl.length == 0) {
				JxHint.alert(String.format(jx.star.nopage, nodeId));	//'没有定义【{0}】功能页面信息！'
				return false;
			}
			Request.loadJS(pageUrl, hdCall);
		},

		/**
		* 创建树型对象
		* 
		* nodeId：功能ID
		* target：功能对象显示的窗口
		* [treePanel]: 指定树形控件的显示位置
		* [dataPanel]: 指定数据表格的显示位置
		* [preClickFn]: 点击树形节点前执行的事件，参数是树形布局控件
		*/
		createTree: function(nodeId, target, treePanel, dataPanel, preClickFn) {
			if (nodeId == null || nodeId.length == 0) {
				JxHint.alert(jx.star.notreeid);	//'打开的树型功能ID为空！'
				return;
			}

			treePanel = treePanel || target.getComponent(0);
			dataPanel = dataPanel || target.getComponent(1);

			//取树形定义
			/*var treeDefine = TreeData[nodeId][0];
			if (treeDefine == null) {
				JxHint.alert(jx.star.notree);	//'没有定义树形信息！'
				return;
			}*/

			//查询数据URL
			var dataUrl = Jxstar.path + '/commonAction.do?eventcode=query_tree&funid=queryevent';
				dataUrl += '&tree_funid='+nodeId+'&user_id='+Jxstar.session['user_id'];
			
			var tbar = new Ext.Toolbar();
			var tree = new Ext.tree.TreePanel({
				id: 'tree_'+nodeId,
				tbar: tbar,

				autoScroll:true,
				rootVisible:false,
				lines:false,
				useArrows:false,
				
				loader: new Ext.tree.TreeLoader({
					dataUrl: dataUrl,
					listeners: {
						beforeload:function(loader, node){
							loader.baseParams.tree_no = node.attributes.tree_no||'';
						}
					}
				}),
				
				root: new Ext.tree.AsyncTreeNode({id:'10', iconCls:'tree_root_ext', text:jx.star.refresh})
			});
			
			treePanel.add(tree);
			treePanel.doLayout();
			
			//设置树根节点数据加载时添加配置信息
			tree.on('load', function(node){
				if (node.id == '10') {
					var child = node.firstChild;
					if (!child) return;
					
					var attr = child.attributes;
					var title = attr.tree_title;
					if (title.length > 0) {
						tbar.items.get(0).setText(title);
					}
					
					node.attributes.tree_no = attr.tree_no;
					node.attributes.table_name = attr.table_name;
					node.attributes.node_level = attr.node_level;
					node.attributes.right_where = attr.right_where;
				}
			});
			
			//添加刷新按钮
			tbar.add({text:jx.star.refresh, iconCls:'tree_root',
				handler:function(){
					tree.getLoader().load(tree.getRootNode());
					tree.fireEvent('click', tree.getRootNode());
				}
			});

			//延时执行该方法
			JxUtil.delay(1000, function(){
				var tabPanel = dataPanel.getComponent(0);
				var grid = tabPanel;
				if (!tabPanel.isXType('grid')) {
					grid = tabPanel.getComponent(0).getComponent(0);
				}
				var root = tree.getRootNode();
				//展开根节点，根节点不显示
				//root.expand();

				//设置树型信息
				grid.treeParam = {parentId:'', levelCol:root.attributes.node_level};

				//添加节点点击事件，查询树形数据
				tree.on('click', function(node){
					//切换到第一个标签页
					if (tabPanel.isXType('tabpanel')) {
						tabPanel.activate(tabPanel.getComponent(0));
					}
					
					//扩展点击前事件，主要处理扩展的查询条件
					var extWhere = null;//{where_sql:where_sql, where_value:where_value, where_type:where_type}
					if (preClickFn!= null && typeof preClickFn == 'function') {
						extWhere = preClickFn(tree, node, grid);
					}
					
					var attr = node.attributes;
					var treeId = attr.id;
					var treeLevel = Math.floor(treeId.length/4)+1;
					
					//注册的树形查询条件
					var where_sql = attr.right_where;
					var where_type = 'string';
					//处理查询值
					var where_value = treeId+'%';
					//是否不含下级
					var tools = tree.getTopToolbar().find('xtype', 'checkbox');
					if (tools.length > 0) {
						if (tools[0].getValue() == '1') {
							where_value = treeId;
						}
					}
					//如果过滤条件是=，则不添加%
					if (where_sql.indexOf('=') >= 0) {
						where_value = treeId;
					}
					
					//扩展的树形查询条件
					if (extWhere != null) {
						if (!Ext.isEmpty(extWhere.where_sql)) {
							where_sql += ' and ' + extWhere.where_sql;
						}
						if (!Ext.isEmpty(extWhere.where_value)) {
							where_value += ';' + extWhere.where_value;
						}
						if (!Ext.isEmpty(extWhere.where_type)) {
							where_type += ';' + extWhere.where_type;
						}
					}
					
					//右边表格中的表名与树形数据表是相同的，则只显示下级数据
					var table_name = attr.table_name;
					var right_table = grid.gridNode ? grid.gridNode.define.tablename : '';
					if (table_name.length > 0 && table_name == right_table && 
					   (attr.tree_no == '1' || attr.tree_no == '')) {
						where_sql += ' and ' + attr.node_level + ' = ?';
						where_value += ';' + treeLevel;
						where_type += ';int';
					}

					//保存树形查询参数
					grid.jxstarParam.tree_wsql = where_sql;
					grid.jxstarParam.tree_wtype = where_type;
					grid.jxstarParam.tree_wvalue = where_value;
					//提交后台查询请求
					Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type, is_query:1});

					//添加树形参数值
					grid.treeParam = {parentId:treeId, levelCol:attr.node_level};
				});
				
				//去掉相关对象的引用
				tree.on('beforedestroy', function(){
					grid = null;
					tabPanel = null;
					dataPanel = null;
				});
			});

			return tree;
		},

		/**
		* 打一个弹出Form界面窗口，
		* items参数：
		* filename：显示文件类名
		* title：窗口标题
		* grid: 来源grid
		* width：窗口宽度
		* height: 窗口高度
		* pagetype: 页面类型
		* parentNodeId: 父功能ID
		* record: 记录数据
		* store: 存储对象
		*/
		openSubForm: function(cfg) {
			//异步加载功能对象后再显示
			var hdCall = function(f) {
				var page = f();
				if (typeof page.showPage == 'function') {
					page = page.showPage(cfg.pagetype||'form', cfg.parentNodeId);
				}

				//创建对话框
				var	win = new Ext.Window({
					title: cfg.title,
					layout: 'fit',
					width: cfg.width || 750,
					height: cfg.height || 500,
					constrainHeader: true,
					//resizable: true,
					modal: true,
					border: false,
					closeAction: 'close',
					autoScroll: true,
					style: 'padding: 5px;',
					items: [page]
				});
				win.show();

				//加载表单数据
				if (cfg.store != null) {
					var form = page.getForm();
					form.myGrid = cfg.grid;
					form.myStore = cfg.store;

					if (cfg.record == null) {
						page.formNode.event.create();
					} else {
						form.myRecord = cfg.record;
						form.loadRecord(cfg.record);
					}

					//设置外键值
					form.fkName = cfg.grid.fkName;
					form.fkValue = cfg.grid.fkValue;
					
					//显示FORM时，执行初始化事件
					page.formNode.event.initForm(true);
				}
			};
			
			//异步从JS文件加载功能对象
			Request.loadJS(cfg.filename, hdCall);
		},

		/**
		* 切换到Form界面，约定第一个标签为grid，第二个标签为form
		* items参数：
		* define: 当前功能定义对象
		* grid: 当前grid控件
		* record: 记录数据
		* store: 存储对象
		*/
		showForm: function(items) {
			//取当前功能的数据面板
			var tabpanel = items.grid.findParentByType('tabpanel');
			if (tabpanel == null) return;
			var formpanel = tabpanel.getComponent(1);
			if (formpanel == null) return;
			var formpage = formpanel.getComponent(0);
			if (formpage == null) return;
			
			var form = formpage.getForm();
			form.myGrid = items.grid;
			form.myStore = items.store;
			
			//设置外键值
			form.fkName = items.grid.fkName;
			form.fkValue = items.grid.fkValue;
			
			//打开form的来源事件，在布局页面中切换tab时需要判断
			form.srcEvent = 'create';
			
			//如果记录为空，表示新增记录
			if (items.record == null) {
				//临时采用form对象保存表单对象来处理
				formpage.formNode.event.create();
			} else {
				form.myRecord = items.record;
				form.loadRecord(items.record);
			}
			//切换到form页面
			tabpanel.activate(formpanel);
		},

		/**
		* 打一个弹出的数据窗口，
		* items参数：
		* modal: 是否模态
		* pagetype: 页面类型
		* filename：显示文件类名
		* config: 数据参数
		* title：窗口标题
		* width：窗口宽度
		* height: 窗口高度
		* callback: 回调函数
		*/
		showData: function(cfg) {
			//异步加载功能对象后再显示
			var hdCall = function(f) {
				var page = f(cfg.nodedefine, {pageType:cfg.pagetype});
				if (typeof page.showPage == 'function') {
					page = page.showPage(cfg.pagetype);
				}
				
				var modal = cfg.modal;
				if (cfg.modal == null) modal = true;
				//创建对话框
				var	win = new Ext.Window({
					title: cfg.title,
					layout: 'fit',
					width: cfg.width || 750,
					height: cfg.height || 500,
					constrainHeader: true,
					//resizable: true,
					border: false,
					modal: modal,
					closeAction: 'close',
					autoScroll: true,
					style: 'padding: 5px;',
					items: [page]
				});
				//显示
				win.show();
				//执行回调函数
				if (cfg.callback) cfg.callback(page);
			};

			//异步从JS文件加载功能对象
			Request.loadJS(cfg.filename, hdCall);
		},
		
		/**
		* 打当前功能的高级查询对话框
		* nodePage -- 当前功能对象
		*/
		showQuery: function(nodePage) {
			//异步加载功能对象后再显示
			var hdCall = function(queryData) {
				var page = JxQuery.queryWindow(queryData, nodePage);

				//创建对话框
				var	win = new Ext.Window({
					title: jx.star.hqry,	//'高级查询'
					layout: 'fit',
					width: 750,
					height: 450,
					constrainHeader: true,
					resizable: false,
					modal: true,
					closeAction: 'close',
					style: 'padding: 5px;',
					items: [page]
				});
				//显示
				win.show();
			};
			
			//加载当前功能的高级查询界面
			var params = 'funid=queryevent&eventcode=cond_query';
			params += '&selfunid='+nodePage.nodeId;
			Request.dataRequest(params, hdCall);
		},

		/**
		* 从后台取部分数据到前台加工处理
		* 
		* nodeid: 功能ID
		* options: 请求参数：where_sql, where_value, where_type, callback
		* return 返回的数据结果是一个数组
		*/
		queryData: function(nodeid, options) {
			if (nodeid == null || nodeid.length == 0 || options == null) {
				JxHint.alert(jx.star.noparam);	//'加载数据的参数不正确！'
				return false;
			}
		
			var params = 'eventcode=query_data&funid=queryevent&query_funid='+nodeid;
			params += '&where_sql=' + options.where_sql || '';
			params += '&where_value=' + options.where_value || '';
			params += '&where_type=' + options.where_type || '';
			
			var hdCall = function(data) {
				if (options.callback) {
					options.callback(data.root);
				}
			};
			
			Request.dataRequest(params, hdCall);
		},
		
		/**
		* 加载子表格的数据，
		* 
		* grid: 表格对象
		* fkval: 外键值
		*/
		loadSubData: function(grid, fkval) {
			if (grid == null) return;
			if (!grid.isXType('grid')) {
				JxHint.alert(jx.star.nosubgrid);	//'无法识别子表对象，不能加载数据！'
				return;
			}
			if (fkval == null || fkval.length == 0) return;
			//取主键名
			var fkName = grid.fkName;
			if (fkName == null || fkName.length == 0) {
				JxHint.alert(jx.star.nofk);		//'该功能没有注册外键！'
				return false;
			}
			fkName = fkName.replace('__', '.');
			
			//提交后台查询请求
			var wsql = fkName + ' = ?';
			var whereParam = {where_sql:wsql, where_value:fkval, where_type:'string'};
			
			//扩展子功能wheresql，用fkval作为参数
			if (grid.subWhereSql) {
				whereParam.where_sql = grid.subWhereSql();
			}
			//扩展子功能whereparam
			if (grid.subWhereParam) {
				whereParam = grid.subWhereParam();
			}
			Jxstar.loadData(grid, whereParam);

			//添加外键值
			grid.fkValue = fkval;
		},

		/**
		* 重载表格的数据，去掉了所有后加的查询条件。
		* 
		* grid: 表格对象
		*/
		reload: function(grid) {
			grid.getStore().load({params:{start:0,limit:Jxstar.pageSize}});
		},

		/**
		* 重载表格的数据，
		* 
		* grid: 表格对象
		* options: 查询参数对象，参数有：
		*	where_sql -- 过滤语句
		*	where_value -- 参数值 
		*	where_type -- 参数类型
		*	is_query -- 缺省值为0，为1表示是工具栏查询，则附加原查询语句查询，且不保存当前查询语句
		*	query_type -- 缺省值为0，为1表示是高级查询，高级查询不处理归档，可以查询已复核的数据
		*	has_page -- 缺省值为1，为1表示处理分页查询，否则不处理分页查询
		*/
		loadData: function(grid, options) {
			if (grid == null || grid.getStore() == null) return;
			//保存原查询语句，如数据导入时用到
			if (!options.is_query) {
				grid.jxstarParam.old_wsql = options.where_sql||'';
				grid.jxstarParam.old_wtype = options.where_type||'';
				grid.jxstarParam.old_wvalue = options.where_value||'';
			} else {
			//取原查询语句
				var old_wsql = grid.jxstarParam.old_wsql;
				var old_wtype = grid.jxstarParam.old_wtype;
				var old_wvalue = grid.jxstarParam.old_wvalue;
				if (old_wsql && old_wsql.length > 0) {
					options.where_sql = '(' + old_wsql + ') and (' + options.where_sql + ')';
				}
				if (old_wtype && old_wtype.length > 0) {
					options.where_type = old_wtype + ';' + options.where_type;
				}
				if (old_wvalue && old_wvalue.length > 0) {
					options.where_value = old_wvalue + ';' + options.where_value;
				}
			}
			
			var params = Ext.apply({start:0, limit:Jxstar.pageSize}, options);
			grid.getStore().load({params:params});
		},

		/**
		* 加载表格的初始数据，
		* 
		* grid: 页面对象
		*/
		loadInitData: function(grid) {
			if (grid != null && grid.isXType('grid')) {
				var store = grid.getStore();
				var pagetype = grid.pageType;
				//combogrid类型的表格在createSelectWin()方法中加载数据
				//子表数据也不执行初始加载，否则会报this.grid is null的错误
				if (store != null && grid.isShow == '1' && (pagetype != 'combogrid' && pagetype.indexOf('sub') < 0)) {
					store.load({
						params:{start:0,limit:Jxstar.pageSize}
					});
				}
			}
		},

		/**
		* private:表格加载数据后的回调函数，
		* 
		* page: 页面对象
		*/
		loadDataBc: function(grid) {
			if (grid == null || grid.getStore() == null) return;

			var count = grid.getStore().getCount();
			var selmodel = grid.getSelectionModel();
			var rowIndex = Jxstar.getSelectIndex(grid);
			if (rowIndex > -1 && count > 0 && typeof selmodel.selectRow != 'undefined') {
				selmodel.selectRow(rowIndex);
				if (count > 0 && grid.pageType != 'combogrid') {
					grid.fireEvent('rowclick', grid, rowIndex);
				}
			}

			//显示统计数据
			JxUtil.viewSumData(grid);
			
			//处理表格记录是否有附件的标志
			JxAttach.viewAttachFlag(grid);
		},
		
		/**
		 * 根据表格当前选择的记录ID取行号；
		 * 缺省不选择第1行记录；
		 **/
		getSelectIndex: function(grid) {
			if (grid == null || grid.getStore() == null) return 0;
			var selectKeyId = grid.selectKeyId || '';
			var rowIndex = -1, store = grid.getStore();
			if (selectKeyId.length > 0) {
				var pkcol = grid.gridNode.define.pkcol;
				var index = store.find(pkcol, selectKeyId);
				if (index > -1) rowIndex = index;
			}
			
			return rowIndex;
		},

		/**
		* private:在分页栏中显示统计数据
		* 被JxUtil.viewSumData方法替换。
		* 
		* page: 页面对象
		*/
		viewSumData: function(grid) {
			var totalText = ' ';
			var cm = grid.getColumnModel();
			var sumData = grid.getStore().reader.jsonData.data.sum;
			
			if (sumData != null && sumData.length > 0) {
				/*sumData = sumData[0];
				for(var key in sumData){
					var val = sumData[key];
					totalText += cm.getColumnById(key).header + '=' + val + ' ';
				}
				JxHint.alert(totalText);*/
				var bbar = grid.getBottomToolbar();
				var bsum = bbar.getEl().prev();
				if (grid.jxsum) {
					grid.jxsum.refresh(sumData[0]);
				} else {
					var sum = new Jxstar.JxSum();
					sum.init(grid);
					var vh = sum.doRender(sumData[0]);
					bbar.getEl().insertHtml('beforeBegin', vh);
					//重新显示表格
					grid.doLayout();
				}
			}
		},
		
		/**
		* 查找功能定义信息，采用静态文件，不采用动态加载的方式，
		* 这点不再做其它测试，两者性能相差5倍。
		* nodeId: 功能ID
		*/
		findNode: function(nodeId) {
			var define = NodeDefine[nodeId];
			if (define == null) {
				return {gridpage:'', formpage:''};
			}
			
			//处理功能名称的多语言
			define.nodetitle = JxLang.funText(define.nodeid, define.nodetitle);

			return define;
		},
		
		/**
		* 检查功能ID是否是已授权的功能ID
		* nodeId: 功能ID
		*/
		validNode: function(nodeId) {
			var self = this;
			//如果是管理员，则不校验
			var roleId = JxDefault.getRoleId();
			if (roleId.indexOf('admin') >= 0) return true;
			
			//检查功能ID是否在授权的功能ID数组中
			for (var i = 0; i < self.rightNodes.length; i++) {
				if (self.rightNodes[i] == nodeId) return true;
			}
			return false;
		},

		/**
		* 查找下拉选项控件，
		* 
		* comboID: 选项代号
		*/
		findComboData: function(comboID) {
			var define = ComboData[comboID];
			if (define == null) {
				define = [['', '']];
			}

			return define;
		},

		/**
		* 创建一个显示下拉选项数据的块，
		* 
		*/
		createComboMenu: function(parentField) {
			var m = new Ext.menu.Menu({width:350, height:300});
			m.parentField = parentField;

			return m;
		},

		/**
		* 创建一个下拉选项对象，
		* 
		* comboID: 选项代号
		* comboData: 选项数据
		* comboWidth: 控件宽度
		*/
		createCombo: function(comboID, comboData, comboWidth) {
			var combo = new Ext.form.ComboBox({
				name:comboID, 
				store: new Ext.data.SimpleStore({
					fields:['value','text'],
					data: comboData
				}),
				emptyText: jx.star.select,	//'请选择'
				mode: 'local',
				triggerAction: 'all',
				valueField: 'value',
				displayField: 'text',
				editable:false,
				width: comboWidth||80,
				value: comboData[0][0]});
			
			return combo;
		},

		/**
		* 创建简单查询工具栏，
		* 
		* nodePage: 功能页面
		*/
		createSimpleQuery: function(nodePage) {
			var self = this;
			var page = nodePage.page;
			var tbar = page.getTopToolbar();

			tbar.add('-');

			//显示查询字段
			var fieldID = JxUtil.newId() + '_qf';
			var fieldNames = [], mycols = nodePage.param.cols;
			for (var i = 0, c = 0, n = mycols.length; i < n; i++){
				var mc = mycols[i].col, mf = mycols[i].field; 
				if (mc == null || mf == null) continue;
				
				var fn = mf.name, len = fn.length;
				if (mc && mf && (fn.substring(len-2) != 'id' || !mc.hidden)) {
					//可编辑表格的必填字段表头添加了*号，要去掉
					var h = mc.header;
					if (h.charAt(0) == '*') h = h.substr(1);
					fieldNames[c++] = [fn, h];
				}
			}
			var fieldCombo = self.createCombo(fieldID, fieldNames, 100);
			tbar.add(fieldCombo);

			//显示查询条件
			var condID = JxUtil.newId() + '_qc';
			var condData = ComboData.condtype;
			var condCombo = self.createCombo(condID, condData);
			tbar.add(condCombo);

			//显示查询值录入对象
			var valueID = JxUtil.newId() + '_qv';
			var valuePanel = new Ext.Container({id:valueID, width:120, layout:'fit', border:false, items:[{xtype:'textfield'}]});
			tbar.add(valuePanel);
			//在IE8时会出现textfield高度为17px的情况
			valuePanel.on('afterlayout', function(c){
				var el = c.getComponent(0).getEl();
				if (el && el.getHeight() < 20) el.setHeight(20);
			});

			//监听字段选择的事件
			fieldCombo.on('select', function(combo){
				var field, oldValue = '', coltype = 'string';
				//保存原输入控件中的值
				var oldField = valuePanel.getComponent(0);
				if (oldField != null && oldField.isXType('textfield', true)) {
					oldValue = oldField.getValue();
				}
				
				//更换字段查询值的输入控件
				for (var i = 0, n = mycols.length; i < n; i++){
					var mc = mycols[i].col, mf = mycols[i].field;
					if (mf && mf.name == combo.getValue()) {
						coltype = mf.type;
						if (!mc.hasOwnProperty('editor')) {
							if (coltype == 'string') { 
								field = new Ext.form.TextField();
							} else if (coltype == 'date') { 
								field = new Ext.form.DateField({format:'Y-m-d'});
							} else {
								field = new Ext.form.NumberField({maxLength:12});
							}
						} else {
							var oldcmp = mc.editor;
							var r = (!oldcmp.isXType('combo'));
							Ext.apply(oldcmp.initialConfig, {allowBlank:true, editable:r, cls:''});
							field = new oldcmp.constructor(oldcmp.initialConfig);
						}
						break;
					}
				}
				//如果新控件也是文本控件，则需要保留值
				if (field.isXType('textfield', true) && oldValue != null && oldValue.length > 0) {
					field.setValue(oldValue);
					oldField = null; oldValue = '';
				}
				
				//聚焦全选字段值
				field.selectOnFocus = true;
				//先清除原输入控件
				valuePanel.removeAll(true);
				//再添加新控件
				valuePanel.add(field);
				valuePanel.doLayout(true);
				
				//如果是input输入栏，则输入回车就查询。
				if (field.el && field.isXType('textfield')) {
					field.on('specialkey', function(field, e){
						if (e.getKey() == e.ENTER) {
							self.simpleQuery(page, fieldCombo, condCombo, valuePanel);
						}
					});
				}

				//更换字段查询条件的缺省值
				JxQuery.setCondDefault(condCombo, coltype, field.getXType());

				//保存字段数据类型
				valuePanel.valueType = coltype;
			});
			//显示查询按钮
			tbar.add({iconCls:'eb_qry', tooltip:jx.star.qry, handler:function(){	//'查询'
				self.simpleQuery(page, fieldCombo, condCombo, valuePanel);
			}});
			//显示高级查询按钮
			tbar.add({iconCls:'eb_qryh', tooltip:jx.star.hqry, handler:function(){	//'高级查询'
				self.showQuery(nodePage);
			}});

			//刷新工具栏
			tbar.doLayout();
			
			//处理第一个查询字段
			var first = nodePage.define.first;
			if (first != null && first.length > 0) {
				fieldCombo.setValue(first);
			}
			fieldCombo.fireEvent('select', fieldCombo);
		},

		/**
		* 创建一个下拉选项对象，
		* 
		* comboID: 选项代号
		* comboData: 选项数据
		* comboWidth: 控件宽度
		*/
		simpleQuery: function(page, fieldCombo, condCombo, valuePanel) {
			var colcode = fieldCombo.getValue().replace('__', '.');
			var condtype = condCombo.getValue();
			var value = valuePanel.getComponent(0).getValue();
			var coltype = valuePanel.valueType;
			
			if (value == null || Ext.util.Format.trim(value).length == 0) {
				valuePanel.getComponent(0).setValue('%');
				value = '%';
			}
			
			//取查询语句
			var wheres = JxQuery.getWhere(colcode, condtype, value, coltype)

			//取树形查询语句
			var tree_wsql = page.jxstarParam.tree_wsql;
			var tree_wtype = page.jxstarParam.tree_wtype;
			var tree_wvalue = page.jxstarParam.tree_wvalue;
			if (tree_wsql && tree_wsql.length > 0) {
				wheres[0] = tree_wsql + ' and (' + wheres[0] + ')';
			}
			if (tree_wvalue && tree_wvalue.length > 0) {
				wheres[1] = tree_wvalue + ';' + wheres[1];
			}
			if (tree_wtype && tree_wtype.length > 0) {
				wheres[2] = tree_wtype + ';' + wheres[2];
			}

			//JxHint.alert('wsql='+wheres[0]+', wvalue='+wheres[1]+', wtype='+wheres[2]);
			Jxstar.loadData(page, {where_sql:wheres[0], where_value:wheres[1], where_type:wheres[2], is_query:1});
		}
	});//Ext.apply

})();

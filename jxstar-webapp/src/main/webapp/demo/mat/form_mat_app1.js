Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var auditData = Jxstar.findComboData('audit');
	var apptypeData = Jxstar.findComboData('apptype');
	var items = [{
		height: '97%',
		width: '97%',
		border: false,
		layout: 'form',
		style: 'padding:10px;',
		items: [{
			anchor:'100%',
			border: false,
			layout:'column',
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.495,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'combo', fieldLabel:'记录状态', name:'mat_app__auditing', defaultval:'0',
						anchor:'100%', readOnly:true, editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: auditData
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: auditData[0][0]},
					{xtype:'textfield', fieldLabel:'项目名称', name:'mat_app__project_name', anchor:'100%', maxLength:50},
					{xtype:'numberfield', decimalPrecision:6, fieldLabel:'预算金额(万元)', name:'mat_app__app_money', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', anchor:'100%', maxLength:12},
					{xtype:'textfield', fieldLabel:'采购负责人', name:'mat_app__stock_user', anchor:'100%', maxLength:20},
					{xtype:'trigger', fieldLabel:'申请部门', name:'mat_app__dept_name', defaultval:'fun_getDeptName()',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:50, editable:false,
						onTriggerClick: function() {
							var selcfg = {pageType:'combogrid', nodeId:'sys_dept', layoutPage:'/public/layout/layout_tree.js', sourceField:'', targetField:'', whereSql:"", whereValue:'', whereType:'', isSame:'1', isShowData:'1', isMoreSelect:'0',isReadonly:'1',fieldName:'mat_app.dept_name'};
							JxSelect.createSelectWin(selcfg, this, 'node_mat_app1_form');
						}},
					{xtype:'textfield', fieldLabel:'申请单号', name:'mat_app__app_code', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'combo', fieldLabel:'申请类型', name:'mat_app__app_type', defaultval:'1',
						anchor:'100%', editable:false, allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*',
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: apptypeData
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: apptypeData[0][0]},
					{xtype:'hidden', fieldLabel:'申请人ID', name:'mat_app__app_userid', defaultval:'fun_getUserId()', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'申请部门ID', name:'mat_app__dept_id', defaultval:'fun_getDeptId()', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'datefield', fieldLabel:'申请日期', name:'mat_app__app_date', defaultval:'fun_getToday()', format:'Y-m-d', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', anchor:'100%'},
					{xtype:'textfield', fieldLabel:'申请人', name:'mat_app__app_user', defaultval:'fun_getUserName()', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'textarea', fieldLabel:'申请理由', name:'mat_app__app_cause', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', width:'100%', height:48, maxLength:200},
					{xtype:'textarea', fieldLabel:'效益分析', name:'mat_app__app_analyse', width:'100%', height:72, maxLength:200},
					{xtype:'hidden', fieldLabel:'主键', name:'mat_app__app_id', anchor:'100%'}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'mat_app1'
	};

	var formAddSub = function(config) {
		var define = Jxstar.findNode(config.param.funid);
		var subfunid = define.subfunid;
		if (subfunid == null || subfunid.length == 0) return;
		
		var cfgitems = config.param.items;
		var subfunids = subfunid.split(',');
		for (var i = 0, n = subfunids.length; i < n; i++) {
			var subid = subfunids[i];
			if (subid.length == 0) continue;
			
			var subdefine = Jxstar.findNode(subid);
			var subtitle = subdefine.nodetitle;
			cfgitems[cfgitems.length] = {
				border: false,
				width: '100%',
				style: 'padding:10px;',
				items:[{xtype:'container', border:false, style:'padding:0 5 0 5px;', layout:'fit', cls:'form_subpanel', data:subid, height: 180}]
			};
		}
	};
	
	//显示明细表格，添加相关事件
	var formShowSub = function(formNode) {
		var fevent = formNode.event;
		var page = formNode.page;
		
		//取明细表的panel
		var subps = page.find('cls', 'form_subpanel');
		if (subps == null || subps.length == 0) return;
		
		//创建明细表对象
		for (var i = 0, n = subps.length; i < n; i++) {
			var subParam = {pageType:'subgrid', parentNodeId:formNode.nodeId};
			Jxstar.createPage(subps[i].data, 'gridpage', subps[i], subParam);
		}
		
		//每次改变form记录时重新加载明细表记录
		fevent.on('initother', function(event) {
			if (subps == null || subps.length == 0) return;
			
			var define = event.define;
			var form = event.form;
			
			var pkcol = define.pkcol;
			var pkvalue = form.get(pkcol);
			
			var showsub = function(){
				for (var i = 0, n = subps.length; i < n; i++) {
					var subgrid = subps[i].getComponent(0);
					if (subgrid.body && subgrid.body.hasClass('x-subgrid') == false) {
						subgrid.body.addClass('x-subgrid');
						var tbar = subgrid.getTopToolbar();
						if (tbar) tbar.addClass('x-subgrid');
					}
					if (pkvalue == null || pkvalue.length == 0) {
						subgrid.getStore().removeAll();
						subgrid.fkValue = '';
						subgrid.disable();
					} else {
						subgrid.enable();
						Jxstar.loadSubData(subgrid, pkvalue);
					}
					
					//如果主记录已提交，则明细表的按钮不能使用
					if (define.auditcol.length > 0) {
						var state = form.get(define.auditcol);
						if (state == null || state.length == 0) state = '0';
						var disable = (state != '0' && state != '6');
						var tools = subgrid.getTopToolbar();
						JxUtil.disableButton(tools, disable);
					}
				}
			};
			//在审批界面中，如果显示form界面太快，会报subgrid is null错误，这种情况采用延时处理
			var tmpg = subps[0].getComponent(0);
			if (tmpg) {
				showsub();
			} else {
				JxUtil.delay(500, showsub);
			}
		});
		
		fevent.on('beforecreate', function(event) {
			fevent.fireEvent('initother', fevent);
		});
		fevent.on('aftercreate', function(event) {
			fevent.fireEvent('initother', fevent);
		});
		fevent.on('afteraudit', function(event) {
			fevent.fireEvent('initother', fevent);
		});
	};
	
	formAddSub(config);

	config.initpage = function(formNode){
		formShowSub(formNode);
	};
	
	return new Jxstar.FormNode(config);
}
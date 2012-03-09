Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var authtypeData = Jxstar.findComboData('authtype');
	var auditData = Jxstar.findComboData('audit');
	var moneytypeData = Jxstar.findComboData('moneytype');
	var checkdeptData = Jxstar.findComboData('checkdept');
	var projstatusData = Jxstar.findComboData('projstatus');
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
					{xtype:'textfield', fieldLabel:'项目编号', name:'project_base__project_code', readOnly:true, anchor:'100%', maxLength:50},
					{xtype:'textfield', fieldLabel:'项目名称', name:'project_base__project_name', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', anchor:'100%', maxLength:50},
					{xtype:'textfield', fieldLabel:'计划批复文号', name:'project_base__check_fileno', readOnly:true, anchor:'100%', maxLength:100},
					{xtype:'numberfield', decimalPrecision:6, fieldLabel:'计划批复金额(万元)', name:'project_base__plan_money', readOnly:true, anchor:'100%', maxLength:12},
					{xtype:'combo', fieldLabel:'授权类型', name:'project_base__auth_type',
						anchor:'100%', readOnly:true, editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: authtypeData
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: authtypeData[0][0]},
					{xtype:'datefield', fieldLabel:'计划开始日期', name:'project_base__plan_sdate', format:'Y-m-d', anchor:'100%'},
					{xtype:'trigger', fieldLabel:'项目负责人', name:'project_base__project_user',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:100, allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', editable:false,
						onTriggerClick: function() {
							var selcfg = {pageType:'combogrid', nodeId:'sys_user', layoutPage:'/public/layout/layout_tree.js', sourceField:'sys_user.user_name;user_id', targetField:'project_base.project_user;project_userid', whereSql:"", whereValue:'', whereType:'', isSame:'0', isShowData:'1', isMoreSelect:'0',isReadonly:'1',fieldName:'project_base.project_user'};
							JxSelect.createSelectWin(selcfg, this, 'node_project_create_form');
						}},
					{xtype:'textfield', fieldLabel:'立项批复文号', name:'project_base__project_fileno', anchor:'100%', maxLength:100},
					{xtype:'datefield', fieldLabel:'立项批复日期', name:'project_base__check_date', format:'Y-m-d', anchor:'100%'},
					{xtype:'numberfield', decimalPrecision:6, fieldLabel:'立项批复金额(万元)', name:'project_base__project_money', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', anchor:'100%', maxLength:12},
					{xtype:'hidden', fieldLabel:'计划编号', name:'project_base__plan_code', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'项目负责人id', name:'project_base__project_userid', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'实施单位id', name:'project_base__dept_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'combo', fieldLabel:'记录状态', name:'project_base__auditing', defaultval:'0',
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
					{xtype:'combo', fieldLabel:'项目类别', name:'project_base__money_type',
						anchor:'100%', readOnly:true, editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: moneytypeData
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: moneytypeData[0][0]},
					{xtype:'textfield', fieldLabel:'计划批文名称', name:'project_base__check_name', readOnly:true, anchor:'100%', maxLength:100},
					{xtype:'textfield', fieldLabel:'实施单位', name:'project_base__dept_name', readOnly:true, anchor:'100%', maxLength:50},
					{xtype:'trigger', fieldLabel:'主管部门', name:'project_base__done_deptname',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:50, allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', editable:false,
						onTriggerClick: function() {
							var selcfg = {pageType:'combogrid', nodeId:'sys_dept', layoutPage:'/public/layout/layout_tree.js', sourceField:'sys_dept.dept_name;dept_id', targetField:'sys_dept.done_deptname;done_deptid', whereSql:"dept_level < 3", whereValue:'', whereType:'', isSame:'0', isShowData:'1', isMoreSelect:'0',isReadonly:'1',fieldName:'project_base.done_deptname'};
							JxSelect.createSelectWin(selcfg, this, 'node_project_create_form');
						}},
					{xtype:'datefield', fieldLabel:'计划结束日期', name:'project_base__plan_edate', format:'Y-m-d', anchor:'100%'},
					{xtype:'datefield', fieldLabel:'立项申请日期', name:'project_base__project_date', defaultval:'fun_getToday()', format:'Y-m-d', anchor:'100%'},
					{xtype:'textfield', fieldLabel:'立项批文名称', name:'project_base__project_checkname', anchor:'100%', maxLength:100},
					{xtype:'combo', fieldLabel:'立项批复单位', name:'project_base__check_dept',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: checkdeptData
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: checkdeptData[0][0]},
					{xtype:'combo', fieldLabel:'项目状态', name:'project_base__project_status', defaultval:'1',
						anchor:'100%', readOnly:true, editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: projstatusData
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: projstatusData[0][0]},
					{xtype:'hidden', fieldLabel:'主管部门id', name:'project_base__done_deptid', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'投资计划ID', name:'project_base__plan_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'项目ID', name:'project_base__project_id', anchor:'100%'}
				]
			}
			]
		},{
			anchor:'100%',
			border: false,
			layout:'column',
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.99,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'textarea', fieldLabel:'项目主要内容', name:'project_base__project_content', width:'100%', height:48, maxLength:100},
					{xtype:'textarea', fieldLabel:'项目必要性、可行性', name:'project_base__project_cause', width:'100%', height:48, maxLength:100},
					{xtype:'textarea', fieldLabel:'项目论证结论意见', name:'project_base__project_result', width:'100%', height:48, maxLength:100},
					{xtype:'textfield', fieldLabel:'论证人员签字', name:'project_base__result_user', anchor:'100%', maxLength:100},
					{xtype:'textfield', fieldLabel:'备注', name:'project_base__project_memo', anchor:'100%', maxLength:200}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'project_create'
	};

	
	
	return new Jxstar.FormNode(config);
}
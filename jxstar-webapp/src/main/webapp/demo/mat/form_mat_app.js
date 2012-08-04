Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var auditData = Jxstar.findComboData('audit');
	var apptypeData = Jxstar.findComboData('apptype');
	var items = [{
		width:'97%',
		border:false,
		layout:'form',
		autoHeight:true,
		xtype:'container',
		style:'padding:5 10 5 10;',
		items:[{
			anchor:'100%',
			border:false,
			xtype:'container',
			layout:'column',
			border:true,
			xtype:'fieldset',
			title:'采购申请信息',
			collapsible:false,
			collapsed:false,
			autoHeight:true,
			items:[{
				border:false,
				xtype:'container',
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
					{xtype:'numberfield', decimalPrecision:6, fieldLabel:'预算金额(万元)', name:'mat_app__app_money', anchor:'100%', maxLength:12},
					{xtype:'textfield', fieldLabel:'采购负责人', name:'mat_app__stock_user', anchor:'100%', maxLength:20},
					{xtype:'combo', fieldLabel:'申请部门', name:'mat_app__dept_name', defaultval:'fun_getDeptName()',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:50, editable:true,
						listeners:{afterrender: function(combo) {
							JxSelect.initCombo('mat_app', combo, 'node_mat_app_form');
						}}},
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
				xtype:'container',
				columnWidth:0.495,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'datefield', fieldLabel:'申请日期', name:'mat_app__app_date', defaultval:'fun_getToday()', format:'Y-m-d', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', anchor:'100%'},
					{xtype:'textfield', fieldLabel:'申请人', name:'mat_app__app_user', defaultval:'fun_getUserName()', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'numberfield', decimalPrecision:2, fieldLabel:'采购数量', name:'mat_app__app_num', anchor:'100%', maxLength:12},
					{xtype:'textarea', fieldLabel:'申请理由', name:'mat_app__app_cause', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', width:'100%', height:48, maxLength:200},
					{xtype:'textarea', fieldLabel:'效益分析', name:'mat_app__app_analyse', width:'100%', height:48, maxLength:200},
					{xtype:'hidden', fieldLabel:'主键', name:'mat_app__app_id', anchor:'100%'}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'mat_app'
	};

	config.param.subConfig = { height:230, width:800};
	JxFormSub.formAddSub(config);

	﻿
	
	return new Jxstar.FormNode(config);
}
Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var auditData = Jxstar.findComboData('audit');
	var moneytypeData = Jxstar.findComboData('moneytype');
	var authtypeData = Jxstar.findComboData('authtype');
	var projstatusData = Jxstar.findComboData('projstatus');

	var cols = [
	{col:{header:'记录状态', width:62, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: auditData
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: auditData[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < auditData.length; i++) {
				if (auditData[i][0] == value)
					return auditData[i][1];
			}
		}}, field:{name:'project_base__auditing',type:'string'}},
	{col:{header:'项目编号', width:100, sortable:true}, field:{name:'project_base__project_code',type:'string'}},
	{col:{header:'项目名称', width:169, sortable:true}, field:{name:'project_base__project_name',type:'string'}},
	{col:{header:'计划编号', width:100, sortable:true, hidden:true}, field:{name:'project_base__plan_code',type:'string'}},
	{col:{header:'项目类别', width:100, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: moneytypeData
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: moneytypeData[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < moneytypeData.length; i++) {
				if (moneytypeData[i][0] == value)
					return moneytypeData[i][1];
			}
		}}, field:{name:'project_base__money_type',type:'string'}},
	{col:{header:'授权类型', width:100, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: authtypeData
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: authtypeData[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < authtypeData.length; i++) {
				if (authtypeData[i][0] == value)
					return authtypeData[i][1];
			}
		}}, field:{name:'project_base__auth_type',type:'string'}},
	{col:{header:'主管部门', width:130, sortable:true}, field:{name:'project_base__done_deptname',type:'string'}},
	{col:{header:'项目负责人', width:76, sortable:true}, field:{name:'project_base__project_user',type:'string'}},
	{col:{header:'计划批复文号', width:100, sortable:true}, field:{name:'project_base__check_fileno',type:'string'}},
	{col:{header:'计划批复金额(万元)', width:130, sortable:true, renderer:JxUtil.formatNumber(6)}, field:{name:'project_base__plan_money',type:'float'}},
	{col:{header:'实施单位', width:132, sortable:true}, field:{name:'project_base__dept_name',type:'string'}},
	{col:{header:'立项申请日期', width:100, sortable:true, renderer:function(value) {
			return value ? value.format('Y-m-d') : '';
		}}, field:{name:'project_base__project_date',type:'date'}},
	{col:{header:'计划开始日期', width:100, sortable:true, renderer:function(value) {
			return value ? value.format('Y-m-d') : '';
		}}, field:{name:'project_base__plan_sdate',type:'date'}},
	{col:{header:'计划结束日期', width:100, sortable:true, renderer:function(value) {
			return value ? value.format('Y-m-d') : '';
		}}, field:{name:'project_base__plan_edate',type:'date'}},
	{col:{header:'计划批文名称', width:100, sortable:true, hidden:true}, field:{name:'project_base__check_name',type:'string'}},
	{col:{header:'立项批复单位', width:100, sortable:true, hidden:true}, field:{name:'project_base__check_dept',type:'string'}},
	{col:{header:'立项批复日期', width:100, sortable:true, hidden:true, renderer:function(value) {
			return value ? value.format('Y-m-d') : '';
		}}, field:{name:'project_base__check_date',type:'date'}},
	{col:{header:'立项批复金额(万元)', width:100, sortable:true, hidden:true, renderer:JxUtil.formatNumber(6)}, field:{name:'project_base__project_money',type:'float'}},
	{col:{header:'项目主要内容', width:100, sortable:true, hidden:true}, field:{name:'project_base__project_content',type:'string'}},
	{col:{header:'项目必要性、可行性', width:100, sortable:true, hidden:true}, field:{name:'project_base__project_cause',type:'string'}},
	{col:{header:'项目论证结论意见', width:100, sortable:true, hidden:true}, field:{name:'project_base__project_result',type:'string'}},
	{col:{header:'论证人员签字', width:100, sortable:true, hidden:true}, field:{name:'project_base__result_user',type:'string'}},
	{col:{header:'备注', width:100, sortable:true, hidden:true}, field:{name:'project_base__project_memo',type:'string'}},
	{col:{header:'投资计划ID', width:100, sortable:true, hidden:true}, field:{name:'project_base__plan_id',type:'string'}},
	{col:{header:'项目负责人id', width:100, sortable:true, hidden:true}, field:{name:'project_base__project_userid',type:'string'}},
	{col:{header:'项目ID', width:100, sortable:true, hidden:true}, field:{name:'project_base__project_id',type:'string'}},
	{col:{header:'实施单位id', width:100, sortable:true, hidden:true}, field:{name:'project_base__dept_id',type:'string'}},
	{col:{header:'项目状态', width:70, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: projstatusData
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: projstatusData[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < projstatusData.length; i++) {
				if (projstatusData[i][0] == value)
					return projstatusData[i][1];
			}
		}}, field:{name:'project_base__project_status',type:'string'}},
	{col:{header:'主管部门id', width:100, sortable:true, hidden:true}, field:{name:'project_base__done_deptid',type:'string'}},
	{col:{header:'立项批复文号', width:100, sortable:true, hidden:true}, field:{name:'project_base__project_fileno',type:'string'}},
	{col:{header:'立项批文名称', width:100, sortable:true, hidden:true}, field:{name:'project_base__project_checkname',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'project_create'
	};
	
	
		
	return new Jxstar.GridNode(config);
}
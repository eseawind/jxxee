Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var auditData = Jxstar.findComboData('audit');
	var moneytypeData = Jxstar.findComboData('moneytype');
	var plantypeData = Jxstar.findComboData('plantype');
	var yesnoData = Jxstar.findComboData('yesno');
	var planyearData = Jxstar.findComboData('planyear');
	var planstatusData = Jxstar.findComboData('planstatus');

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
		}}, field:{name:'money_plan__auditing',type:'string'}},
	{col:{header:'项目名称', width:177, sortable:true}, field:{name:'money_plan__plan_name',type:'string'}},
	{col:{header:'主要内容与申请理由', width:286, sortable:true}, field:{name:'money_plan__plan_desc',type:'string'}},
	{col:{header:'预计总投资(万元)', width:113, sortable:true, renderer:JxUtil.formatNumber(6)}, field:{name:'money_plan__plan_money',type:'float'}},
	{col:{header:'当年预计付款(万元)', width:121, sortable:true, renderer:JxUtil.formatNumber(6)}, field:{name:'money_plan__year_money',type:'float'}},
	{col:{header:'项目类别', width:98, sortable:true, align:'center',
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
			editable:false, allowBlank:false,
			value: moneytypeData[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < moneytypeData.length; i++) {
				if (moneytypeData[i][0] == value)
					return moneytypeData[i][1];
			}
		}}, field:{name:'money_plan__money_type',type:'string'}},
	{col:{header:'计划类型', width:73, sortable:true, hidden:true, align:'center',
		renderer:function(value){
			for (var i = 0; i < plantypeData.length; i++) {
				if (plantypeData[i][0] == value)
					return plantypeData[i][1];
			}
		}}, field:{name:'money_plan__plan_type',type:'string'}},
	{col:{header:'数量', width:100, sortable:true, hidden:true, renderer:JxUtil.formatNumber(2)}, field:{name:'money_plan__plan_num',type:'float'}},
	{col:{header:'单位', width:100, sortable:true, hidden:true}, field:{name:'money_plan__plan_unit',type:'string'}},
	{col:{header:'单价(万元)', width:100, sortable:true, hidden:true, renderer:JxUtil.formatNumber(6)}, field:{name:'money_plan__plan_price',type:'float'}},
	{col:{header:'需报国家局', width:74, sortable:true, hidden:true, align:'center',
		renderer:function(value){
			for (var i = 0; i < yesnoData.length; i++) {
				if (yesnoData[i][0] == value)
					return yesnoData[i][1];
			}
		}}, field:{name:'money_plan__up_comp',type:'string'}},
	{col:{header:'拟选供应商', width:100, sortable:true}, field:{name:'money_plan__provider',type:'string'}},
	{col:{header:'型号规格', width:100, sortable:true}, field:{name:'money_plan__device_size',type:'string'}},
	{col:{header:'预计实施时间', width:83, sortable:true}, field:{name:'money_plan__plan_period',type:'string'}},
	{col:{header:'预算年度', width:71, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: planyearData
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: planyearData[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < planyearData.length; i++) {
				if (planyearData[i][0] == value)
					return planyearData[i][1];
			}
		}}, field:{name:'money_plan__plan_year',type:'string'}},
	{col:{header:'申报日期', width:97, sortable:true, renderer:function(value) {
			return value ? value.format('Y-m-d') : '';
		}}, field:{name:'money_plan__plan_date',type:'date'}},
	{col:{header:'申报人', width:61, sortable:true}, field:{name:'money_plan__plan_user',type:'string'}},
	{col:{header:'申报部门', width:100, sortable:true}, field:{name:'money_plan__dept_name',type:'string'}},
	{col:{header:'计划编号', width:102, sortable:true}, field:{name:'money_plan__plan_code',type:'string'}},
	{col:{header:'计划状态', width:65, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: planstatusData
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: planstatusData[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < planstatusData.length; i++) {
				if (planstatusData[i][0] == value)
					return planstatusData[i][1];
			}
		}}, field:{name:'money_plan__plan_status',type:'string'}},
	{col:{header:'固定资产编号', width:100, sortable:true}, field:{name:'money_plan__asset_code',type:'string'}},
	{col:{header:'生产厂家', width:100, sortable:true}, field:{name:'money_plan__create_factory',type:'string'}},
	{col:{header:'出厂日期', width:100, sortable:true}, field:{name:'money_plan__create_date',type:'string'}},
	{col:{header:'备注', width:100, sortable:true, hidden:true}, field:{name:'money_plan__plan_memo',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, hidden:true}, field:{name:'money_plan__plan_id',type:'string'}},
	{col:{header:'申报人ID', width:100, sortable:true, hidden:true}, field:{name:'money_plan__plan_userid',type:'string'}},
	{col:{header:'申报部门ID', width:100, sortable:true, hidden:true}, field:{name:'money_plan__dept_id',type:'string'}},
	{col:{header:'必要性、可行性、经济效益分析', width:100, sortable:true, hidden:true}, field:{name:'money_plan__project_cause',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'money_plan'
	};
	
	
		
	return new Jxstar.GridNode(config);
}
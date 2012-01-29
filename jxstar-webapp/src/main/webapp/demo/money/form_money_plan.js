Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var moneytypeData = Jxstar.findComboData('moneytype');
	var auditData = Jxstar.findComboData('audit');
	var planyearData = Jxstar.findComboData('planyear');
	var planstatusData = Jxstar.findComboData('planstatus');
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
					{xtype:'combo', fieldLabel:'项目类别', name:'money_plan__money_type',
						anchor:'100%', editable:false, allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*',
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
					{xtype:'textfield', fieldLabel:'项目名称', name:'money_plan__plan_name', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', anchor:'100%', maxLength:100},
					{xtype:'numberfield', decimalPrecision:6, fieldLabel:'预计总投资(万元)', name:'money_plan__plan_money', defaultval:'0', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', anchor:'100%', maxLength:12},
					{xtype:'numberfield', decimalPrecision:6, fieldLabel:'当年预计付款(万元)', name:'money_plan__year_money', defaultval:'0', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', anchor:'100%', maxLength:12},
					{xtype:'textfield', fieldLabel:'单位', name:'money_plan__plan_unit', anchor:'100%', maxLength:10},
					{xtype:'numberfield', decimalPrecision:2, fieldLabel:'数量', name:'money_plan__plan_num', defaultval:'1', anchor:'100%', maxLength:12},
					{xtype:'numberfield', decimalPrecision:6, fieldLabel:'单价(万元)', name:'money_plan__plan_price', defaultval:'0', anchor:'100%', maxLength:12},
					{xtype:'textfield', fieldLabel:'申报部门', name:'money_plan__dept_name', defaultval:'fun_getDeptName()', readOnly:true, anchor:'100%', maxLength:50},
					{xtype:'datefield', fieldLabel:'申报日期', name:'money_plan__plan_date', defaultval:'fun_getToday()', format:'Y-m-d', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', anchor:'100%'},
					{xtype:'textfield', fieldLabel:'计划编号', name:'money_plan__plan_code', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'hidden', fieldLabel:'需报国家局', name:'money_plan__up_comp', defaultval:'0', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'申报人ID', name:'money_plan__plan_userid', defaultval:'fun_getUserId()', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'申报部门ID', name:'money_plan__dept_id', defaultval:'fun_getDeptId()', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'combo', fieldLabel:'记录状态', name:'money_plan__auditing', defaultval:'0',
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
					{xtype:'textfield', fieldLabel:'预计实施时间', name:'money_plan__plan_period', anchor:'100%', maxLength:20},
					{xtype:'textfield', fieldLabel:'型号规格', name:'money_plan__device_size', anchor:'100%', maxLength:50},
					{xtype:'textfield', fieldLabel:'拟选供应商', name:'money_plan__provider', anchor:'100%', maxLength:50},
					{xtype:'textfield', fieldLabel:'出厂日期', name:'money_plan__create_date', anchor:'100%', maxLength:50},
					{xtype:'textfield', fieldLabel:'固定资产编号', name:'money_plan__asset_code', anchor:'100%', maxLength:20},
					{xtype:'textfield', fieldLabel:'生产厂家', name:'money_plan__create_factory', anchor:'100%', maxLength:50},
					{xtype:'combo', fieldLabel:'预算年度', name:'money_plan__plan_year',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: planyearData
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: planyearData[0][0]},
					{xtype:'combo', fieldLabel:'计划状态', name:'money_plan__plan_status', defaultval:'11',
						anchor:'100%', readOnly:true, editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: planstatusData
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: planstatusData[0][0]},
					{xtype:'textfield', fieldLabel:'申报人', name:'money_plan__plan_user', defaultval:'fun_getUserName()', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'hidden', fieldLabel:'计划类型', name:'money_plan__plan_type', defaultval:'yd', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'主键', name:'money_plan__plan_id', anchor:'100%'}
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
					{xtype:'textarea', fieldLabel:'主要内容与申请理由', name:'money_plan__plan_desc', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', width:'100%', height:48, maxLength:500},
					{xtype:'textarea', fieldLabel:'必要性、可行性、经济效益分析', name:'money_plan__project_cause', width:'100%', height:48, maxLength:500},
					{xtype:'textarea', fieldLabel:'备注', name:'money_plan__plan_memo', width:'100%', height:48, maxLength:200}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'money_plan'
	};

	config.initpage = function(formNode){
		var event = formNode.event;
		
		//扩展新增前事件，缺省是年度计划，申报年度为下一年
		event.on('beforecreate', function(event) {
			var form = event.form;
			var fdtype = form.findField('money_plan__plan_type');
			if (fdtype.getValue() == 'jx') { 
				form.set('money_plan__plan_year', JxUtil.getCurYear());
			} else {
				form.set('money_plan__plan_year', JxUtil.getCurYear(1));
			}
			return true;
		});
		
		//扩展保存前事件，如果投资金额为0，则不能保存
		event.on('beforesave', function(event, data) {
			var form = event.form;
			var fdmoney = form.findField('money_plan__plan_money');
			var plan_money = fdmoney.getValue();
			
			if (plan_money.length == 0 || parseFloat(plan_money) == 0) {
				JxHint.alert('投资金额不能为0！');
				fdmoney.focus(true);
				return false;
			}
			
			var year = JxUtil.getCurYear();
			var plan_year = form.get('money_plan__plan_year');
			if (year > parseInt(plan_year)) {
				JxHint.alert('申请年度不能小于当前年度！');
				return false;
			}
			
			return true;
		});
		
		//如果计划类型为急需计划，则申报年度为当前年
		var form = formNode.page.getForm();
		var fdtype = form.findField('money_plan__plan_type');
		fdtype.on('change', function(field){
			if (fdtype.getValue() == 'jx') { 
				form.set('money_plan__plan_year', JxUtil.getCurYear());
			} else {
				form.set('money_plan__plan_year', JxUtil.getCurYear(1));
			}
		});
	};
	
	return new Jxstar.FormNode(config);
}
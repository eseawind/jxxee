Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var questatusData = Jxstar.findComboData('questatus');
	var questatus1Data = Jxstar.findComboData('questatus1');
	var quetypeData = Jxstar.findComboData('quetype');
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
			border:true,
			xtype:'fieldset',
			title:'问题上报',
			collapsible:false,
			collapsed:false,
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.495,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'textarea', fieldLabel:'问题描述', name:'sys_question__que_desc', readOnly:true, width:'100%', height:120, maxLength:200},
					{xtype:'hidden', fieldLabel:'报告部门ID', name:'sys_question__dept_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'报告人ID', name:'sys_question__report_userid', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'combo', fieldLabel:'处理状态', name:'sys_question__que_status', defaultval:'0',
						anchor:'100%', readOnly:true, editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: questatusData
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: questatusData[0][0]},
					{xtype:'textfield', fieldLabel:'问题单号', name:'sys_question__que_code', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'textfield', fieldLabel:'报告人', name:'sys_question__report_user', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'textfield', fieldLabel:'报告部门', name:'sys_question__dept_name', readOnly:true, anchor:'100%', maxLength:50},
					{xtype:'datefield', fieldLabel:'报告时间', name:'sys_question__report_date', format:'Y-m-d H:i', anchor:'100%', readOnly:true},
					{xtype:'hidden', fieldLabel:'处理人ID', name:'sys_question__done_userid', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'主键', name:'sys_question__que_id', anchor:'100%'}
				]
			}
			]
		},{
			anchor:'100%',
			border: false,
			layout:'column',
			border:true,
			xtype:'fieldset',
			title:'处理情况',
			collapsible:false,
			collapsed:false,
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.495,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'textarea', fieldLabel:'原因分析及处理结果', name:'sys_question__done_desc', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', width:'100%', height:120, maxLength:200}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'textfield', fieldLabel:'处理人', name:'sys_question__done_user', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'combo', fieldLabel:'处理结果', name:'sys_question__done_type',
						anchor:'100%', editable:false, allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*',
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: questatus1Data
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: questatus1Data[0][0]},
					{xtype:'combo', fieldLabel:'问题类型', name:'sys_question__que_type', defaultval:'1',
						anchor:'100%', editable:false, allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*',
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: quetypeData
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: quetypeData[0][0]},
					{xtype:'datefield', fieldLabel:'受理时间', name:'sys_question__start_date', format:'Y-m-d H:i', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', anchor:'100%'},
					{xtype:'datefield', fieldLabel:'关闭时间', name:'sys_question__done_date', format:'Y-m-d H:i', anchor:'100%'}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'que_done'
	};

	config.initpage = function(formNode){
		var event = formNode.event;
		
		//关闭问题时检查必填项
		event.on('beforecustom', function(event) {
			var form = event.form;
			if (!form.isValid()) {
				JxHint.alert(jx.event.datavalid);	//'请确保输入的数据正确完整！'
				return false;
			}
			var que_status = form.get('sys_question__que_status');
			if (que_status > '7') { 
				JxHint.alert('问题已经完成或已否决，不能提交！');
				return false;
			}
			
			var done_type = myform.get("sys_question__done_type");
			if (done_type == '2') {
				JxHint.alert('处理必须是已经完成或已否决，才能提交！');
				return false;
			}
			
			return true;
		});
		
		event.on('aftercustom', function(fe) {
			var page = fe.page;
			var tab = page.ownerCt.ownerCt;
			var tab1 = tab.getComponent(0);
			tab.activate(tab1);
			
			var grid = tab1.getComponent(0);
			grid.getStore().reload();
		});
	};
	
	config.eventcfg = {
		//初始化页面数据
		initOther : function() {
			var myform = this.form;

			var done_type = myform.get("sys_question__done_type");
			if (done_type == null || done_type.length == 0) {
				myform.set("sys_question__done_type", '2');
			}
			var start_date = myform.get("sys_question__start_date");
			if (start_date == null || start_date.length == 0) {
				myform.set("sys_question__start_date", JxDefault.getToday());
			}
			
			var username = myform.get("sys_question__done_user");
			if (username == null || username.length == 0) {
				myform.set("sys_question__done_user", JxDefault.getUserName());
				myform.set("sys_question__done_userid", JxDefault.getUserId());
			}
			
			var que_status = myform.get("sys_question__que_status");
			var readOnly = (que_status != '1');
			JxUtil.readOnlyForm(myform, readOnly);
			JxUtil.disableButton(this.page.getTopToolbar(), readOnly);
		}
	};
	
	return new Jxstar.FormNode(config);
}
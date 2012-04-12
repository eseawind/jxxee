Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var yesnoData = Jxstar.findComboData('yesno');
	var assruleData = Jxstar.findComboData('assrule');
	var yesnoData = Jxstar.findComboData('yesno');
	var limitruleData = Jxstar.findComboData('limitrule');
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
				columnWidth:0.99,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'textarea', fieldLabel:'任务描述', name:'wf_nodeattr__task_desc', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', width:'100%', height:72, maxLength:200}
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
				columnWidth:0.495,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'combo', fieldLabel:'可以否决', name:'wf_nodeattr__has_no', defaultval:'0',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: yesnoData
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: yesnoData[0][0]},
					{xtype:'textfield', fieldLabel:'任务时限', name:'wf_nodeattr__limit_value', defaultval:'00:00', anchor:'100%', maxLength:10},
					{xtype:'combo', fieldLabel:'任务分配规则', name:'wf_nodeattr__assign_rule', defaultval:'user',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: assruleData
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: assruleData[0][0]}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'combo', fieldLabel:'可以完成', name:'wf_nodeattr__has_complete', defaultval:'0',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: yesnoData
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: yesnoData[0][0]},
					{xtype:'combo', fieldLabel:'超时规则', name:'wf_nodeattr__limit_rule', defaultval:'0',
						anchor:'100%', editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: limitruleData
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: limitruleData[0][0]},
					{xtype:'numberfield', allowDecimals:false, fieldLabel:'多人审批，同意人数', name:'wf_nodeattr__agree_num', defaultval:'0', anchor:'100%', maxLength:12}
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
					{xtype:'textarea', fieldLabel:'分配规则自定义', name:'wf_nodeattr__custom_class', width:'100%', height:48, maxLength:300},
					{xtype:'textarea', fieldLabel:'可编辑字段', name:'wf_nodeattr__edit_field', width:'100%', height:48, maxLength:200}
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
				columnWidth:0.495,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'checkbox', fieldLabel:'使用部门印章', name:'wf_nodeattr__dept_sign', defaultval:'0', disabled:false, anchor:'100%'},
					{xtype:'hidden', fieldLabel:'是否发送邮件', name:'wf_nodeattr__send_email', defaultval:'0', anchor:'62%'},
					{xtype:'hidden', fieldLabel:'功能名称', name:'wf_nodeattr__fun_name', anchor:'62%'},
					{xtype:'hidden', fieldLabel:'过程ID', name:'wf_nodeattr__process_id', anchor:'62%'},
					{xtype:'hidden', fieldLabel:'节点ID', name:'wf_nodeattr__node_id', anchor:'62%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'checkbox', fieldLabel:'使用个人签名', name:'wf_nodeattr__user_sign', defaultval:'0', disabled:false, anchor:'100%'},
					{xtype:'hidden', fieldLabel:'邮件模板', name:'wf_nodeattr__templet_name', anchor:'62%'},
					{xtype:'hidden', fieldLabel:'功能ID', name:'wf_nodeattr__fun_id', anchor:'62%'},
					{xtype:'hidden', fieldLabel:'属性ID', name:'wf_nodeattr__nodeattr_id', anchor:'62%'},
					{xtype:'hidden', fieldLabel:'邮件模板ID', name:'wf_nodeattr__templet_id', anchor:'62%'}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'wf_nodeattr'
	};

	config.initpage = function(formNode){
		var event = formNode.event;
		
		event.on('beforesave', function(event) {
			var form = event.form;
			var assign_rule = form.get('wf_nodeattr__assign_rule');
			if (assign_rule == 'class') {
				var className = form.get('wf_nodeattr__custom_class');
				if (className.length == 0) {
					JxHint.alert('如果任务分配规则是自定义类，则自定义类名必须填写！');
					form.findField('wf_nodeattr__custom_class').focus();
					return false;
				}
			}
			
			var limit_value = form.get('wf_nodeattr__limit_value');
			if (limit_value != '00:00' && limit_value.length > 0) {
				var hhmi = /^([0-9]+):([0-9]|[0-5][0-9])$/;
		        if (hhmi.test(limit_value) == false) {
		        	JxHint.alert('任务时限格式不正确，格式为hh:mi，hh为任意数字，mi为小于59的数字！');
					form.findField('wf_nodeattr__limit_value').focus();
					return false;
		        }
			}
			
			return true;
		});
	};
	
	return new Jxstar.FormNode(config);
}
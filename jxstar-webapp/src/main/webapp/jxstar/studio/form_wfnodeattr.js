Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var yesnoData = Jxstar.findComboData('yesno');
	var yesnoData = Jxstar.findComboData('yesno');
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
					{xtype:'textfield', fieldLabel:'任务时限', name:'wf_nodeattr__limit_value', defaultval:'00:00', anchor:'100%', maxLength:10},
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
					{xtype:'hidden', fieldLabel:'是否发送邮件', name:'wf_nodeattr__send_email', defaultval:'0', anchor:'37%'},
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
					{xtype:'emptybox'},
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
					{xtype:'hidden', fieldLabel:'邮件模板', name:'wf_nodeattr__templet_name', anchor:'62%'},
					{xtype:'hidden', fieldLabel:'功能ID', name:'wf_nodeattr__fun_id', anchor:'62%'},
					{xtype:'hidden', fieldLabel:'属性ID', name:'wf_nodeattr__nodeattr_id', anchor:'62%'},
					{xtype:'hidden', fieldLabel:'邮件模板ID', name:'wf_nodeattr__templet_id', anchor:'62%'}
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
					{xtype:'checkbox', fieldLabel:'使用部门印章', name:'wf_nodeattr__dept_sign', defaultval:'0', disabled:false, anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'checkbox', fieldLabel:'使用个人签名', name:'wf_nodeattr__user_sign', defaultval:'0', disabled:false, anchor:'100%'}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'wf_nodeattr'
	};

	
	
	return new Jxstar.FormNode(config);
}
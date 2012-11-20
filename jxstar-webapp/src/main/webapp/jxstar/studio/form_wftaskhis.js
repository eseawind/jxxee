Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var checktypeData = Jxstar.findComboData('checktype');
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
			autoHeight:true,
			items:[{
				border:false,
				xtype:'container',
				columnWidth:0.495,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'textfield', fieldLabel:'处理人', name:'wf_assignhis__check_user', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'datefield', fieldLabel:'开始时间', name:'wf_taskhis__start_date', format:'Y-m-d H:i', anchor:'100%', readOnly:true},
					{xtype:'combo', fieldLabel:'处理类型', name:'wf_assignhis__check_type',
						anchor:'100%', readOnly:true, editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: checktypeData
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: checktypeData[0][0]},
					{xtype:'hidden', fieldLabel:'发邮件?', name:'wf_taskhis__has_email', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'任务ID', name:'wf_taskhis__task_id', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'数据ID', name:'wf_taskhis__data_id', anchor:'100%'}
				]
			},{
				border:false,
				xtype:'container',
				columnWidth:0.495,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'datefield', fieldLabel:'处理时间', name:'wf_assignhis__check_date', format:'Y-m-d H:i', anchor:'100%', readOnly:true},
					{xtype:'datefield', fieldLabel:'受限时间', name:'wf_taskhis__limit_date', format:'Y-m-d H:i', anchor:'100%', readOnly:true},
					{xtype:'textfield', fieldLabel:'节点名称', name:'wf_taskhis__node_title', readOnly:true, anchor:'100%', maxLength:50},
					{xtype:'hidden', fieldLabel:'处理人ID', name:'wf_assignhis__check_userid', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'超时?', name:'wf_taskhis__is_timeout', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'功能ID', name:'wf_taskhis__fun_id', anchor:'100%'}
				]
			}
			]
		},{
			anchor:'100%',
			border:false,
			xtype:'container',
			layout:'column',
			autoHeight:true,
			items:[{
				border:false,
				xtype:'container',
				columnWidth:0.99,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'textarea', fieldLabel:'处理意见', name:'wf_assignhis__check_desc', readOnly:true, width:'100%', height:120, maxLength:500}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'wf_taskhis'
	};

	
	
	
	return new Jxstar.FormNode(config);
}
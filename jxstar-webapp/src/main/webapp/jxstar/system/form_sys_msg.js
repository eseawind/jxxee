﻿Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
		var items = [{
		width:'97%',
		border:false,
		layout:'form',
		autoHeight:true,
		style:'padding:5 10 5 10;',
		items:[{
			anchor:'100%',
			border:false,
			layout:'column',
			border:true,
			xtype:'fieldset',
			title:'消息内容',
			collapsible:false,
			collapsed:false,
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.99,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'textarea', fieldLabel:'消息内容', name:'sys_news__news_cont', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', width:'100%', height:360, maxLength:4000},
					{xtype:'hidden', fieldLabel:'发布时间', name:'sys_news__edit_date', defaultval:'fun_getToday()', anchor:'48%'},
					{xtype:'hidden', fieldLabel:'发布人', name:'sys_news__edit_user', defaultval:'fun_getUserName()', anchor:'48%'},
					{xtype:'hidden', fieldLabel:'发布人ID', name:'sys_news__edit_userid', defaultval:'fun_getUserId()', anchor:'48%'},
					{xtype:'hidden', fieldLabel:'主键', name:'sys_news__news_id', anchor:'48%'},
					{xtype:'hidden', fieldLabel:'状态', name:'sys_news__state', anchor:'48%'}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'sys_msg'
	};

	config.param.formWidth = '80%';
	config.param.labelWidth = 80;
	config.param.subConfig = { anchor:'80%'};
	JxFormSub.formAddSub(config);

	//修改控件类型
	
	return new Jxstar.FormNode(config);
}
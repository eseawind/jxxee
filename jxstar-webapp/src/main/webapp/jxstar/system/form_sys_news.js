Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var Dataaudit = Jxstar.findComboData('audit');
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
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.495,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'combo', fieldLabel:'状态', name:'sys_news__state',
						anchor:'100%', readOnly:true, editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: Dataaudit
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: Dataaudit[0][0]},
					{xtype:'textfield', fieldLabel:'发布人', name:'sys_news__edit_user', defaultval:'fun_getUserName()', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'datefield', fieldLabel:'发布时间', name:'sys_news__edit_date', defaultval:'fun_getToday()', format:'Y-m-d H:i', anchor:'100%', readOnly:true},
					{xtype:'hidden', fieldLabel:'主键', name:'sys_news__news_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'checkbox', fieldLabel:'置顶？', name:'sys_news__is_top', defaultval:'0', disabled:false, anchor:'100%'},
					{xtype:'checkbox', fieldLabel:'允许回复？', name:'sys_news__allow_reply', defaultval:'0', disabled:false, anchor:'100%'},
					{xtype:'textfield', fieldLabel:'编号', name:'sys_news__news_code', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'hidden', fieldLabel:'发布人ID', name:'sys_news__edit_userid', defaultval:'fun_getUserId()', anchor:'100%'}
				]
			}
			]
		},{
			anchor:'100%',
			border:false,
			layout:'column',
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.99,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'textfield', fieldLabel:'新闻公告标题', name:'sys_news__news_title', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', anchor:'100%', maxLength:100},
					{xtype:'textarea', fieldLabel:'新闻公告标内容', name:'sys_news__news_cont', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', width:'100%', height:360, maxLength:4000}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'sys_news'
	};

	
	//修改控件类型	var findcfg = function(items) {		for (var i = items.length-1; i >= 0; i--) {			if (items[i].name == 'sys_news__news_cont') {				return items[i];			} else {				if (items[i].items && items[i].items.length > 0) {					return findcfg(items[i].items);				}			}		}		return null;	};	var heitem = findcfg(items);	if (heitem) {		delete heitem.width;		heitem.xtype = 'imghtmleditor';		heitem.anchor = '100%';		heitem.maxLength = 20000;	}		config.initpage = function(fnode) {			//注册保存后事件		fnode.event.on('beforesave', function(fe, data, eventcode){			var news_cont = fe.form.get('sys_news__news_cont');			//alert(news_cont);			return true;		});	};		config.eventcfg = {		};
	
	return new Jxstar.FormNode(config);
}
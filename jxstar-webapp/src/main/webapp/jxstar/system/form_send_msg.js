Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
	var msgtypeData = Jxstar.findComboData('msgtype');
	var msgstateData = Jxstar.findComboData('msgstate');
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
					{xtype:'trigger', fieldLabel:'收件人', name:'plet_msg__to_user',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:20, allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', editable:false,
						onTriggerClick: function() {
							var selcfg = {pageType:'combogrid', nodeId:'sys_user', layoutPage:'/public/layout/layout_tree.js', sourceField:'sys_user.user_name;user_id', targetField:'plet_msg.to_user;to_userid', whereSql:"", whereValue:'', whereType:'', isSame:'0', isShowData:'1', isMoreSelect:'0',isReadonly:'1',fieldName:'plet_msg.to_user'};
							JxSelect.createSelectWin(selcfg, this, 'node_send_msg_form');
						}},
					{xtype:'textfield', fieldLabel:'发件人', name:'plet_msg__from_user', defaultval:'fun_getUserName()', readOnly:true, anchor:'100%', maxLength:20},
					{xtype:'combo', fieldLabel:'消息类型', name:'plet_msg__msg_type', defaultval:'man',
						anchor:'100%', readOnly:true, editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: msgtypeData
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: msgtypeData[0][0]},
					{xtype:'hidden', fieldLabel:'发件人ID', name:'plet_msg__from_userid', defaultval:'fun_getUserId()', anchor:'62%'},
					{xtype:'hidden', fieldLabel:'消息ID', name:'plet_msg__msg_id', anchor:'62%'}
				]
			},{
				border:false,
				columnWidth:0.495,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'datefield', fieldLabel:'发送时间', name:'plet_msg__send_date', defaultval:'fun_getToday()', format:'Y-m-d H:i', anchor:'100%', readOnly:true},
					{xtype:'datefield', fieldLabel:'阅读时间', name:'plet_msg__read_date', format:'Y-m-d H:i', anchor:'100%', readOnly:true},
					{xtype:'combo', fieldLabel:'消息状态', name:'plet_msg__msg_state', defaultval:'0',
						anchor:'100%', readOnly:true, editable:false,
						store: new Ext.data.SimpleStore({
							fields:['value','text'],
							data: msgstateData
						}),
						emptyText: jx.star.select,
						mode: 'local',
						triggerAction: 'all',
						valueField: 'value',
						displayField: 'text',
						value: msgstateData[0][0]},
					{xtype:'hidden', fieldLabel:'收件人ID', name:'plet_msg__to_userid', anchor:'62%'}
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
					{xtype:'textarea', fieldLabel:'消息内容', name:'plet_msg__content', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', width:'100%', height:120, maxLength:500}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'send_msg'
	};

	config.eventcfg = {				send: function() {			var keyid = this.getPkField().getValue();						var self = this;			var hdcall = function() {				//回调函数				var endcall = function(data) {					var win = self.page.ownerCt;					if (win.getXType() == 'window') {						win.close();					}				};							//设置请求的参数				var params = 'funid='+ self.define.nodeid +'&keyid=' + keyid;				params += JxUtil.getFormValues(self.form);				params += '&pagetype=form&eventcode=send';				//发送请求				Request.postRequest(params, endcall);			};			//'确定发送消息吗？'			Ext.Msg.confirm(jx.base.hint, jx.sys.sendyes, function(btn) {				if (btn == "yes") hdcall();			});		}			};
	
	return new Jxstar.FormNode(config);
}
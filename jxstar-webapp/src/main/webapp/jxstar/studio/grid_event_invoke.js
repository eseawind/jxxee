Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var eventextData = Jxstar.findComboData('eventext');

	var cols = [
	{col:{header:'*类路径与名', width:284, sortable:true, editable:true, hcss:'color:#0000ff;',
		editor:new Ext.form.TextField({
			maxLength:200, allowBlank:false
		})}, field:{name:'fun_event_invoke__module_name',type:'string'}},
	{col:{header:'*方法名', width:100, sortable:true, editable:true, hcss:'color:#0000ff;',
		editor:new Ext.form.TextField({
			maxLength:20, allowBlank:false
		})}, field:{name:'fun_event_invoke__method_name',type:'string'}},
	{col:{header:'序号', width:50, sortable:true, defaultval:'1', align:'right',
		editable:true, hcss:'color:#3039b4;',
		editor:new Ext.form.NumberField({
			maxLength:12
		}),renderer:JxUtil.formatInt()}, field:{name:'fun_event_invoke__invoke_index',type:'int'}},
	{col:{header:'类说明', width:100, sortable:true, hidden:true}, field:{name:'fun_event_invoke__invoke_memo',type:'string'}},
	{col:{header:'系统事件代码', width:79, sortable:true, editable:true, hcss:'color:#3039b4;',
		editor:new Ext.form.TextField({
			maxLength:20
		})}, field:{name:'fun_event_invoke__event_code',type:'string'}},
	{col:{header:'扩展位置', width:79, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#3039b4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: eventextData
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: eventextData[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < eventextData.length; i++) {
				if (eventextData[i][0] == value)
					return eventextData[i][1];
			}
		}}, field:{name:'fun_event_invoke__position',type:'string'}},
	{col:{header:'调用ID', width:100, sortable:true, hidden:true}, field:{name:'fun_event_invoke__invoke_id',type:'string'}},
	{col:{header:'事件ID', width:100, sortable:true, hidden:true}, field:{name:'fun_event_invoke__event_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '0',
		funid: 'event_invoke'
	};
	
	
		
	return new Jxstar.GridNode(config);
}
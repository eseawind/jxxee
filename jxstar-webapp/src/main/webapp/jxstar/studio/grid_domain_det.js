Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var right_typeData = Jxstar.findComboData('right_type');
	var btnshowData = Jxstar.findComboData('btnshow');

	var cols = [
	{col:{header:'代码', width:100, sortable:true}, field:{name:'fun_event__event_code',type:'string'}},
	{col:{header:'名称', width:100, sortable:true}, field:{name:'fun_event__event_name',type:'string'}},
	{col:{header:'前台方法', width:100, sortable:true}, field:{name:'fun_event__client_method',type:'string'}},
	{col:{header:'页面类型', width:110, sortable:true}, field:{name:'fun_event__page_type',type:'string'}},
	{col:{header:'权限类型', width:62, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: right_typeData
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: right_typeData[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < right_typeData.length; i++) {
				if (right_typeData[i][0] == value)
					return right_typeData[i][1];
			}
		}}, field:{name:'fun_event__right_type',type:'string'}},
	{col:{header:'显示类型', width:58, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: btnshowData
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: btnshowData[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < btnshowData.length; i++) {
				if (btnshowData[i][0] == value)
					return btnshowData[i][1];
			}
		}}, field:{name:'fun_event__show_type',type:'string'}},
	{col:{header:'序号', width:58, sortable:true, renderer:JxUtil.formatInt()}, field:{name:'fun_event__event_index',type:'int'}},
	{col:{header:'隐藏？', width:47, sortable:true}, field:{name:'fun_event__is_hide',type:'string'}},
	{col:{header:'快捷键', width:60, sortable:true}, field:{name:'fun_event__access_key',type:'string'}},
	{col:{header:'域事件ID', width:100, sortable:true, hidden:true}, field:{name:'funall_domain_event__domain_eid',type:'string'}},
	{col:{header:'事件ID', width:100, sortable:true, hidden:true}, field:{name:'funall_domain_event__event_id',type:'string'}},
	{col:{header:'域ID', width:100, sortable:true, hidden:true}, field:{name:'funall_domain_event__domain_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'event_domain_det'
	};
	
	config.eventcfg = {
		dataImportParam: function() {			var records = Ext.getCmp('node_event_domain_editgrid').getSelectionModel().getSelections();			if (!JxUtil.selected(records)) return;			var domainId = records[0].get('funall_domain__domain_id');			var options = {				whereSql: 'event_id not in (select event_id from funall_domain_event where domain_id = ?)',				whereValue: domainId,				whereType: 'string'			};			return options;		}
	};
		
	return new Jxstar.GridNode(config);
}
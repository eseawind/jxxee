Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var Dataright_type = Jxstar.findComboData('right_type');
	var Databtnshow = Jxstar.findComboData('btnshow');
	var Datayesno = Jxstar.findComboData('yesno');

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
				data: Dataright_type
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Dataright_type[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Dataright_type.length; i++) {
				if (Dataright_type[i][0] == value)
					return Dataright_type[i][1];
			}
		}}, field:{name:'fun_event__right_type',type:'string'}},
	{col:{header:'显示类型', width:58, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Databtnshow
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Databtnshow[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Databtnshow.length; i++) {
				if (Databtnshow[i][0] == value)
					return Databtnshow[i][1];
			}
		}}, field:{name:'fun_event__show_type',type:'string'}},
	{col:{header:'序号', width:58, sortable:true, align:'right',renderer:JxUtil.formatInt()}, field:{name:'fun_event__event_index',type:'int'}},
	{col:{header:'隐藏？', width:47, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: Datayesno
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: Datayesno[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < Datayesno.length; i++) {
				if (Datayesno[i][0] == value)
					return Datayesno[i][1];
			}
		}}, field:{name:'fun_event__is_hide',type:'string'}},
	{col:{header:'快捷键', width:60, sortable:true}, field:{name:'fun_event__access_key',type:'string'}},
	{col:{header:'域事件ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'funall_domain_event__domain_eid',type:'string'}},
	{col:{header:'事件ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'funall_domain_event__event_id',type:'string'}},
	{col:{header:'域ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'funall_domain_event__domain_id',type:'string'}}
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
		dataImportParam: function() {			var fkValue = this.grid.fkValue;			if (!fkValue) {				JxHint.alert(jx.util.selectno);				return;			}			var options = {				whereSql: 'event_id not in (select event_id from funall_domain_event where domain_id = ?)',				whereValue: fkValue,				whereType: 'string'			};			return options;		}
	};
		
	return new Jxstar.GridNode(config);
}
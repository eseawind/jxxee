Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var condtypeData = Jxstar.findComboData('condtype');
	var rownoData = Jxstar.findComboData('rowno');
	var andorData = Jxstar.findComboData('andor');

	var cols = [
	{col:{header:'字段标题', width:162, sortable:true}, field:{name:'sys_query_det__colname',type:'string'}},
	{col:{header:'字段名', width:131, sortable:true, hidden:true}, field:{name:'sys_query_det__colcode',type:'string'}},
	{col:{header:'条件', width:68, sortable:true, defaultval:'like', align:'center',
		editable:true, hcss:'color:#3039b4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: condtypeData
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: condtypeData[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < condtypeData.length; i++) {
				if (condtypeData[i][0] == value)
					return condtypeData[i][1];
			}
		}}, field:{name:'sys_query_det__condtype',type:'string'}},
	{col:{header:'序号', width:51, sortable:true, align:'right',
		editable:true, hcss:'color:#3039b4;',
		editor:new Ext.form.NumberField({
			maxLength:12
		}),renderer:JxUtil.formatInt()}, field:{name:'sys_query_det__col_no',type:'int'}},
	{col:{header:'行号', width:56, sortable:true, defaultval:'1', align:'center',
		editable:true, hcss:'color:#3039b4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: rownoData
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: rownoData[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < rownoData.length; i++) {
				if (rownoData[i][0] == value)
					return rownoData[i][1];
			}
		}}, field:{name:'sys_query_det__row_no',type:'string'}},
	{col:{header:'左括号', width:59, sortable:true, editable:true, hcss:'color:#3039b4;',
		editor:new Ext.form.TextField({
			maxLength:20
		})}, field:{name:'sys_query_det__left_brack',type:'string'}},
	{col:{header:'右括号', width:54, sortable:true, editable:true, hcss:'color:#3039b4;',
		editor:new Ext.form.TextField({
			maxLength:20
		})}, field:{name:'sys_query_det__right_brack',type:'string'}},
	{col:{header:'并且或者', width:62, sortable:true, defaultval:'and', align:'center',
		editable:true, hcss:'color:#3039b4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: andorData
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: andorData[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < andorData.length; i++) {
				if (andorData[i][0] == value)
					return andorData[i][1];
			}
		}}, field:{name:'sys_query_det__andor',type:'string'}},
	{col:{header:'数据类型', width:100, sortable:true, hidden:true}, field:{name:'sys_query_det__coltype',type:'string'}},
	{col:{header:'查询ID', width:100, sortable:true, hidden:true}, field:{name:'sys_query_det__query_id',type:'string'}},
	{col:{header:'明细ID', width:100, sortable:true, hidden:true}, field:{name:'sys_query_det__query_detid',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '0',
		funid: 'sys_qrydet'
	};
	
	config.param.hidePageTool = true;	config.eventcfg = {				dataImportParam: function() {			var grid = this.grid;			var options = {				whereSql: 'fun_col.fun_id = ?',				whereValue: grid.qryFunId,				whereType: 'string'			};			return options;		}	};
		
	return new Jxstar.GridNode(config);
}
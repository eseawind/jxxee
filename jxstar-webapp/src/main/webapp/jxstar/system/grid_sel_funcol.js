Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var datatypeData = Jxstar.findComboData('datatype');

	var cols = [
	{col:{header:'字段代码', width:112, sortable:true}, field:{name:'fun_col__col_code',type:'string'}},
	{col:{header:'字段名称', width:134, sortable:true}, field:{name:'fun_col__col_name',type:'string'}},
	{col:{header:'数据类型', width:100, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: datatypeData
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: datatypeData[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < datatypeData.length; i++) {
				if (datatypeData[i][0] == value)
					return datatypeData[i][1];
			}
		}}, field:{name:'fun_col__data_type',type:'string'}},
	{col:{header:'字段ID', width:100, sortable:true, hidden:true}, field:{name:'fun_col__col_id',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, hidden:true}, field:{name:'fun_col__fun_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'sel_fun_col'
	};
	
	
		
	return new Jxstar.GridNode(config);
}
Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'字段代码', width:157, sortable:true}, field:{name:'v_field_info__col_code',type:'string'}},
	{col:{header:'字段名称', width:128, sortable:true}, field:{name:'v_field_info__col_name',type:'string'}},
	{col:{header:'字段序号', width:69, sortable:true, hidden:true, renderer:JxUtil.formatInt()}, field:{name:'v_field_info__col_index',type:'int'}},
	{col:{header:'数据类型', width:90, sortable:true, hidden:true}, field:{name:'v_field_info__data_type',type:'string'}},
	{col:{header:'控件类型', width:86, sortable:true, hidden:true}, field:{name:'v_field_info__col_control',type:'string'}},
	{col:{header:'数据样式', width:86, sortable:true, hidden:true}, field:{name:'v_field_info__format_id',type:'string'}},
	{col:{header:'表名', width:100, sortable:true, hidden:true}, field:{name:'v_field_info__table_name',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '0',
		isshow: '0',
		funid: 'sel_field'
	};
	
	//添加自定义查询按钮	config.toolext = function(node, tbar, extItems){		//查询表信息		var query = function(value) {			var wheresql = '(col_code like ? or col_name like ?)';			var wheretype = 'string;string';			var wherevalue = '%'+ value +'%;%'+ value +'%';			Jxstar.loadData(node.page, {where_sql:wheresql, where_value:wherevalue, where_type:wheretype, is_query:1});		};			var field = new Ext.form.TextField({width:150});		field.on('specialkey', function(field, e){			if (e.getKey() == e.ENTER) {				query(field.getValue());			}		});				tbar.insert(1, field);		tbar.insert(2, {			iconCls:'eb_qry', 			tooltip:jx.dm.qryf,	//'查询字段名'			handler:function(){				query(field.getValue());			}		});		tbar.insert(3, '-');	};
		
	return new Jxstar.GridNode(config);
}
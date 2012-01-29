Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'功能ID', width:123, sortable:true}, field:{name:'plet_fun__fun_id',type:'string'}},
	{col:{header:'功能名称', width:178, sortable:true}, field:{name:'plet_fun__fun_name',type:'string'}},
	{col:{header:'序号', width:79, sortable:true, defaultval:'10', align:'right',
		editable:true, hcss:'color:#3039b4;',
		editor:new Ext.form.NumberField({
			maxLength:12
		}),renderer:JxUtil.formatInt()}, field:{name:'plet_fun__fun_no',type:'int'}},
	{col:{header:'栏目ID', width:100, sortable:true, hidden:true}, field:{name:'plet_fun__portlet_id',type:'string'}},
	{col:{header:'明细ID', width:100, sortable:true, hidden:true}, field:{name:'plet_fun__det_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '1',
		funid: 'plet_fun'
	};
	
	config.eventcfg = {		
		dataImportParam: function() {
			var portletId = this.grid.fkValue;			var options = {				whereSql: 'fun_id not in (select fun_id from plet_fun where portlet_id = ?)',				whereValue: portletId,				whereType: 'string'			};			return options;		}		
	};
		
	return new Jxstar.GridNode(config);
}
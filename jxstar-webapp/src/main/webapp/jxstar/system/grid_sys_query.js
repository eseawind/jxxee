Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'查询方案', width:108, sortable:true, editable:true, hcss:'color:#3039b4;',
		editor:new Ext.form.TextField({
			maxLength:50
		})}, field:{name:'sys_query__query_name',type:'string'}},
	{col:{header:'共享?', width:48, sortable:true, defaultval:'1', editable:true, hcss:'color:#3039b4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'sys_query__is_share',type:'string'}},
	{col:{header:'序号', width:48, sortable:true, defaultval:'10', align:'right',
		editable:true, hcss:'color:#3039b4;',
		editor:new Ext.form.NumberField({
			maxLength:12
		}),renderer:JxUtil.formatInt()}, field:{name:'sys_query__query_no',type:'int'}},
	{col:{header:'创建人', width:75, sortable:true, defaultval:'fun_getUserName()', editable:false,
		editor:new Ext.form.TextField({
			maxLength:50
		})}, field:{name:'sys_query__user_name',type:'string'}},
	{col:{header:'查询ID', width:100, sortable:true, hidden:true}, field:{name:'sys_query__query_id',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, hidden:true}, field:{name:'sys_query__fun_id',type:'string'}},
	{col:{header:'创建人ID', width:100, sortable:true, hidden:true, defaultval:'fun_getUserId()'}, field:{name:'sys_query__user_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '0',
		funid: 'sys_query'
	};
	
	config.param.hidePageTool = true;	config.initpage = function(gridNode){ 	var event = gridNode.event;		event.on('beforecreate', function(ge) {		var myGrid = this.grid;		var rec = myGrid.store.getAt(0);		rec.set('sys_query__fun_id', myGrid.qryFunId);				return true;	});};
		
	return new Jxstar.GridNode(config);
}
Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'*属性编码', width:166, sortable:true, editable:true, hcss:'color:#0000ff;',
		editor:new Ext.form.TextField({
			maxLength:100, allowBlank:false
		})}, field:{name:'sys_var__var_code',type:'string'}},
	{col:{header:'*属性名称', width:281, sortable:true, editable:true, hcss:'color:#0000ff;',
		editor:new Ext.form.TextField({
			maxLength:100, allowBlank:false
		})}, field:{name:'sys_var__var_name',type:'string'}},
	{col:{header:'属性值', width:247, sortable:true, editable:true, hcss:'color:#3039b4;',
		editor:new Ext.form.TextField({
			maxLength:100
		})}, field:{name:'sys_var__var_value',type:'string'}},
	{col:{header:'属性描述', width:274, sortable:true, hidden:true}, field:{name:'sys_var__var_memo',type:'string'}},
	{col:{header:'属性ID', width:100, sortable:true, hidden:true}, field:{name:'sys_var__var_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'sys_var'
	};
	
	
		
	return new Jxstar.GridNode(config);
}
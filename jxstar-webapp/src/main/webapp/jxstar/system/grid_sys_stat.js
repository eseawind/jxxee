Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'*统计方案名称', width:138, sortable:true, editable:true, hcss:'color:#0000ff;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'sys_stat__stat_name',type:'string'}},
	{col:{header:'共享?', width:49, sortable:true, defaultval:'0', editable:true, hcss:'color:#3039b4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'sys_stat__is_share',type:'string'}},
	{col:{header:'创建人', width:79, sortable:true, editable:false,
		editor:new Ext.form.TextField({
			maxLength:50
		})}, field:{name:'sys_stat__user_name',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, hidden:true}, field:{name:'sys_stat__stat_id',type:'string'}},
	{col:{header:'创建人ID', width:100, sortable:true, hidden:true}, field:{name:'sys_stat__user_id',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, hidden:true}, field:{name:'sys_stat__fun_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '0',
		funid: 'sys_stat'
	};
	
	config.param.hidePageTool = true;
		
	return new Jxstar.GridNode(config);
}
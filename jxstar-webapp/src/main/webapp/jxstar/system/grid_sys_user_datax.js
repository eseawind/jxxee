Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'类别名称', width:124, sortable:true}, field:{name:'sys_datatype__dtype_name',type:'string'}},
	{col:{header:'权限字段', width:100, sortable:true}, field:{name:'sys_datatype__dtype_field',type:'string'}},
	{col:{header:'含下级?', width:57, sortable:true, defaultval:'0', editable:true, hcss:'color:#3039b4;',
		editor:new Ext.form.Checkbox(),
		renderer:function(value) {
			return value=='1' ? jx.base.yes : jx.base.no;
		}}, field:{name:'sys_user_datax__has_sub',type:'string'}},
	{col:{header:'数据值', width:107, sortable:true}, field:{name:'sys_user_datax__dtype_data',type:'string'}},
	{col:{header:'显示值', width:121, sortable:true}, field:{name:'sys_user_datax__display',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, hidden:true}, field:{name:'sys_datatype__funid',type:'string'}},
	{col:{header:'显示字段', width:100, sortable:true, hidden:true}, field:{name:'sys_datatype__fun_vfield',type:'string'}},
	{col:{header:'数据字段', width:100, sortable:true, hidden:true}, field:{name:'sys_datatype__fun_field',type:'string'}},
	{col:{header:'设置ID', width:100, sortable:true, hidden:true}, field:{name:'sys_user_datax__user_datax_id',type:'string'}},
	{col:{header:'数据权限ID', width:100, sortable:true, hidden:true}, field:{name:'sys_user_datax__dtype_id',type:'string'}},
	{col:{header:'指定功能ID', width:100, sortable:true, hidden:true}, field:{name:'sys_user_datax__user_funx_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '0',
		funid: 'sys_user_datax'
	};
	
	config.eventcfg = {				setType: function() {			var records = this.grid.getSelectionModel().getSelections();			if (!JxUtil.selectone(records)) return;						var selfunid = records[0].get('sys_datatype__funid');					var srcDefine = Jxstar.findNode(selfunid);			//显示数据			Jxstar.showData({				filename: srcDefine.layout,				title: srcDefine.nodetitle, 				pagetype: 'settype',				nodedefine: srcDefine,				callback: null			});		}			};
		
	return new Jxstar.GridNode(config);
}
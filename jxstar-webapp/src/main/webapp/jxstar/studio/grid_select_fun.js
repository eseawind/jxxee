Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var funreg_typeData = Jxstar.findComboData('funreg_type');

	var cols = [
	{col:{header:'功能名称', width:163, sortable:true}, field:{name:'fun_base__fun_name',type:'string'}},
	{col:{header:'功能ID', width:135, sortable:true}, field:{name:'fun_base__fun_id',type:'string'}},
	{col:{header:'注册类型', width:89, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: funreg_typeData
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: funreg_typeData[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < funreg_typeData.length; i++) {
				if (funreg_typeData[i][0] == value)
					return funreg_typeData[i][1];
			}
		}}, field:{name:'fun_base__reg_type',type:'string'}},
	{col:{header:'功能模块ID', width:100, sortable:true, hidden:true}, field:{name:'fun_base__module_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '0',
		funid: 'sel_fun'
	};
	
	
		
	return new Jxstar.GridNode(config);
}
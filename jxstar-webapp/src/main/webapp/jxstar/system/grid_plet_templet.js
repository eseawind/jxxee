Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var pletcolsData = Jxstar.findComboData('pletcols');

	var cols = [
	{col:{header:'模板序号', width:71, sortable:true, defaultval:'10', align:'right',
		editable:true, hcss:'color:#3039b4;',
		editor:new Ext.form.NumberField({
			maxLength:12
		}),renderer:JxUtil.formatInt()}, field:{name:'plet_templet__templet_no',type:'int'}},
	{col:{header:'*模板名称', width:130, sortable:true, editable:true, hcss:'color:#0000ff;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'plet_templet__templet_name',type:'string'}},
	{col:{header:'显示列数', width:100, sortable:true, defaultval:'2', align:'center',
		editable:true, hcss:'color:#3039b4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: pletcolsData
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: pletcolsData[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < pletcolsData.length; i++) {
				if (pletcolsData[i][0] == value)
					return pletcolsData[i][1];
			}
		}}, field:{name:'plet_templet__col_num',type:'string'}},
	{col:{header:'*列宽', width:144, sortable:true, editable:true, hcss:'color:#0000ff;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'plet_templet__col_width',type:'string'}},
	{col:{header:'模板ID', width:100, sortable:true, hidden:true}, field:{name:'plet_templet__templet_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '1',
		funid: 'plet_templet'
	};
	
	
		
	return new Jxstar.GridNode(config);
}
Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var attrtypeData = Jxstar.findComboData('attrtype');
	var yesnoData = Jxstar.findComboData('yesno');

	var cols = [
	{col:{header:'序号', width:47, sortable:true, align:'right',
		editable:true, hcss:'color:#3039b4;',
		editor:new Ext.form.NumberField({
			maxLength:12
		}),renderer:JxUtil.formatInt()}, field:{name:'fun_attr__attr_no',type:'int'}},
	{col:{header:'*标题', width:116, sortable:true, editable:true, hcss:'color:#0000ff;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'fun_attr__attr_title',type:'string'}},
	{col:{header:'*属性名', width:100, sortable:true, editable:true, hcss:'color:#0000ff;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'fun_attr__attr_name',type:'string'}},
	{col:{header:'属性值', width:133, sortable:true, editable:true, hcss:'color:#3039b4;',
		editor:new Ext.form.TextField({
			maxLength:200
		})}, field:{name:'fun_attr__attr_value',type:'string'}},
	{col:{header:'类型', width:64, sortable:true, defaultval:'grid', align:'center',
		editable:true, hcss:'color:#3039b4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: attrtypeData
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: attrtypeData[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < attrtypeData.length; i++) {
				if (attrtypeData[i][0] == value)
					return attrtypeData[i][1];
			}
		}}, field:{name:'fun_attr__attr_type',type:'string'}},
	{col:{header:'代码模板', width:246, sortable:true, editable:true, hcss:'color:#3039b4;',
		editor:new Ext.form.TextField({
			maxLength:500
		})}, field:{name:'fun_attr__attr_tpl',type:'string'}},
	{col:{header:'功能属性?', width:70, sortable:true, defaultval:'0', align:'center',
		editable:true, hcss:'color:#3039b4;',
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: yesnoData
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: yesnoData[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < yesnoData.length; i++) {
				if (yesnoData[i][0] == value)
					return yesnoData[i][1];
			}
		}}, field:{name:'fun_attr__is_fun',type:'string'}},
	{col:{header:'填写说明', width:228, sortable:true, editable:true, hcss:'color:#3039b4;',
		editor:new Ext.form.TextField({
			maxLength:200
		})}, field:{name:'fun_attr__attr_memo',type:'string'}},
	{col:{header:'属性ID', width:100, sortable:true, hidden:true}, field:{name:'fun_attr__attr_id',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, hidden:true, defaultval:'basestatic'}, field:{name:'fun_attr__fun_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'fun_attr'
	};
	
	
	
		
	return new Jxstar.GridNode(config);
}
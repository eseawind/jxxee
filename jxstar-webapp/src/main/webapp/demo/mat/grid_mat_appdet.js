﻿Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'*物资编码', width:100, sortable:true, editable:true, hcss:'color:#0000ff;',
		editor:new Ext.form.TriggerField({
			maxLength:100,
			editable:false, allowBlank:false,
			triggerClass:'x-form-search-trigger', 
			onTriggerClick: function() {
				var selcfg = {pageType:'combogrid', nodeId:'mat_base', layoutPage:'/public/layout/layout_tree.js', sourceField:'', targetField:'', whereSql:"", whereValue:'', whereType:'', isSame:'1', isShowData:'1', isMoreSelect:'0',isReadonly:'1',fieldName:'mat_base.mat_code'};
				JxSelect.createSelectWin(selcfg, this, 'node_mat_appdet_editgrid');
			}
		})}, field:{name:'mat_base__mat_code',type:'string'}},
	{col:{header:'物资名称', width:136, sortable:true}, field:{name:'mat_base__mat_name',type:'string'}},
	{col:{header:'型号规格', width:137, sortable:true}, field:{name:'mat_base__mat_size',type:'string'}},
	{col:{header:'计量单位', width:70, sortable:true}, field:{name:'mat_base__mat_unit',type:'string'}},
	{col:{header:'*申请数量', width:84, sortable:true, defaultval:'1', align:'right',
		editable:true, hcss:'color:#0000ff;',
		editor:new Ext.form.NumberField({
			decimalPrecision:2, maxLength:12, allowBlank:false
		}),renderer:JxUtil.formatNumber(2)}, field:{name:'mat_appdet__mat_num',type:'float'}},
	{col:{header:'类别名称', width:153, sortable:true}, field:{name:'mat_base__type_name',type:'string'}},
	{col:{header:'物资ID', width:100, sortable:true, hidden:true}, field:{name:'mat_appdet__mat_id',type:'string'}},
	{col:{header:'类别ID', width:100, sortable:true, hidden:true}, field:{name:'mat_base__type_id',type:'string'}},
	{col:{header:'明细ID', width:100, sortable:true, hidden:true}, field:{name:'mat_appdet__det_id',type:'string'}},
	{col:{header:'申请单ID', width:100, sortable:true, hidden:true}, field:{name:'mat_appdet__app_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '0',
		funid: 'mat_appdet'
	};
	
	
		
	return new Jxstar.GridNode(config);
}
Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var auditData = Jxstar.findComboData('audit');

	var cols = [
	{col:{header:'记录状态', width:73, sortable:true, align:'center',
		editable:false,
		editor:new Ext.form.ComboBox({
			store: new Ext.data.SimpleStore({
				fields:['value','text'],
				data: auditData
			}),
			emptyText: jx.star.select,
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			editable:false,
			value: auditData[0][0]
		}),
		renderer:function(value){
			for (var i = 0; i < auditData.length; i++) {
				if (auditData[i][0] == value)
					return auditData[i][1];
			}
		}}, field:{name:'mat_app__auditing',type:'string'}},
	{col:{header:'申请单号', width:100, sortable:true}, field:{name:'mat_app__app_code',type:'string'}},
	{col:{header:'申请日期', width:100, sortable:true, renderer:function(value) {
			return value ? value.format('Y-m-d') : '';
		}}, field:{name:'mat_app__app_date',type:'date'}},
	{col:{header:'项目名称', width:183, sortable:true}, field:{name:'mat_app__project_name',type:'string'}},
	{col:{header:'预算金额(万元)', width:100, sortable:true, renderer:JxUtil.formatNumber(6)}, field:{name:'mat_app__app_money',type:'float'}},
	{col:{header:'申请人', width:74, sortable:true}, field:{name:'mat_app__app_user',type:'string'}},
	{col:{header:'申请部门', width:100, sortable:true}, field:{name:'mat_app__dept_name',type:'string'}},
	{col:{header:'采购负责人', width:81, sortable:true}, field:{name:'mat_app__stock_user',type:'string'}},
	{col:{header:'申请理由', width:248, sortable:true}, field:{name:'mat_app__app_cause',type:'string'}},
	{col:{header:'申请人ID', width:100, sortable:true, hidden:true}, field:{name:'mat_app__app_userid',type:'string'}},
	{col:{header:'主键', width:100, sortable:true, hidden:true}, field:{name:'mat_app__app_id',type:'string'}},
	{col:{header:'申请部门ID', width:100, sortable:true, hidden:true}, field:{name:'mat_app__dept_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '0',
		isshow: '1',
		funid: 'mat_app'
	};
	
	config.initpage = function(nodeg){ 
		var grid = nodeg.page;
		//测试
		var datas = [[{colcode:'mat_app__app_code'},{colcode:'mat_app__project_name'}],
		             [{colcode:'mat_app__app_date'},{colcode:'mat_app__app_money'}]];

		//构建通用查询控件
		grid.on('afterrender', function(g){
			var hcfgs = JxToolCase.showQryTool(nodeg, datas);
			alert(Ext.encode(hcfgs));
			var topAlign = new Ext.Container({border:false, items:hcfgs});
			var tbar = g.getTopToolbar();
			var el = tbar.el.insertHtml('afterEnd', "<div class='tool-query'></div>");
			topAlign.render(el);
			g.doLayout();
		});
	}
		
	return new Jxstar.GridNode(config);
}
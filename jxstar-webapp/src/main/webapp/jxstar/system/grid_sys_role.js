Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'*角色名称', width:140, sortable:true, editable:true, hcss:'color:#0000ff;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'sys_role__role_name',type:'string'}},
	{col:{header:'角色描述', width:390, sortable:true, editable:true, hcss:'color:#3039b4;',
		editor:new Ext.form.TextField({
			maxLength:200
		})}, field:{name:'sys_role__role_memo',type:'string'}},
	{col:{header:'所属单位', width:141, sortable:true, defaultval:'fun_getOrgName()', editable:true, hcss:'color:#3039b4;',
		editor:new Ext.form.TriggerField({
			maxLength:50,
			editable:false,
			triggerClass:'x-form-search-trigger', 
			onTriggerClick: function() {
				if (this.menu == null) {
					var selcfg = {pageType:'combogrid', nodeId:'sys_dept1', layoutPage:'', sourceField:'sys_dept.dept_name;dept_id', targetField:'sys_role.dept_name;dept_id', whereSql:"dept_level = '1'", whereValue:'', whereType:'', isSame:'0', isShowData:'1', isMoreSelect:'0',isReadonly:'1',fieldName:'sys_role.dept_name'};
					this.menu = Jxstar.createComboMenu(this);
					JxSelect.createComboGrid(selcfg, this.menu, 'node_sys_role_editgrid');
				}
				this.menu.show(this.el);
			}
		})}, field:{name:'sys_role__dept_name',type:'string'}},
	{col:{header:'角色ID', width:100, sortable:true, hidden:true}, field:{name:'sys_role__role_id',type:'string'}},
	{col:{header:'模板名称', width:139, sortable:true, editable:true, hcss:'color:#3039b4;',
		editor:new Ext.form.TriggerField({
			maxLength:50,
			editable:false,
			triggerClass:'x-form-search-trigger', 
			onTriggerClick: function() {
				if (this.menu == null) {
					var selcfg = {pageType:'combogrid', nodeId:'plet_templet', layoutPage:'', sourceField:'plet_templet.templet_name;templet_id', targetField:'sys_role.templet_name;templet_id', whereSql:"", whereValue:'', whereType:'', isSame:'0', isShowData:'1', isMoreSelect:'0',isReadonly:'1',fieldName:'sys_role.templet_name'};
					this.menu = Jxstar.createComboMenu(this);
					JxSelect.createComboGrid(selcfg, this.menu, 'node_sys_role_editgrid');
				}
				this.menu.show(this.el);
			}
		})}, field:{name:'sys_role__templet_name',type:'string'}},
	{col:{header:'模板ID', width:100, sortable:true, hidden:true}, field:{name:'sys_role__templet_id',type:'string'}},
	{col:{header:'部门ID', width:100, sortable:true, hidden:true}, field:{name:'sys_role__dept_id',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '1',
		isedit: '1',
		isshow: '1',
		funid: 'sys_role'
	};
	
	
		
	return new Jxstar.GridNode(config);
}
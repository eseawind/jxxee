Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};
	
		var items = [{
		height: '97%',
		width: '97%',
		border: false,
		layout: 'form',
		style: 'padding:10px;',
		items: [{
			anchor:'100%',
			border: false,
			layout:'column',
			autoHeight:true,
			items:[{
				border:false,
				columnWidth:0.33,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'textfield', fieldLabel:'来源功能ID', name:'fun_rule_route__src_funid', allowBlank:false, labelStyle:'color:#0000FF;', labelSeparator:'*', anchor:'100%', maxLength:25},
					{xtype:'textfield', fieldLabel:'目标功能ID', name:'fun_rule_route__fun_id', readOnly:true, anchor:'100%', maxLength:25},
					{xtype:'hidden', fieldLabel:'参数类型', name:'fun_rule_route__where_type', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'页面参数名', name:'fun_rule_route__where_value', anchor:'100%'},
					{xtype:'hidden', fieldLabel:'路由ID', name:'fun_rule_route__route_id', anchor:'100%'}
				]
			},{
				border:false,
				columnWidth:0.66,
				layout:'form',
				style: 'padding-left:10px;',
				items:[
					{xtype:'textarea', fieldLabel:'来源功能Where', name:'fun_rule_route__where_sql', width:'100%', height:48, maxLength:200},
					{xtype:'trigger', fieldLabel:'导入布局', name:'fun_rule_route__layout_page',
						anchor:'100%', triggerClass:'x-form-search-trigger',
						maxLength:100, editable:true,
						onTriggerClick: function() {
							if (this.menu == null) {
								var selcfg = {pageType:'combogrid', nodeId:'fun_layout', layoutPage:'', sourceField:'funall_layout.layout_path', targetField:'fun_rule_route.layout_page', whereSql:"", whereValue:'', whereType:'', isSame:'0', isShowData:'1', isMoreSelect:'0',isReadonly:'0',fieldName:'fun_rule_route.layout_page'};
								this.menu = Jxstar.createComboMenu(this);
								JxSelect.createComboGrid(selcfg, this.menu, 'node_rule_route_form');
							}
							this.menu.show(this.el);
						}}
				]
			}
			]
		}]
	}];
	
	config.param = {
		items: items,
		funid: 'rule_route'
	};

	
	
	return new Jxstar.FormNode(config);
}
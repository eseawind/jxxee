config.param.hidePageTool = true;

config.initpage = function(gridNode){ 
	var grid = gridNode.page;
	var subtitle = gridNode.define.nodetitle;
	
	var pagetool = new Ext.PagingToolbar({
		style: 'padding:0;border-width:0;',
        store: grid.getStore(),
        pageSize: Jxstar.pageSize
	});
	
	var tools = grid.getTopToolbar();
	tools.add({iconCls: 'tab_sub'});
	tools.add({xtype:'tbtext', text:subtitle, style:'color:#15428b; font-size:12px;'}, '-');
	JxUtil.delay(1000, function(){
		tools.add('-', pagetool); 
		pagetool.inputItem.setHeight(18);
		tools.doLayout();
	});
}


Jxstar.currentPage = function(define) {
	var funId = define.nodeid;
	
	var ifrHtml = '<iframe frameborder="no" style="display:none;border-width:0;width:100%;height:100%;" ></iframe>';
	var layout = new Ext.Panel({
		title: define.nodetitle,
		autoScroll:true,
		layout:'fit',
		border:true,
		iconCls:'tab_grid',
		items:[{
			xtype:'container',
			html: ifrHtml
		}]
	});
	
	//要延时执行，避免布局对象还没创建
	JxUtil.delay(500, function(){
		var gridfile = define.gridpage;
		var href = Jxstar.path + gridfile + "?user_id=" + Jxstar.session['user_id'] + "&dataid=" + funId;

		var frm = layout.getEl().child('iframe');
		frm.dom.src = href + '&_dc=' + (new Date()).getTime();//避免缓存
		frm.show();
	});
	
	return layout;
};

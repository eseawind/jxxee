
config.initpage = function(gridNode){ 
	var event = gridNode.event;
	
	event.on('beforecreate', function(ge) {
		var myGrid = this.grid;
		//获取当前选择节点属性信息
		var attr = myGrid.treeNodeAttr;
		if( attr == null || !attr.leaf ) {
			JxHint.alert('必须选择最底层物资分类，才能新增物资编码！');	
			myGrid.store.removeAt(0);
			return false;
		}
		
		var node_id = attr.id;
		var node_text = attr.text;
		var node_code = attr.type_code;
		var rec = myGrid.store.getAt(0);
		rec.set('mat_base__type_code', attr.type_code);
		rec.set('mat_base__type_name', attr.text);
		rec.set('mat_base__type_id', attr.id);
		
		return true;
	});
	
	var topAlign = new Ext.Container({
			height:25,
	    	layout:'hbox',
            layoutConfig: {
                padding:'5',
                align:'top'
            },
            defaults:{margins:'0 5 0 0'},
            items:[{
                xtype:'button',
                text: 'Button 1'
            },{
                xtype:'button',
                text: 'Button 2'
            },{
                xtype:'button',
                text: 'Button 3'
            },{
                xtype:'button',
                text: 'Button 4'
            }]
	});
	var grid = gridNode.page;
	var el = grid.body.insertHtml('beforeBegin', '<div name=1></div>');
	topAlign.render(el);
}
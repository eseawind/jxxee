config.param.items[items.length] = {
		border: false,
		width: 800,
		style: 'padding:10px;',
		items:[{
			border:true,
			xtype:'fieldset',
			title:'申请物资明细',
			collapsible:true,
			collapsed:false,
			items:[
				{xtype:'panel', border:false, style: 'padding:0 8 0 8px;', layout:'fit', id:'fgp_mat_appdet', height:200}
			]
		}
		]
	};

	config.initpage = function(formNode){
		var fevent = formNode.event;
		
		//创建明细表对象
		var subPanel = Ext.getCmp('fgp_mat_appdet');
		var subParam = {pageType:'subgrid', parentNodeId:formNode.nodeId};
		Jxstar.createPage('mat_appdet', 'gridpage', subPanel, subParam);
		
		//每次改变form记录时重新加载明细表记录
		fevent.initOther = function() {
			if (formNode.pageType == 'form') {
				var define = formNode.define;
				var form = formNode.page.getForm();
				
				var pkcol = define.pkcol;
				var pkvalue = form.get(pkcol);
				var subgrid = subPanel.getComponent(0);
				
				if (pkvalue == null || pkvalue.length == 0) {
					subgrid.getStore().removeAll();
					subgrid.fkValue = '';
				} else {
					Jxstar.loadSubData(subgrid, pkvalue);
				}
				
				//如果主记录已提交，则明细表的按钮不能使用
				if (define.auditcol.length > 0) {
					var state = form.get(define.auditcol);
					if (state == null || state.length == 0) state = '0';
					var disable = (state != '0' && state != '6');
					var tools = subgrid.getTopToolbar();
					JxUtil.disableButton(tools, disable);
				}
			}
		};
		
		fevent.on('beforecreate', function(event) {
			event.initOther();
		});
	};
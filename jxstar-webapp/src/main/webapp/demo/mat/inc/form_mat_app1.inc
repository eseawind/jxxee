	var formAddSub = function(config) {
		var define = Jxstar.findNode(config.param.funid);
		var subfunid = define.subfunid;
		if (subfunid == null || subfunid.length == 0) return;
		
		var cfgitems = config.param.items;
		var subfunids = subfunid.split(',');
		for (var i = 0, n = subfunids.length; i < n; i++) {
			var subid = subfunids[i];
			if (subid.length == 0) continue;
			
			var subdefine = Jxstar.findNode(subid);
			var subtitle = subdefine.nodetitle;
			cfgitems[cfgitems.length] = {
				border: false,
				width: '100%',
				style: 'padding:10px;',
				items:[{xtype:'container', border:false, style:'padding:0 5 0 5px;', layout:'fit', cls:'form_subpanel', data:subid, height: 180}]
			};
		}
	};
	
	//显示明细表格，添加相关事件
	var formShowSub = function(formNode) {
		var fevent = formNode.event;
		var page = formNode.page;
		
		//取明细表的panel
		var subps = page.find('cls', 'form_subpanel');
		if (subps == null || subps.length == 0) return;
		
		//创建明细表对象
		for (var i = 0, n = subps.length; i < n; i++) {
			var subParam = {pageType:'subgrid', parentNodeId:formNode.nodeId};
			Jxstar.createPage(subps[i].data, 'gridpage', subps[i], subParam);
		}
		
		//每次改变form记录时重新加载明细表记录
		fevent.on('initother', function(event) {
			if (subps == null || subps.length == 0) return;
			
			var define = event.define;
			var form = event.form;
			
			var pkcol = define.pkcol;
			var pkvalue = form.get(pkcol);
			
			var showsub = function(){
				for (var i = 0, n = subps.length; i < n; i++) {
					var subgrid = subps[i].getComponent(0);
					if (subgrid.body && subgrid.body.hasClass('x-subgrid') == false) {
						subgrid.body.addClass('x-subgrid');
						var tbar = subgrid.getTopToolbar();
						if (tbar) tbar.addClass('x-subgrid');
					}
					if (pkvalue == null || pkvalue.length == 0) {
						subgrid.getStore().removeAll();
						subgrid.fkValue = '';
						subgrid.disable();
					} else {
						subgrid.enable();
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
			//在审批界面中，如果显示form界面太快，会报subgrid is null错误，这种情况采用延时处理
			var tmpg = subps[0].getComponent(0);
			if (tmpg) {
				showsub();
			} else {
				JxUtil.delay(500, showsub);
			}
		});
		
		fevent.on('beforecreate', function(event) {
			fevent.fireEvent('initother', fevent);
		});
		fevent.on('aftercreate', function(event) {
			fevent.fireEvent('initother', fevent);
		});
		fevent.on('afteraudit', function(event) {
			fevent.fireEvent('initother', fevent);
		});
	};
	
	formAddSub(config);

	config.initpage = function(formNode){
		formShowSub(formNode);
	};
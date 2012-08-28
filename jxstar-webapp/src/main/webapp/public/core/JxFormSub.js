/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
  
/**
 * 构建表单中的明细表
 * 
 * @author TonyTan
 * @version 1.0, 2012-04-16
 */
JxFormSub = {};
(function(){

	Ext.apply(JxFormSub, {
	
	//添加显示明细表的panel
	formAddSub: function(config) {
		var fm = config.param;
		var define = Jxstar.findNode(fm.funid);
		var subfunid = define.subfunid;
		if (subfunid == null || subfunid.length == 0) return;
		
		var cfgitems = fm.items;
		var subfunids = subfunid.split(',');
		for (var i = 0, n = subfunids.length; i < n; i++) {
			var subid = subfunids[i];
			if (subid.length == 0) continue;
			
			var subdefine = Jxstar.findNode(subid);
			var subtitle = subdefine.nodetitle;
			
			//标志此功能在form中显示
			//在GridNode.js中构建表格时不带边框，而且分页工具栏显示在顶部。
			subdefine.showInForm = true;
			
			var subcfg = {
				title:subtitle, baseCls:'xs-panel', iconCls:'sub_title', data:subid, 
				cls:'sub_panel', border:true, layout:'fit', collapsible:true, 
				collapsed:false, width:'100%', height:230
			};
			Ext.apply(subcfg, fm.subConfig);
			cfgitems[cfgitems.length] = subcfg;
		}
	},
	
	//显示明细表格，添加相关事件
	formShowSub: function(formNode) {
		var fevent = formNode.event;
		var page = formNode.page;
		var fm = formNode.param;
		
		//取明细表的panel
		var subps = page.find('cls', 'sub_panel');
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
					var subp = subps[i];
					var subgrid = subp.getComponent(0);
					if (pkvalue == null || pkvalue.length == 0) {
						subgrid.getStore().removeAll();
						subgrid.fkValue = '';
						subgrid.disable();
					} else {
						subgrid.enable();
						Jxstar.loadSubData(subgrid, pkvalue);
					}
					
					//可以调整明细表的大小
					if (fm.subResizable && subp.el && (subp.outRe == null)) {
						var re = new Ext.Resizable(subp.el, {
							minHeight: 180, minWidth: 600,
							listeners:{resize:function(r, w, h){
								r.innerCmp.setWidth(w);
								r.innerCmp.setHeight(h);
							}}
						});
						re.innerCmp = subp;
						subp.outRe = re;
						subp.on('destroy', function(sp){
							sp.outRe.destroy(true); sp.outRe = null; delete sp.outRe;
						});
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
	}
	
	});//Ext.apply

})();
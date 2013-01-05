/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 系统首页处理类，登录成功后动态加载。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

(function(){
	Ext.QuickTips.init();  
	//Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
	
	//菜单显示位置
	var menuPos = Jxstar.systemVar.index__menu__pos;
	var btnHtml = '', hintHtml = '';
	
	//欢迎提示信息
	var welcome = jx.base.welcome + ' ' + JxDefault.getUserName() +' ['+ JxDefault.getDeptName() +']';
	//处理工作代理
	var proxyuser = Jxstar.session['proxy_user_name'];
	if (proxyuser) {
		welcome += '('+ proxyuser +'-代理)';
	}
	
	//构建顶部的管理按钮
	var chgcolor = 'onmouseover="this.style.color=\'#ff9900\';" onmouseout="this.style.color=\'#ffffff\';" class="top-menu-text"';
	var shint = '<div class="top_south" id="main_hint">' + welcome +'</div>';
	if (menuPos && menuPos == 'top') {
		hintHtml = shint;
	} else {
		btnHtml = 
		'<table border="0" cellspacing="0" cellpadding="0" style="font-size:12px;float:right;">' + 
		'<tr><td>' + 
		shint +
		'</td></tr>' + 
		'<tr><td id="top_btn_td">' +
		'<span class="top-menu-img eb_pass"></span><a href="#" '+ chgcolor +' onclick="JxUtil.setPass(JxDefault.getUserId());">修改密码</a>' +
		'<span class="top-menu-img eb_online"></span><a href="#" '+ chgcolor +' onclick="JxUtil.onLineUser();">在线用户</a>' +
		'<span class="top-menu-img eb_logout"></span><a href="#" '+ chgcolor +' onclick="JxUtil.logout();">退出系统</a>' +
		'</td></tr>' +
		'</table>';
	}
	
	/*--------------------创建首页头部区域-----------------------*/
	var topHtml = 
		"<div class='top_bg'>" + 
			"<div class='top_north' id='main_menu'>"+ btnHtml +"</div>" + 
			hintHtml + 
		"</div>";

	var imgpath = './resources/images/top-app.png';
	var lw = 146, ilw = Jxstar.systemVar.index__logo__width;
	
	if (Jxstar.systemVar.indexType == '1') {//如果是项目
		imgpath = './resources/project/images/top-app.png';

		if (ilw && ilw.length > 0) {
			lw = ilw;
		} else {
			lw = 64;//项目LOGO缺省长度，产品LOGO缺省长度146
		}
	}
	
    var topPanel = new Ext.Panel({
		region:'north',
        layout:'border',
		height:50,
		border:true,
	    items:
		[{
			width: lw,
			region:'west',
			border:false,
	        id:'top_left_img',
	        html: "<div class='top_bg'><img onload='JxUtil.fixPNG(this);' id='main_page_img' src='"+ imgpath
				+"' style='cursor:pointer;' width='100%' height='100%'/></div>"
	    },{
	        region:'center',
			border:false,
			html:topHtml
	    }]
	});

	//创建首页功能显示区域
	var sysMainTab = new Ext.TabPanel({
		id:'sys_main_tab',
		region:'center',
		closeAction:'close',
		tabPosition:'bottom',
		margins:'2 5 5 0',
		border:false,
		minTabWidth:150,
		resizeTabs:true,
		activeTab:0,
		items:[{
			id:'fun_main_tab',
			title:jx.base.onepage, //首页
			autoScroll:true,
			layout:'fit',
			iconCls:'function'
		}]
	});
	//保存到全局对象中
	Jxstar.sysMainTab = sysMainTab;
	
	//关闭页签 
	sysMainTab.on('contextmenu',function (ts, item, e) {
		var nodemenu=new Ext.menu.Menu({
         items:[{	text:jx.base.closeall,//可以关闭除首页的所有标签页
					handler:function() {
						ts.items.each(function(obj){if(obj.closable&&obj!=ts.get(0)) {ts.remove(obj);}});
					}
                 },{text:jx.base.closeother,//可以关闭除首页，当前页的所有标签页
					handler:function(){
						ts.items.each(function(obj){if(obj.closable&&obj!=item&&obj!=ts.get(0)) {ts.remove(obj);}});
					}}]
         });
         nodemenu.showAt(e.getPoint());	
	});
	
	//构建菜单树
	if (menuPos && menuPos == 'top') {
		//创建首页页面布局
		var viewport = new Ext.Viewport({
			layout:'border',
			items:[topPanel, sysMainTab]
		});
		//方便在代理工作切换时销毁此对象
		Jxstar.viewport = viewport;
		
		//创建头部的菜单，main_menu是显示菜单的DIV标示
		JxMenu.createMainMenu('main_menu');
	} else {
		var dataUrl = Jxstar.path + '/commonAction.do?funid=queryevent&eventcode=query_menu&user_id='+Jxstar.session['user_id'];
		var treeMenu = new Ext.tree.TreePanel({
			id: 'tree_main_menu',
			region:'west',
			title:'功能菜单',
			iconCls:'main-menu-tree',
			bodyCssClass:'menu_bg',
			margins:'2 0 5 5',
			split:true,
			width:180,
			minSize:180,
			maxSize:300,
			animate:true,
			collapsible:true,
			
			tools:[{//添加刷新按钮可以重新加载功能菜单
				id:'refresh',
				handler: function(event, tool, tree){
					tree.getLoader().load(tree.getRootNode());
				}
			}],
			
			autoScroll:true,
			rootVisible: false,
			lines: false,
			useArrows: true,
			
			loader: new Ext.tree.TreeLoader({dataUrl: dataUrl, listeners:{
				load:function(loader, node, response){
					var menuJson = Ext.decode(response.responseText);
					JxUtil.putRightNodes(menuJson);
					//如果是根节点，则显示流程导航图标
					var hdCall = function(data) {
						if (data != null) data = data.root; 
						if (data == null || data.length == 0) return;
						for (var i = 0, n = data.length; i < n; i++) {
							var moduleId = data[i].wfnav_graph__module_id;
							if (moduleId.length == 0) continue;
							
							var oneNode = treeMenu.getRootNode().findChild('id', moduleId);
							if (Ext.isEmpty(oneNode)) continue;
							
							var graphId = data[i].wfnav_graph__graph_id;
							var graphTitle = data[i].wfnav_graph__graph_name;
							if (graphId.length == 0) continue;
							
							var anchor = oneNode.getUI().getAnchor();
							var cls = 'wfnav-icon';
							if (Ext.isChrome) cls += ' wfnav-icon-chrome';
							var chg = 'onmouseover="this.style.marginRight=\'3px\';" onmouseout="this.style.marginRight=\'4px\';"';
							var navIcon = Ext.get(anchor).insertHtml('afterEnd', 
								'<span '+ chg +' class="'+ cls +'" graphid="'+ graphId +'" graphtitle="'+ graphTitle +'"></span>', true);
							navIcon.on('click', function(e, t){
								e.stopEvent();
								JxWfGraph.showGraphFun(t.getAttribute('graphid'), null, false, t.getAttribute('graphtitle'));
							});
						}
					};
					var params = 'eventcode=query_data&funid=queryevent&pagetype=grid'+
						'&query_funid=wfnav_graph&where_sql=auditing=1';
					Request.dataRequest(params, hdCall);
				}
			}}),
			root: new Ext.tree.AsyncTreeNode({text:'main_menu_root'})
		});
		//打开功能
		treeMenu.on('click', function(node){
			if (node.isLeaf()) {
				Jxstar.createNode(node.id);	
			} else {
				if (node.isExpanded()) {
					node.collapse();
				} else {
					node.expand();
				}
			}
		});
		//给展开的菜单区域添加底部边框
		treeMenu.on('expandnode', function(node) {
			if (node.id.length == 4 && !node.isLast()) {
				var ct = Ext.get(node.getUI().ctNode);
				if (!ct.hasClass('x-tree-node-ct-ext')) {
					ct.addClass('x-tree-node-ct-ext');
				}
			}
		});

		//创建首页页面布局
		var viewport = new Ext.Viewport({
			layout:'border',
			items:[topPanel, treeMenu, sysMainTab]
		});
		//方便在代理工作切换时销毁此对象
		Jxstar.viewport = viewport;
	}

	//创建protel功能界面
	var funTab = sysMainTab.getComponent(0);
	JxPortal.createMainPortal(funTab);

	//设置首页按钮
	Ext.fly('main_page_img').on('click', function(){
		sysMainTab.activate(funTab);
		//重新加载首页
		funTab.removeAll(funTab.getComponent(0), true);
		JxPortal.createMainPortal(funTab);
	});

	//关闭右键事件
	Ext.getDoc().on('contextmenu', function(e){e.stopEvent();});
	//关闭F5刷新事件
	Ext.getDoc().on('keydown', function(e){
		if (e.getKey() == 116){
			e.stopEvent(); 
			if (Ext.isIE) {event.keyCode = 0;}//用于IE
			alert('本系统采用无刷新技术，可以点击软件中的刷新按钮查看最新数据！');
			return false;
		}
	});
	
	window.onbeforeunload = function(ev){
		if (JxUtil.isLogout) return;	//正常退出系统
		//通过刷新退出系统
		JxUtil.logout(true);
		if (Ext.isIE) return '执行浏览器刷新操作会退出系统！';
		return false;
	};

	sysMainTab.doLayout();
	
	//显示代理工作连接
	JxMenu.showProxy();
	
	//启动会话效验
	SessionTimer.SESSION_TIMEOUT = Jxstar.session.maxInterval;
	SessionTimer.resetTimer();
	SessionTimer.startTimer();
})();
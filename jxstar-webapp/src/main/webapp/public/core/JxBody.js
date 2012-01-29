/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the GNU GPL Version 3.0
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
	//加载功能定义数据
	JxUtil.loadJxData();
	
	//构建顶部的管理按钮
	var chgcolor = 'onmouseover="this.style.color=\'#ff9900\';" onmouseout="this.style.color=\'#ffffff\';" class="top-menu-text"';
	var btnHtml = 
		'<table border="0" cellspacing="0" cellpadding="0" style="font-size:12px;float:right;"><tr><td>' +
		'<span class="top-menu-img eb_pass"></span><a href="#" '+ chgcolor +' onclick="JxUtil.setPass(JxDefault.getUserId());">修改密码</a>' +
		'<span class="top-menu-img eb_online"></span><a href="#" '+ chgcolor +' onclick="JxUtil.onLineUser();">在线用户</a>' +
		'<span class="top-menu-img eb_logout"></span><a href="#" '+ chgcolor +' onclick="JxUtil.logout();">退出系统</a>' +
		'</td></tr></table>';
	
	/*--------------------创建首页头部区域-----------------------*/
	var topHtml = 
		"<div class='top_bg'>" + 
			"<div class='top_north' id='main_menu'>"+ btnHtml +"</div>" + 
			"<div class='top_south' id='main_hint'>" + jx.base.welcome + ' ' + JxDefault.getUserName() +" ["+ JxDefault.getDeptName() +"]</div>" + 
		"</div>";

    var topPanel = new Ext.Panel({
		region:'north',
        layout:'border',
		height:44,
		border:true,
	    items:
		[{
			width: 143,
			region:'west',
			border:false,
	        id:'top_left_img',
	        html: '<div class=\'top_bg\'><img onload=\'JxUtil.fixPNG(this);\' id=\'main_page_img\' src=\'./resources/images/top-app.png\' width=\'143\' height=\'44\'/></div>'
	    },{
	        region:'center',
			border:false,
			html:topHtml
	    }]
	});

	//创建首页功能显示区域
	var funMainTab = new Ext.TabPanel({
		id:'sys_main_tab',
		region:'center',
		closeAction:'close',
		tabPosition:'bottom',
		activeTab:0,
		items:[{
			id:'fun_main',
			title:jx.base.onepage, //首页
			autoScroll:true,
			layout:'fit',
			iconCls:'function'
		}]
	});
	
	//构建菜单树
	var dataUrl = Jxstar.path + '/commonAction.do?funid=queryevent&eventcode=query_menu&user_id='+Jxstar.session['user_id'];
	var treeMenu = new Ext.tree.TreePanel({
		id: 'tree_main_menu',
		region:'west',
		title:'功能菜单',
		iconCls:'main-menu-tree',
		split:true,
		width: 180,
		minSize: 100,
		maxSize: 300,
		animate: true,
		collapsible: true,
		
		tools:[{//添加刷新按钮可以重新加载功能菜单
			id:'refresh',
			handler: function(event, tool, tree){
				tree.getLoader().load(tree.getRootNode());
			}
		}],
		
		autoScroll:true,
		rootVisible: false,
		lines: false,
		useArrows: false,
		
		loader: new Ext.tree.TreeLoader({dataUrl: dataUrl}),
		root: new Ext.tree.AsyncTreeNode({text:'main_menu_root'})
	});
	//打开功能
	treeMenu.on('click', function(node){
		if (node.isLeaf()) {
			Jxstar.createNode(node.id);	
		}
	});

	//创建首页页面布局
    var viewport = new Ext.Viewport({
        layout:'border',
	    items:[topPanel, treeMenu, funMainTab]
	});

	//创建头部的菜单，main_menu是显示菜单的DIV标示
	//JxMenu.createMainMenu('main_menu');

	//创建protel功能界面
	var funTab = Ext.getCmp('fun_main');
	JxPortal.createMainPortal(funTab);

	//设置首页按钮
	Ext.fly('main_page_img').on('click', function(){
		funMainTab.activate(funTab);
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

	funMainTab.doLayout();
	
	//启动会话效验
	SessionTimer.SESSION_TIMEOUT = Jxstar.session.maxInterval;
	SessionTimer.resetTimer();
	SessionTimer.startTimer();
})();
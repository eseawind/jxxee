<%@ page contentType="text/html; charset=UTF-8"%>
<%@ page import="org.jxstar.util.config.SystemVar,
				 org.jxstar.security.LicenseVar,
				 java.util.Map,
				 org.jxstar.util.factory.FactoryUtil" %>
<%
	String contextpath = request.getContextPath();
	String curLangType = "zh";//java.util.Locale.getDefault().getLanguage();
	String supLangType = SystemVar.getValue("sys.lang.type");
	
	String svnNum = SystemVar.getValue("index.svn", "");
	String indexType = SystemVar.getValue("index.type", "0");
	String indexName = SystemVar.getValue("index.name", "JXstar软件开发平台");
	String indexBottom = SystemVar.getValue("index.bottom", "");
	
	String verNo = SystemVar.getValue("sys.version.no", "");
	String verType = LicenseVar.getValue(LicenseVar.VERSION_TYPE, "SE");
	String useCase = SystemVar.getValue("page.query.case", "0");
	boolean connValid = org.jxstar.dao.util.ConnValid.hasValid();
	
	if ((svnNum.length() == 0 && verNo.length() == 0) || !connValid) {
		response.sendRedirect(contextpath+"/error.jsp?errorCode=index.dbnostart");
	}
	
	String loginCss = "resources/css/login.css?verno=" + svnNum;
	if (indexType.equals("1")) loginCss = "resources/project/css/login.css?verno=" + svnNum;
	
	String uploadType = SystemVar.getValue("upload.server.type", "0");
	String uploadUrl = SystemVar.getValue("upload.server.url");
	
	String allVarJs = SystemVar.getVarJs();
	
	//下面是处理单点登录的相关代码
	Map<String,String> mpUser = FactoryUtil.newMap();
	mpUser.put("user_id", "jxstar94888");
	mpUser.put("user_name", "jxstar");
	mpUser.put("dept_id", "10010003");
	mpUser.put("role_id", "administrator");
	request.getSession().setAttribute("curruser", mpUser);
	//dept_code:'0103',dept_name:'公司研发部'
	
	String iscas = "0";
	//String json = PmLoginUtil.loginData(request);
	String json = "{user_id:'jxstar94888', user_name:'jxstar', dept_id:'10010003', role_id:'administrator'}";
	if (json.length() > 0) {
		iscas = "1";
	} else {
		response.sendRedirect(contextpath+"/index.jsp");
	}
	//打开页面后需要执行的脚本
	String cas_callback = request.getParameter("cas_callback");
%>
<html>
<head>
	<title id='product_name'><%=indexName%>-<%=verType%>-<%=verNo%></title>
	<link rel="stylesheet" type="text/css" href="<%=loginCss%>" />
</head>
<body scroll="no">
	<div id="loading" class="login_loading">
		<img src="resources/images/jxstar32.gif" width="32" height="32"
		style="margin-right:8px;float:left;vertical-align:bottom;"/>
		<span id="loading-msg">正在加载样式文件...</span>
	</div>
	<iframe id="frmhidden" name="frmhidden" style="display:none;"></iframe>
	<link rel="stylesheet" type="text/css" href="public/lib/ext/resources/css/ext-all.css?verno=<%=svnNum%>" />
	<link rel="stylesheet" type="text/css" href="resources/css/main.css?verno=<%=svnNum%>" />
	<link rel="stylesheet" type="text/css" href="public/comp-min/ext-ux-min.css?verno=<%=svnNum%>" />
	
	<script type="text/javascript">
		document.getElementById('loading-msg').innerHTML = '正在加载系统文件...';
	</script>

	<script type="text/javascript" src="public/lib/ext/adapter/ext-base.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/lib/ext/ext-all.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/comp-min/ext-ux-min.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/lib/ext/locale/ext-lang-<%=curLangType%>.js?verno=<%=svnNum%>"></script>
	
	<script type="text/javascript" src="public/locale/jxstar-lang-<%=curLangType%>.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/comp-min/jxstar-min.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript">Ext.fly('loading').hide();</script>
</body>
<script type="text/javascript">
var cas_callback = "<%=cas_callback%>";
Jxstar.iscas = '<%=iscas%>';//标识此请求是来自集成页面
Jxstar.casCallback = null;//打开此页面后需要执行的操作函数
if (cas_callback.length > 0) {
	Jxstar.casCallback = Ext.decode(cas_callback);
}

Jxstar.path = '<%=contextpath%>';
Jxstar.systemVar.indexType = '<%=indexType%>';
Jxstar.systemVar.verType = '<%=verType%>';
Jxstar.systemVar.useCase = '<%=useCase%>';
//支持集中附件管理模式
Jxstar.systemVar.uploadUrl = '<%=uploadUrl%>';
Jxstar.systemVar.uploadType = '<%=uploadType%>';
//把所有用于页面的系统变量附加到对象中
Ext.apply(Jxstar.systemVar, Ext.decode("<%=allVarJs%>"));

JxUtil.loadJS('custom.js', true);

Ext.BLANK_IMAGE_URL = Jxstar.path + '/public/lib/ext/resources/images/default/s.gif';
Ext.chart.Chart.CHART_URL = Jxstar.path + '/public/lib/ext/resources/charts.swf';

Ext.onReady(function() {
	//显示系统支持的语言版本
	JxLang.showLang('<%=curLangType%>', '<%=supLangType%>');
	
	//登陆成功
	var f_success = function(data) {
		Jxstar.session = data;
		Jxstar.session.maxInterval = <%=session.getMaxInactiveInterval()%>;
		Jxstar.session.sessionId = '<%=session.getId()%>';

		//加载功能定义数据
		JxUtil.loadJxData();
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
		
		//创建首页页面布局
		var viewport = new Ext.Viewport({
			layout:'border',
			items:[sysMainTab]
		});

		//创建protel功能界面
		var funTab = sysMainTab.getComponent(0);
		JxPortal.createMainPortal(funTab);

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

		sysMainTab.doLayout();
		
		//启动会话效验
		SessionTimer.SESSION_TIMEOUT = Jxstar.session.maxInterval;
		SessionTimer.resetTimer();
		SessionTimer.startTimer();
	};
	
	//集成直接登录
	if (Jxstar.iscas == '1') {
		var json = Ext.decode("<%=json%>");
		if (!Ext.isEmpty(json)) {
			f_success(json);
		}
	}
	
	//添加frmhidden的响应事件，用于处理文件下载的错误消息
	Ext.fly('frmhidden').on('load', function(event, dom){
		var doc = null;
		try {doc = dom.contentWindow.document;} catch(e) {}
		
		if (doc) {
			var text = doc.body.innerHTML;
			if (text == null || text.length == 0) {
				text = jx.index.downerror;
			}
			JxHint.alert(text);
		} else {
			JxHint.alert('执行完成！');
		}
	});
});
</script>
<script type="text/javascript">
function doKey(e){//用ExtJs的事件注册时无效
	var ev = e || window.event;
	var obj = ev.target || ev.srcElement;
	var t = obj.type || obj.getAttribute('type');//获取事件源类型
	if(ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea"){
		return false;
	}
}
//禁止后退键 作用于Firefox、Opera
document.onkeypress=doKey;
//禁止后退键  作用于IE、Chrome
document.onkeydown=doKey;
</script>
</html>

<%@ page contentType="text/html; charset=UTF-8"%>
<%@ page import="org.jxstar.util.config.SystemVar" %>
<%
	String contextpath = request.getContextPath();
	String curLangType = "zh";//java.util.Locale.getDefault().getLanguage();
	String supLangType = org.jxstar.util.config.SystemVar.getValue("sys.lang.type");
	
	String svnNum = SystemVar.getValue("index.svn", "40");
	String indexType = SystemVar.getValue("index.type", "1");
	String indexName = SystemVar.getValue("index.name", "JXstar软件开发平台");
	String indexBottom = SystemVar.getValue("index.bottom", "");
	
	String verNo = SystemVar.getValue("sys.version.no", "V1.0.0.0");
	String verType = SystemVar.getValue("sys.version.type", "");
	String useCase = SystemVar.getValue("page.query.case", "0");
	
	String loginCss = "resources/css/login.css?verno=" + svnNum;
	if (indexType.equals("1")) loginCss = "resources/project/css/login.css?verno=" + svnNum;
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
	<iframe id="frmhidden" style="display:none;"></iframe>
	<link rel="stylesheet" type="text/css" href="public/lib/ext/resources/css/ext-all.css?verno=<%=svnNum%>" />
	<link rel="stylesheet" type="text/css" href="resources/css/main.css?verno=<%=svnNum%>" />
	<link rel="stylesheet" type="text/css" href="public/lib/ext/ux/css/portal.css?verno=<%=svnNum%>" />
	<link rel="stylesheet" type="text/css" href="public/lib/ext/ux/css/RowEditor.css?verno=<%=svnNum%>" />
	<link rel="stylesheet" type="text/css" href="public/lib/ext/ux/css/fileuploadfield.css?verno=<%=svnNum%>" />
	<link rel="stylesheet" type="text/css" href="public/lib/ext/ux/css/data-view.css?verno=<%=svnNum%>" />
	
	<script type="text/javascript">
		document.getElementById('loading-msg').innerHTML = '正在加载系统文件...';
	</script>

	<script type="text/javascript" src="public/lib/ext/adapter/ext-base.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/lib/ext/ext-all.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/lib/ext/locale/ext-lang-<%=curLangType%>.js?verno=<%=svnNum%>"></script>
	
	<script type="text/javascript" src="public/lib/ext/ux/RowExpander.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/lib/ext/ux/Portal.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/lib/ext/ux/PortalColumn.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/lib/ext/ux/Portlet.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/lib/ext/ux/RowEditor.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/lib/ext/ux/Emptybox.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/lib/ext/ux/FileUploadField.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/lib/ext/ux/JxPagerTool.js?verno=<%=svnNum%>"></script>
	
	<script type="text/javascript" src="public/locale/jxstar-lang-<%=curLangType%>.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/core/JxLang.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/core/SessionTimer.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/core/GridNode.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/core/FormNode.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/core/JxUtil.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/core/JxAttach.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/core/JxDefault.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/core/JxLists.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/core/JxGroup.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/core/JxSum.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/core/JxQuery.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/core/JxExport.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/core/JxPrint.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/core/JxHint.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/core/JxSelect.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/core/JxFormSub.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/core/JxQueryExt.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/core/JxGroupExt.js?verno=<%=svnNum%>"></script>
	
	<script type="text/javascript" src="public/portlet/PortletFun.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/portlet/PortletMsg.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/portlet/PortletWarn.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/portlet/PortletBoard.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/portlet/PortletResult.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/portlet/PortletResultG.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/portlet/PortletAssign.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/core/JxMenu.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/core/JxPortal.js?verno=<%=svnNum%>"></script>

	<script type="text/javascript" src="public/core/Request.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/core/XmlRequest.js?verno=<%=svnNum%>"></script>

	<script type="text/javascript" src="public/core/GridEvent.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/core/FormEvent.js?verno=<%=svnNum%>"></script>

	<script type="text/javascript" src="public/core/JxExt.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/core/Jxstar.js?verno=<%=svnNum%>"></script>
	
	<script type="text/javascript" src="public/lib/graph/js/mxCanvas.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript">Ext.fly('loading').hide();</script>
	<div id="body_div"  class="body_div">
	<%if (indexType.equals("1")) {%>
	<div id="login_body" class="login_body"><a style="top:10px;left:10px;font-size:9pt;color:#fff;" href="#" onclick="down_firfox();">下载Firefox浏览器</a>
		<div class="login_div">
		<table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
		  <tr>
			<th>用户名：</th>
			<td><input type="text" style="width:150px;height:20px;" tabindex=1 name="user_code" id="user_code"></td>
		  </tr>
		  <tr>
			<th>密－码：</th>
			<td><input type="password" style="width:150px;height:20px;" tabindex=2 name="user_pass" id="user_pass" onfocus="this.select()"></td>
		  </tr>
		  <tr>
			<td></td>
			<td>
			<input type="button" class="iput_bnt" id="loginbtn" 
				onmouseover="this.className='iput_bnt_hover';" onmouseout="this.className='iput_bnt';" value="登录"/>
			<input type="button" class="iput_bnt" style="margin-left:8px;" id="returnbtn" 
				onmouseover="this.className='iput_bnt_hover';" onmouseout="this.className='iput_bnt';" value="取消"/></td>
		  </tr>
		</table>
		</div>
		<div class="cpr_div"><%=indexBottom%></div>
	</div>
	<%} else {%>
	<div id="login_body" class="login_body">
		<div class="logo_div"></div>
		<div class="login_div">
		<table border="0" cellspacing="0" cellpadding="0" align="center">
		  <tr>
			<th>账号：</th>
			<td><input type="text" class="login_input" tabindex=1 name="user_code" id="user_code"></td>
			<th>密码：</th>
			<td><input type="password" class="login_input" tabindex=2 name="user_pass" id="user_pass" onfocus="this.select()"></td>
			<td><input type="button" class="iput_bnt" id="loginbtn" value="登录" onmouseover="this.className='iput_bnt_hover';" onmouseout="this.className='iput_bnt';"/></td>
		  </tr>
		</table>
		</div>
		<div class="cpr_div">广州市东宏软件科技有限公司 版权所有&copy;2010&nbsp;
		<a href="http://www.jxstar.org" style="left:10px;color:#fff;">www.jxstar.org</a>
		<a style="left:10px;color:#fff;display:none;" href="#" onclick="down_firfox();">下载Firefox8浏览器</a>
		</div>
	</div>
	<%}%>
	</div>
</body>
<script language="javascript">
Jxstar.path = '<%=contextpath%>';
Jxstar.systemVar.indexType = '<%=indexType%>';
Jxstar.systemVar.verType = '<%=verType%>';
Jxstar.systemVar.useCase = '<%=useCase%>';

Ext.BLANK_IMAGE_URL = Jxstar.path + '/public/lib/ext/resources/images/default/s.gif';
Ext.chart.Chart.CHART_URL = Jxstar.path + '/public/lib/ext/resources/charts.swf';

down_firfox = function() {
	var params = 'funid=sys_attach&keyid=jxstar0001&pagetype=editgrid&eventcode=down&nousercheck=1';
	Request.fileDown(params);
};

Ext.onReady(function() {
	//显示系统支持的语言版本
	JxLang.showLang('<%=curLangType%>', '<%=supLangType%>');

	var usercodeEl = Ext.get('user_code');
	var userpassEl = Ext.get('user_pass');
	
	//取上次登录用户
	var CURRCODE = Ext.util.Cookies.get('cur_user_code');
	if (CURRCODE != null && CURRCODE.length > 0) {
		usercodeEl.dom.value = CURRCODE;
		userpassEl.focus();
	} else {
		usercodeEl.focus();
	}
	
	//回车登录
	var enter = function(e){
		if (e.getKey() == e.ENTER) {f_login();}
	};
	userpassEl.on('keypress', enter);
	usercodeEl.on('keypress', enter);
	
	//登陆成功
	var f_success = function(data) {
		userpassEl.remove();
		usercodeEl.remove();
		Ext.fly('login_body').remove();
		Ext.fly('body_div').remove();
		
		Jxstar.session = data;
		Jxstar.session.maxInterval = <%=session.getMaxInactiveInterval()%>;
		Jxstar.session.sessionId = '<%=session.getId()%>';
		Request.loadJS('/public/core/JxBody.js');
	};
	
	//登陆方法
	var f_login = function() {
		var usercode = usercodeEl.dom.value;
		if (usercode == "") {
			alert(jx.index.nocode);
			return false;
		}
		//保存一个月，只保留上次的登录用户名
		Ext.util.Cookies.set('cur_user_code', usercode, (new Date()).add(Date.MONTH, 1));
		var userpass = userpassEl.dom.value;
		userpassEl.dom.value = "";

		//设置请求的参数
		var params = 'funid=login&eventcode=login&pagetype=login';
		params += '&user_code='+usercode+'&user_pass='+userpass;

		//发送请求
		Ext.lib.Ajax.request(
			'POST', Jxstar.path + '/commonAction.do',
			{
				success: function(response) {
					var result = Ext.decode(response.responseText);
					if (result.success) {
						f_success(result.data);
					} else {
						JxHint.alert(result.message);
					}
				},
				failure: function(response) {
					JxUtil.errorResponse(response);
				}
			},
			params
		);
	};
	
	//登陆按钮
	Ext.fly('loginbtn').on('click', f_login);
	if (Jxstar.systemVar.indexType == '1') {
		Ext.fly('returnbtn').on('click', function(){
			usercodeEl.dom.value = "";
			userpassEl.dom.value = "";
			usercodeEl.focus();
		});
	}
	
	//添加frmhidden的响应事件，用于处理文件下载的错误消息
	Ext.fly('frmhidden').on('load', function(event, dom){
		var text = dom.contentWindow.document.body.innerHTML;
		if (text == null || text.length == 0) {
			text = jx.index.downerror;
		}
		JxHint.alert(text);
	});
});
</script>
</html>

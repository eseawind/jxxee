<%@ page contentType="text/html; charset=UTF-8"%>
<%@ page import="org.jxstar.util.config.SystemVar" %>
<%@ page import="org.jxstar.security.LicenseVar" %>
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
	<script type="text/javascript" src="public/lib/ext/ux/JxImageField.js?verno=<%=svnNum%>"></script>
	
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
	
	<script type="text/javascript" src="public/core/JxWfGraph.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/core/JxLabelPrint.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript" src="public/lib/graph/js/mxCanvas.js?verno=<%=svnNum%>"></script>
	<script type="text/javascript">Ext.fly('loading').hide();</script>


<%@ page contentType="text/html; charset=utf-8"%>
<%
	String contextpath = request.getContextPath();
	String user_id = request.getParameter("user_id");
	String dataid = request.getParameter("dataid");
%>
<html>
<script language="javascript">
	var CONTEXTPATH = "<%=contextpath%>";
	var USERID = "<%=user_id%>";
	var DATAID = "<%=dataid%>";
</script>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link rel="stylesheet" type="text/css" href="<%=contextpath%>/public/lib/ext/resources/css/ext-all.css" />
	
	<link rel="stylesheet" type="text/css" href="<%=contextpath%>/public/lib/ext/ux/css/Spinner.css" />
    <link rel="stylesheet" type="text/css" href="<%=contextpath%>/public/lib/ext/ux/css/LockingGridView.css" />
	
	<link rel="stylesheet" type="text/css" href="<%=contextpath%>/public/lib/ext-gantt/css/sch-gantt-all.css" />
    <link rel="stylesheet" type="text/css" href="<%=contextpath%>/public/lib/ext-gantt/css/examples.css" />
	<link href="advanced.css" rel="stylesheet" type="text/css" />
	
    <!--Ext lib and UX components-->
	<script type="text/javascript" src="<%=contextpath%>/public/lib/ext/adapter/ext-base.js"></script>
	<script type="text/javascript" src="<%=contextpath%>/public/lib/ext/ext-all.js"></script>
	<script type="text/javascript" src="<%=contextpath%>/public/lib/ext/locale/ext-lang-zh.js"></script>
	
	<!--Gantt components-->
	<script type="text/javascript" src="<%=contextpath%>/public/lib/ext/ux/LockingGridView.js"></script>
    <script type="text/javascript" src="<%=contextpath%>/public/lib/ext/ux/Spinner.js"></script>
    <script type="text/javascript" src="<%=contextpath%>/public/lib/ext/ux/SpinnerField.js"></script>

    <script type="text/javascript" src="<%=contextpath%>/public/lib/ext-gantt/js/sch-gantt-base-debug.js"></script>
    <script type="text/javascript" src="<%=contextpath%>/public/lib/ext-gantt/js/sch-gantt-all-debug.js"></script>

    <!--Application files-->
    <script src="jxgantt.js" type="text/javascript"></script>
    <script src="advanced.js" type="text/javascript"></script>

    <title>Jxstar Gantt</title>
</head>
<body>
</body>
</html>

<%@ include file="index_top.jsp"%>
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
<%@ include file="index_bottom.jsp"%>

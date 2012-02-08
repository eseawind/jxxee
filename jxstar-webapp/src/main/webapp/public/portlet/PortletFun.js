/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 常用功能portlet控件。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

PortletFun = {};
(function(){

	Ext.apply(PortletFun, {
	/**
	 * public
	 * 父对象
	 **/
	ownerCt:null,
	
	/**
	 * public
	 * 刷新窗口内容
	 **/
	refresh: function() {
		if (this.ownerCt) {
			this.showPortlet(this.ownerCt);
		}
	},
	
	/**
	 * public
	 * 显示常用功能列表
	 **/
	showPortlet: function(target) {
		var self = this;
		if (target == null) {
			JxHint.alert(jx.plet.noparent);	//'显示PORTLET的容器对象为空！'
			return;
		}
		self.ownerCt = target;
		//先清除内容
		target.removeAll(target.getComponent(0), true);
	
		var hdcall = function(funJson) {
			var funHtml = self.createPortlet(funJson);
			
			target.add({html:funHtml,border:false});
			target.doLayout();
		};
		
		var portletId = target.initialConfig.pletid;
		var params = 'funid=queryevent&eventcode=query_pletfun&portletid='+portletId;
		Request.dataRequest(params, hdcall);
	},
	
	/**
	 * private
	 * 创建常用功能列表
	 * funJson参数是数组对象，每个成员的格式：funid -- 功能ID，funname -- 功能名称
	 **/
	createPortlet: function(funJson) {
		if (funJson.length == 0) {
			return '<div class="nav_msg_notip">'+ jx.plet.nofun +'</div>';	//没有定义常用功能！
		}
	
		var tableTpl = new Ext.Template(
			'<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" class="nav_msg_table">',
				'{rows}',
			'</table>'
		);
		
		var rowTpl = new Ext.Template(
			'<tr height="20" style="background-color:{bgcolor};"><td>',
				'<li><a href="#" {chgcolor} onclick="Jxstar.createNode(\'{funid}\');">{funname}</a>',
			'</td><tr>'
		);
	
		var rows = [];
		//列表中只显示7条记录
		var len = funJson.length > 7 ? 7 : funJson.length;
		for (var i = 0; i < len; i++) {
			funJson[i].bgcolor = (i%2 == 1) ? '#ddffdd' : '';
			funJson[i].chgcolor = 'onmouseover="this.style.color=\'#FF4400\';" onmouseout="this.style.color=\'#0080FF\';"';
			
			rows[i] = rowTpl.apply(funJson[i]);
		}
		
		return tableTpl.apply({rows:rows.join('')});
	}
	
	});//Ext.apply

})();

/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 新闻公告栏portlet控件。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

PortletNews = {};
(function(){

	Ext.apply(PortletNews, {
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
	 * 显示新闻公告列表
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
		
		var hdcall = function(msgJson) {
			var msgHtml = '';
			if (msgJson.length == 0) {
				msgHtml = '<div class="nav_msg_notip">没有新闻公告！</div>';
			} else {
				msgHtml = self.createPortlet(msgJson);
			}
			var panelHtml = self.createHtml(msgHtml, msgJson.length);
			
			target.add({html:panelHtml,autoScroll:true});
			target.doLayout();
		};
		var params = 'funid=sys_news&eventcode=qrycont&pagetype=grid&premonth=1';
		Request.dataRequest(params, hdcall);
	},
	
	/**
	 * private
	 * 构建消息内容的HTML
	 **/
	createHtml: function(msgHtml) {
		var chgcolor = 'onmouseover="this.style.color=\'#FF4400\';" onmouseout="this.style.color=\'#444\';"';
		var btnHtml = 
		'<a href="#" '+ chgcolor +' style="padding-right:8px;color:#444" onclick="PortletNews.queryBoard();">'+ jx.plet.all +'</a>';	//所有...
		
		var toolHtml = 
		'<table width="100%" border="0" align="center" cellpadding="1" cellspacing="1" style="bottom:4px;" class="nav_msg_table">' +
            '<tr><td style="text-align:right;">'+ btnHtml +'</td></tr>' +
        '</table>';
		
		var panelHtml = 
		'<table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0">' +
			'<tr height="90%" style="vertical-align:top;"><td>'+ msgHtml +'</td></tr>' +
			'<tr height="10%" style="vertical-align:bottom;background-color:#deecfd;"><td>'+ toolHtml +'</td></tr>' + 
		'</table>';
		
		return panelHtml;
	},
	
	/**
	 * private
	 * 创建公告列表
	 * msgJson参数是数组对象: news_id -- 消息ID, news_title -- 消息标题
	 **/
	createPortlet: function(msgJson) {
		var tableTpl = new Ext.Template(
			'<table width="100%" border="0" align="center" cellpadding="1" cellspacing="1" class="nav_msg_table">',
				'{rows}',
			'</table>'
		);
		
		var rowTpl = new Ext.Template(
			'<tr height="20" style="background-color:{bgcolor};"><td>',
				'<li><a href="#" {chgcolor} onclick="PortletNews.readBoard(\'{msgid}\');">{msgtitle}</a>',
			'</td><tr>'
		);
	
		var rows = [];
		for (var i = 0; i < msgJson.length; i++) {
			var msgVal = {};
			msgVal.msgid = msgJson[i].news_id;
			var msgtitle = msgJson[i].news_title;
			msgVal.msgtitle = Ext.util.Format.ellipsis(msgtitle, 40);
			msgVal.bgcolor = (i%2 == 1) ? '#ddffdd' : '';
			msgVal.chgcolor = 'onmouseover="this.style.color=\'#FF4400\';" onmouseout="this.style.color=\'#0080FF\';"';
			
			rows[i] = rowTpl.apply(msgVal);
		}
		
		return tableTpl.apply({rows:rows.join('')});
	},
	
	/**
	 * public
	 * 阅读公告，弹出对话框，显示当前公告内容。
	 **/
	readBoard: function(msgid) {
		var self = this;
		
		//构建新闻内容html
		var createHtml = function(msgjson) {
			var msgTpl = new Ext.Template(
				'<div id="{news_id}">',
				'<p style="margin:8px;background-color:#f0f0f0;padding:5px;">',
					'<span>发布者：{edit_user}&nbsp;&nbsp;{edit_date}</span>',
				'</p>',
				'<p style="margin:8px;font-size:14px;font-weight:bold;">{news_title}</p>',
				'<div style="margin:8px;">{news_cont}</div>',
				'</div>'
			);
			
			var sd = '';
			var dt = msgjson.sys_news__edit_date;
			if (!Ext.isEmpty(dt)) {
				sd = dt.format('Y-m-d H:i');
			}
			
			var msgVal = {};
			msgVal.news_id = msgjson.sys_news__news_id;
			msgVal.edit_user = msgjson.sys_news__edit_user;
			msgVal.edit_date = sd;
			msgVal.news_cont = msgjson.sys_news__news_cont;
			msgVal.news_title = msgjson.sys_news__news_title;
			
			return msgTpl.apply(msgVal);
		};

		//显示新闻内容对话框
		var showWin = function(msgjson) {
			//创建工具栏
			var tbar = new Ext.Toolbar({deferHeight:true, items:[{iconCls:'eb_cancel', text:'关闭', handler:function(){win.close();}}]});
			//创建新闻显示内容
			var html = createHtml(msgjson);
			//创建先生新闻内容的panel
			var page = new Ext.Panel({tbar: tbar, html: html, autoScroll:true});
			
			//创建对话框
			var	win = new Ext.Window({
				title: '阅读新闻公告',
				layout: 'fit',
				width: 750,
				height: 500,
				constrainHeader: true,
				resizable: true,
				border: false,
				modal: true,
				closeAction: 'close',
				autoScroll: true,
				style: 'padding: 5px;',
				items: [page]
			});
			win.show();
		};

		var options = {
			where_sql: 'sys_news.news_id = ?',
			where_type: 'string',
			where_value: msgid,
			callback: function(data) {
				if (data.length == 0) {
					JxHint.alert(jx.plet.notboard);
				} else {
					showWin(data[0]);
				}
			}
		};
		Jxstar.queryData('sys_news', options);
	},
	
	/**
	 * public
	 * 显示所有已发布的公告。
	 **/
	queryBoard: function() {
		var userid = Jxstar.session['user_id'];
		//过滤条件
		var where_sql = 'f_isnews(news_id, ?) = ? and sys_news.state = ?';
		var where_type = 'string;string;string';
		var where_value = userid +';1;1';
			
		var hdcall = function(grid) {
			//显示数据
			JxUtil.delay(500, function(){
				Jxstar.loadData(grid, {where_sql:where_sql, where_value:where_value, where_type:where_type});
			});
		};
		
		Jxstar.showData({
			filename: '/jxstar/system/grid_sys_news.js',
			pagetype: 'readgrid',
			title: jx.plet.allboard,	//'所有公告'
			callback: hdcall
		});
	}
	
	});//Ext.apply

})();

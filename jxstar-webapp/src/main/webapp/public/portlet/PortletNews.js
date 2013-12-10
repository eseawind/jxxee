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
	readBoard: function(newsId) {
		var self = this;

		//显示新闻内容对话框
		var showWin = function(data) {
			//创建工具栏
			var tbar = new Ext.Toolbar({deferHeight:true, items:[
				{iconCls:'eb_return', text:'回复', handler:function(){self.replyBoard(newsId, win);}},
				{iconCls:'eb_refresh', text:'刷新', handler:function(){self.refreshCont(newsId, win);}}
			]});
			//创建新闻显示内容
			var html = self.contHtml(data.cont);
			var replys = data.reply;
			for (var i = 0, n = replys.length; i < n; i++) {
				html += self.replyHtml(i+1, replys[i]);
			}
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
			
			//添加删除事件
			self.addDelete(page);
		};
		
		//返回的数据格式为：{cont:{...}, reply:[...]}，第一部分为新闻，第二部分为回复
		var hdcall = function(data) {
			if (Ext.isEmpty(data)) {
				JxHint.alert(jx.plet.notboard);
			} else {
				showWin(data);
			}
		};
		var params = 'funid=sys_news_reply&eventcode=fqury&pagetype=form&newsId='+newsId;
		Request.dataRequest(params, hdcall);
	},
	
	//构建新闻内容html
	contHtml: function(msgjson) {
		var msgTpl = new Ext.Template(
			'<div flag="0" itemid="{news_id}">',
			'<p style="margin:8px;background-color:#f0f0f0;padding:5px;">',
				'<span>发布者：{edit_user}&nbsp;&nbsp;{edit_date}</span>',
			'</p>',
			'<p style="margin:8px;font-size:14px;font-weight:bold;">{news_title}</p>',
			'<div style="margin:8px;">{news_cont}</div>',
			'</div>'
		);
		
		return msgTpl.apply(msgjson);
	},
		
	//构建回复内容html
	replyHtml: function(index, msgjson) {
		var delhtml = '';
		if (JxUtil.isAdminUser()) {//管理员可以直接删除回复信息
			delhtml = '&nbsp;&nbsp;<a href="#" class="delete" itemid="{reply_id}" parentid="{news_id}">删除</a>';
		}
	
		var msgTpl = new Ext.Template(
			'<div flag="1" itemid="{reply_id}">',
			'<p style="margin:8px;background-color:#f0f0f0;padding:5px;">',
				'<span>楼{index}: {edit_user}&nbsp;&nbsp;{edit_date}'+ delhtml +'</span>',
			'</p>',
			'<div style="margin:8px;">{reply_cont}</div>',
			'</div>'
		);
		
		msgjson.index = index;
		return msgTpl.apply(msgjson);
	},
	
	//private 回复信息
	replyBoard: function(newsId, newsWin) {
		var self = this;
		var rand = Math.round(Math.random()*100);
		var reply_id = rand + (new Date()).getTime();
		//创建回复信息界面
		var page = new Ext.form.FormPanel({
				layout:'fit', 
				border: false,
				items: [
					{xtype:'imghtmleditor', name:'sys_news_reply__reply_cont', allowBlank:false, anchor:'100%', maxLength:20000},
					{xtype:'hidden', name:'sys_news_reply__reply_id', value:reply_id},
					]
			});
		//给系统定义信息，方便上传附件
		page.formNode = {define: Jxstar.findNode('sys_news_reply')};
		
		//创建对话框
		var	win = new Ext.Window({
			title: '回复新闻公告',
			layout: 'fit',
			width: 650,
			height: 400,
			modal: true,
			border: false,
			closeAction: 'close',
			style: 'padding: 5px;',
			items: [page],
			buttons: [{
				text:jx.base.ok,		//确定
				handler:function(){
					var html = page.getForm().get('sys_news_reply__reply_cont');
					html = encodeURIComponent(html);
					
					//设置请求的参数
					var params = 'funid=sys_news_reply&keyid='+reply_id+'&pagetype=form&eventcode=fsave';
					params += '&news_id='+newsId+'&reply_cont='+html;
					
					//保存后刷新记录
					var endcall = function(data) {
						self.refreshCont(newsId, newsWin);
						win.close();
					};

					//发送请求
					Request.postRequest(params, endcall);
				}
			},{
				text:jx.base.cancel,	//取消
				handler:function(){win.close();}
			}]
		});
		win.show();
	},
	
	//刷新新闻与回复信息
	refreshCont: function(newsId, newsWin) {
		var self = this;
		var hdcall = function(data) {
			if (Ext.isEmpty(data)) {
				JxHint.alert(jx.plet.notboard);
			} else {
				//先删除原来的内容
				var page = newsWin.getComponent(0);
				page.removeAll();
				
				
				//创建新闻显示内容
				var html = self.contHtml(data.cont);
				var replys = data.reply;
				for (var i = 0, n = replys.length; i < n; i++) {
					html += self.replyHtml(i+1, replys[i]);
				}
				
				//显示新内容
				page.update(html);
				//添加删除事件
				self.addDelete(page);
			}
		};
		var params = 'funid=sys_news_reply&eventcode=fqury&pagetype=form&newsId='+newsId;
		Request.dataRequest(params, hdcall);
	},
	
	//给回复消息添加删除事件，只有管理员才有权限
	addDelete: function(page) {
		if (!JxUtil.isAdminUser()) return;
		
		var self = this;
		//删除回复记录与相关附件
		var delReply = function(replyId, newsId) {
			//设置请求的参数
			var params = 'funid=sys_news_reply&replyId='+replyId+'&pagetype=form&eventcode=fdelete';
			
			//保存后刷新记录
			var endcall = function(data) {
				self.refreshCont(newsId, page.ownerCt);
			};

			//发送请求
			Request.postRequest(params, endcall);
		};
		
		var dela = page.body.select('a.delete');
		dela.on('click', function(e, t){
			var el = Ext.get(t);
			var itemid = el.getAttribute('itemid');
			var parentid = el.getAttribute('parentid');
			delReply(itemid, parentid);
		});
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

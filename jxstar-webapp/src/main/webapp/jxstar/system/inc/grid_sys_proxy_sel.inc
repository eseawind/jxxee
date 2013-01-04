config.eventcfg = {		
		selproxy: function() {
			var records = JxUtil.getSelectRows(this.grid);
			if (!JxUtil.selected(records)) return;
			
			var to_userid = records[0].get('sys_proxy__to_user_id');
			var proxy_userid = records[0].get('sys_proxy__user_id');
			JxMenu.loginProxy(to_userid, proxy_userid, '1');
		}
	};
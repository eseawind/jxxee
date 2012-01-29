Jxstar.currentPage = {
	nodeId: '',
	target: '',

	/**
	* 创建页面对象，用于直接从后台取到页面脚本生成页面
	* 
	* nodeId：功能ID
	* target：功能对象显示的窗口
	*/
	createDesign: function(nodeId, target) {
		if (nodeId == null || nodeId.length == 0) {
			JxHint.alert(jx.star.noid);//'打开的功能ID为空！'
			return;
		}
		//属性
		this.nodeId = nodeId;
		this.target = target;

		var self = this;
		//取创建页面的函数
		var hdCall = function(f) {
			var node = (eval(f))();
			//设置工具栏
			node.config.eventcfg = self.createEventCfg(nodeId);
			//设置表格为设计状态
			node.setState('1');
			//创建新的页面
			var page = node.showPage();
			if (page == null) return;
			page.id = nodeId + '_des_grid';

			//删除原来的对象
			var subpage = target.getComponent(0);
			if (subpage != null) {
				target.remove(subpage, true);
			}

			//显示一行数据，否则grid的横向滚动条不会显示
			var store = page.getStore();
			var record = new (store.reader.recordType)({});
			store.add(record);

			//把新页面添加到目标窗口中
			target.add(page);
			//重新显示目标窗口
			target.doLayout();
		};

		//异步从Servlet中取文件加载页面
		var params = 'funid=sys_fun_base&eventcode=query_griddes&projectpath=' + Jxstar.session['project_path'];
		params += '&selfunid='+ nodeId;
		Request.dataRequest(params, hdCall, {type:'xml', wait:true});
	},

	//取设计器的工具按钮
	createEventCfg: function(nodeId) {
		var gdes = this;
		//删除表格设计
		var deletegd = function() {
			var hdconf = function() {
				//设置请求的参数
				var params = 'funid=sys_fun_base&eventcode=deletegd';
				params += '&selfunid='+nodeId+'&selpagetype=grid';

				var hdcall = function() {
					gdes.createDesign(gdes.nodeId, gdes.target);
				};
				//发送请求
				Request.postRequest(params, hdcall);
			};
			//'确定删除设计信息，重新设计吗？'
			Ext.Msg.confirm(jx.base.hint, jx.fun.delyes, function(btn) {
				if (btn == "yes") hdconf();
			});
		};

		//保存表格设计
		var savegd = function() {
			//设置请求的参数
			var params = 'funid=sys_fun_base&eventcode=savegd';
			params += '&selfunid='+nodeId+'&selpagetype=grid';
			
			//构建设计内容，取表格的状态信息转换为字符串，格式：
			//{n:colname,w:width,h:true}-{}
			var state = this.grid.getState();//n: 
			var cm = this.grid.colModel;
			var cs = state.columns;
			var content = '';
			if(cs){
				for(var i = 0, len = cs.length; i < len; i++){
					

					var s = cs[i];
					var c = cm.getColumnById(s.id);
					if(c){
						if (c.dataIndex.length == 0) continue;
						content += '{'
						content += 'n:' + c.dataIndex + ',';
						content += 'w:' + s.width + ',';
						content += 'h:' + (s.hidden?'true':'false');
						content += '}-';
					}

					
				}
				if (cs.length > 0) {
					content = content.substring(0, content.length-1);
				}
			}
			params += '&content='+content;
			//发送请求
			Request.postRequest(params, null);
		};
		

		//生成表格文件
		var creategd = function() {
			//设置请求的参数
			var params = 'funid=sys_fun_base&eventcode=creategd';
			params += '&selfunid='+nodeId+'&selpagetype=grid&projectpath=' + Jxstar.session['project_path'];
			
			//发送请求
			Request.postRequest(params, null);
		};

		return {deletegd:deletegd, savegd:savegd, creategd:creategd};
	}
};
Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'*附件名称', width:148, sortable:true, editable:true, hcss:'color:#0000ff;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'sys_attach__attach_name',type:'string'}},
	{col:{header:'附件ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_attach__attach_id',type:'string'}},
	{col:{header:'表名', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_attach__table_name',type:'string'}},
	{col:{header:'功能名称', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_attach__fun_name',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_attach__fun_id',type:'string'}},
	{col:{header:'记录ID', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_attach__data_id',type:'string'}},
	{col:{header:'上传人', width:60, sortable:true}, field:{name:'sys_attach__upload_user',type:'string'}},
	{col:{header:'上传日期', width:111, sortable:true, align:'center',
		renderer:function(value) {
			return value ? value.format('Y-m-d H:i') : '';
		}}, field:{name:'sys_attach__upload_date',type:'date'}},
	{col:{header:'附件路径', width:340, sortable:true}, field:{name:'sys_attach__attach_path',type:'string'}},
	{col:{header:'文件类型', width:117, sortable:true, hidden:true}, field:{name:'sys_attach__content_type',type:'string'}},
	{col:{header:'相关字段', width:100, sortable:true, colindex:10000, hidden:true}, field:{name:'sys_attach__attach_field',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '0',
		funid: 'sys_attach'
	};
	
	
	config.eventcfg = {					delFile: function() {			var records = this.grid.getSelectionModel().getSelections();			if (!JxUtil.selected(records)) return;						var self = this;			var pkcol = self.define.pkcol;			var hdcall = function() {				//取选择记录的主键值				var keys = '';				for (var i = 0; i < records.length; i++) {					keys += '&keyid=' + records[i].get(pkcol);				}				//设置请求的参数				var params = 'funid=sys_attach'+ keys +'&pagetype=editgrid&eventcode=delete';				var endcall = function(data) {					//重新加载数据					self.grid.getStore().reload();				};				//发送请求				Request.postRequest(params, endcall);			};			//通过远程方法删除附件			var remoteCall = function() {				//取选择记录的主键值				var keys = '';				for (var i = 0; i < records.length; i++) {					keys += '&keyid=' + records[i].get(pkcol);				}				var url = Jxstar.systemVar.uploadUrl + '/fileAction.do?';				url += 'funid=sys_attach'+ keys +'&pagetype=editgrid&eventcode=delete&nousercheck=1';				Ext.fly('frmhidden').dom.src = url;				//延时执行回调函数，index.jsp中的frmhidden.load事件会提示执行完成！				JxUtil.delay(800, function(){					self.grid.getStore().reload();				});			};						//'确定删除选择的记录吗？'			Ext.Msg.confirm(jx.base.hint, jx.event.delyes, function(btn) {				if (btn == 'yes') {					if (Jxstar.systemVar.uploadType == '1') {						remoteCall();					} else {						hdcall();					}				}			});		}, 				downFile: function() {			var records = this.grid.getSelectionModel().getSelections();			if (!JxUtil.selectone(records)) return;						var keyid = records[0].get(this.define.pkcol);			var params = 'funid=sys_attach&keyid='+ keyid +'&pagetype=editgrid&eventcode=down';			//发送下载请求			if (Jxstar.systemVar.uploadType == '1') {				var url = Jxstar.systemVar.uploadUrl + '/fileAction.do?' + params + '&dataType=byte&nousercheck=1';				Ext.fly('frmhidden').dom.src = url;			} else {				Request.fileDown(params);			}		}	};		//业务记录复核后不能删除附件	config.initpage = function(gridNode){		var grid = gridNode.page;			//查询关联附件		var queryRelat = function(tbar) {			//取来源功能ID与数据ID			var dataId = grid.attachDataId;			var dataFunId = grid.attachFunId;			if (!dataId || dataId.length == 0) return;			if (!dataFunId || dataFunId.length == 0) return;						var hdCall = function(data) {				if (Ext.isEmpty(data)) return;								var mitems = [];				for (var i = 0; i < data.length; i++) {					var data_id = data[i].data_id;					var attach_id = data[i].attach_id;					var attach_name = data[i].attach_name;					var content_type = data[i].content_type;										//构建附件菜单					var cfg = {						id:attach_id,						text:attach_name, 						handler:function(){							var params = 'funid=sys_attach&keyid='+ this.id +'&pagetype=editgrid&eventcode=down';							//发送下载请求							if (JxAttach.uploadType == '1') {								var url = JxAttach.uploadUrl + '/fileAction.do?' + params + '&dataType=byte&nousercheck=1';								Ext.fly('frmhidden').dom.src = url;							} else {								Request.fileDown(params);							}						}					};					//添加附件菜单					mitems[mitems.length] = cfg;				}								var len = data.length;				//先删除原来的按钮				var oldbtn = tbar.find('mycode', 'relat_menu')[0];				if (oldbtn) {tbar.remove(oldbtn, true);}				//再添加新的按钮				var menu = new Ext.menu.Menu({items: mitems});				tbar.add({					mycode: 'relat_menu',					text: '相关附件['+ len +']',					iconCls: 'eb_menu',					menu: menu				});				tbar.doLayout();			};						//从后台查询任务信息			var params = 'funid=sys_attach&pagetype=editgrid&eventcode=query_relat';				params += '&dataFunId='+ dataFunId +'&dataId='+ dataId;			Request.dataRequest(params, hdCall);		};				JxUtil.delay(1500, function(){			var deled = grid.attachDeled;			var tbar = grid.getTopToolbar();			if (!deled) {				var btn = JxUtil.getButton(tbar, 'delete');				if (btn) btn.disable();			}						//处理关联附件查询			var relat = Jxstar.systemVar.sys__attach__relat;			if (relat == '1' && gridNode.state == '0') {				tbar.add('-');				tbar.add({					mycode: 'relat_menu',					text: '相关附件[0]',					iconCls: 'eb_menu',					disabled: true				});				tbar.doLayout();								queryRelat(tbar);			}		});	};
		
	return new Jxstar.GridNode(config);
}
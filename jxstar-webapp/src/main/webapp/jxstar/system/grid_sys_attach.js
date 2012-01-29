Jxstar.currentPage = function() {
	var config = {param:{},initpage:function(page, define){},eventcfg:{}};

	var cols = [
	{col:{header:'*附件名称', width:148, sortable:true, editable:true, hcss:'color:#0000ff;',
		editor:new Ext.form.TextField({
			maxLength:50, allowBlank:false
		})}, field:{name:'sys_attach__attach_name',type:'string'}},
	{col:{header:'附件ID', width:100, sortable:true, hidden:true}, field:{name:'sys_attach__attach_id',type:'string'}},
	{col:{header:'表名', width:100, sortable:true, hidden:true}, field:{name:'sys_attach__table_name',type:'string'}},
	{col:{header:'功能名称', width:100, sortable:true, hidden:true}, field:{name:'sys_attach__fun_name',type:'string'}},
	{col:{header:'功能ID', width:100, sortable:true, hidden:true}, field:{name:'sys_attach__fun_id',type:'string'}},
	{col:{header:'记录ID', width:100, sortable:true, hidden:true}, field:{name:'sys_attach__data_id',type:'string'}},
	{col:{header:'上传人', width:60, sortable:true}, field:{name:'sys_attach__upload_user',type:'string'}},
	{col:{header:'上传日期', width:111, sortable:true, renderer:function(value) {
			return value ? value.format('Y-m-d H:i') : '';
		}}, field:{name:'sys_attach__upload_date',type:'date'}},
	{col:{header:'附件路径', width:340, sortable:true}, field:{name:'sys_attach__attach_path',type:'string'}},
	{col:{header:'文件类型', width:117, sortable:true, hidden:true}, field:{name:'sys_attach__content_type',type:'string'}},
	{col:{header:'相关字段', width:100, sortable:true, hidden:true}, field:{name:'sys_attach__attach_field',type:'string'}}
	];
	
	config.param = {
		cols: cols,
		sorts: null,
		hasQuery: '0',
		isedit: '1',
		isshow: '0',
		funid: 'sys_attach'
	};
	
	config.eventcfg = {					delFile: function() {			var records = this.grid.getSelectionModel().getSelections();			if (!JxUtil.selected(records)) return;						var self = this;			var pkcol = self.define.pkcol;			var hdcall = function() {				//取选择记录的主键值				var keys = '';				for (var i = 0; i < records.length; i++) {					keys += '&keyid=' + records[i].get(pkcol);				}				//设置请求的参数				var params = 'funid=sys_attach'+ keys +'&pagetype=editgrid&eventcode=delete';				var endcall = function(data) {					//重新加载数据					self.grid.getStore().reload();				};				//发送请求				Request.postRequest(params, endcall);			};			//'确定删除选择的记录吗？'			Ext.Msg.confirm(jx.base.hint, jx.event.delyes, function(btn) {				if (btn == 'yes') hdcall();			});		}, 				downFile: function() {			var records = this.grid.getSelectionModel().getSelections();			if (!JxUtil.selectone(records)) return;						var keyid = records[0].get(this.define.pkcol);			var params = 'funid=sys_attach&keyid='+ keyid +'&pagetype=editgrid&eventcode=down';			//发送下载请求			Request.fileDown(params);		}	};		//业务记录复核后不能删除附件	config.initpage = function(gridNode){		JxUtil.delay(1500, function(){			var grid = gridNode.page;			if (grid.attachAudit != '0') {				var tbar = grid.getTopToolbar();				var btn = JxUtil.getButton(tbar, 'delete');				if (btn) btn.disable();			}		});	};
		
	return new Jxstar.GridNode(config);
}
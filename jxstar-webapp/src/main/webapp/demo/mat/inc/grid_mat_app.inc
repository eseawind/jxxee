	config.initpage = function(gridNode){
		var event = gridNode.event;
		
		event.on('beforeprint', function(e, data){
			var records = JxUtil.getSelectRows(this.grid);
			if (!JxUtil.selectone(records)) return false;
			
			//alert(data.reportId + ';' + data.printType + ';' + data.printScope + ';' + data.printMode);
			return true;
		});
	};
	
	config.eventcfg = {
		dataPrintParam: function(data) {
			var records = JxUtil.getSelectRows(this.grid);
			if (!JxUtil.selectone(records)) return '';
			
			var project_name = records[0].get('mat_app__project_name');
			var e = encodeURIComponent; //编码
			return '&reportName=' + e(project_name+'的项目文件');
		}
	};
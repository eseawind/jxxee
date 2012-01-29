	config.eventcfg = {		
		dataImportParam: function() {
			var portletId = this.grid.fkValue;			var options = {				whereSql: 'fun_id not in (select fun_id from plet_fun where portlet_id = ?)',				whereValue: portletId,				whereType: 'string'			};			return options;		}		
	};
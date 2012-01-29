	config.eventcfg = {		
		dataImportParam: function() {			var nodeattrId = this.grid.fkValue;						var options = {				whereSql: 'not exists (select * from wf_user where sys_user.user_id = wf_user.user_id and nodeattr_id = ?)',				whereValue: nodeattrId,				whereType: 'string'			};			return options;		}
	};
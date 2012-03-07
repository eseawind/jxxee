	config.eventcfg = {
		dataImportParam: function() {			var fkValue = this.grid.fkValue;			if (!fkValue) {				JxHint.alert(jx.util.selectno);				return;			}			var options = {				whereSql: 'event_id not in (select event_id from funall_domain_event where domain_id = ?)',				whereValue: fkValue,				whereType: 'string'			};			return options;		}
	};
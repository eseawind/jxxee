	config.initpage = function(formNode){
		var event = formNode.event;
		
		event.on('beforesave', function(event) {
			var form = event.form;
			var assign_rule = form.get('wf_nodeattr__assign_rule');
			if (assign_rule == 'class') {
				var className = form.get('wf_nodeattr__custom_class');
				if (className.length == 0) {
					JxHint.alert('如果任务分配规则是自定义类，则自定义类名必须填写！');
					form.findField('wf_nodeattr__custom_class').focus();
					return false;
				}
			}
			
			return true;
		});
	};
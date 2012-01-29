	config.initpage = function(formNode){
		var event = formNode.event;
		
		//扩展新增前事件，缺省是年度计划，申报年度为下一年
		event.on('beforecreate', function(event) {
			var form = event.form;
			var fdtype = form.findField('money_plan__plan_type');
			if (fdtype.getValue() == 'jx') { 
				form.set('money_plan__plan_year', JxUtil.getCurYear());
			} else {
				form.set('money_plan__plan_year', JxUtil.getCurYear(1));
			}
			return true;
		});
		
		//扩展保存前事件，如果投资金额为0，则不能保存
		event.on('beforesave', function(event, data) {
			var form = event.form;
			var fdmoney = form.findField('money_plan__plan_money');
			var plan_money = fdmoney.getValue();
			
			if (plan_money.length == 0 || parseFloat(plan_money) == 0) {
				JxHint.alert('投资金额不能为0！');
				fdmoney.focus(true);
				return false;
			}
			
			var year = JxUtil.getCurYear();
			var plan_year = form.get('money_plan__plan_year');
			if (year > parseInt(plan_year)) {
				JxHint.alert('申请年度不能小于当前年度！');
				return false;
			}
			
			return true;
		});
		
		//如果计划类型为急需计划，则申报年度为当前年
		var form = formNode.page.getForm();
		var fdtype = form.findField('money_plan__plan_type');
		fdtype.on('change', function(field){
			if (fdtype.getValue() == 'jx') { 
				form.set('money_plan__plan_year', JxUtil.getCurYear());
			} else {
				form.set('money_plan__plan_year', JxUtil.getCurYear(1));
			}
		});
	};
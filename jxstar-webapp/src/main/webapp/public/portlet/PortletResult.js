/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 图形结果集portlet控件。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

PortletResult = {};
(function(){

	Ext.apply(PortletResult, {
	/**
	 * public
	 * 父对象
	 **/
	ownerCt:null,
	
	/**
	 * public
	 * 刷新窗口内容
	 **/
	refresh: function() {
		if (this.ownerCt) {
			this.showPortlet(this.ownerCt);
		}
	},
	
	/**
	 * public
	 * 显示结果集图形
	 **/
	showPortlet: function(target) {
		var self = this;
		if (target == null) {
			JxHint.alert(jx.plet.noparent);	//'显示PORTLET的容器对象为空！'
			return;
		}
		this.ownerCt = target;
		//先清除内容
		target.removeAll(target.getComponent(0), true);
		
		//取结果集图形设置ID
		var chartId = target.initialConfig.objectid;

		//取图形结果集数据后的回调函数
		var hdCall = function(chartJson) {
			//图形类型
			var chartType = chartJson.charttype;
			//数据值
			var chartData = chartJson.chartdata;
			//数据集
			var chartStore = new Ext.data.SimpleStore({
							fields:['text','value'],
							data: chartData
						});
			
			//创建图表输出对象
			var chartPanel = JxGroup.createChartImage(chartStore, 'text', 'value', chartType);
			
			//显示图形对象
			target.add(chartPanel);
			target.doLayout();
		}
		
		//从后台取图形设置信息
		var params = 'funid=queryevent&eventcode=query_pletres&chart_id='+chartId;
		Request.dataRequest(params, hdCall);
	}
	
	});//Ext.apply

})();

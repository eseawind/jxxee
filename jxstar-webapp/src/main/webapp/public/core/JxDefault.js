﻿/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the GNU GPL Version 3.0
 */
 
/**
 * 缺省值函数对象。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

JxDefault = {};
(function(){

	Ext.apply(JxDefault, {
		/**
		* 取当前日期, 格式：yyyy-mm-dd
		*/
		getToday: function(){
			return new Date();
		},
		
		/**
		* 取当前月份，就是第一天的日期
		*/
		getCurMonth: function(inc){
			var d = new Date();
			if (inc != null) {
				d = d.add(Date.MONTH, inc);
			}
			
			var dt = d.format('Y-m');
			d = Date.parseDate(dt+'-01', 'Y-m-d');
			return d;
		},
		
		/**
		* 取当前登录人ID
		*/
		getUserId: function(){
			return Jxstar.session['user_id'];
		},
		
		/**
		* 取当前登录人编码
		*/
		getUserCode: function(){
			return Jxstar.session['user_code'];
		},
		
		/**
		* 取当前登录人名
		*/
		getUserName: function(){
			return Jxstar.session['user_name'];
		},
		
		/**
		* 取当前登录人所在部门ID
		*/
		getDeptId: function(){
			return Jxstar.session['dept_id'];
		},
		
		/**
		* 取当前登录人所在部门编码
		*/
		getDeptCode: function(){
			return Jxstar.session['dept_code'];
		},
		
		/**
		* 取当前登录人所在部门名称
		*/
		getDeptName: function(){
			return Jxstar.session['dept_name'];
		},
		
		/**
		* 取当前登录人所在的单位ID
		*/
		getOrgId: function(){
			return Jxstar.session['orgid'];
		},
		
		/**
		* 取当前登录人所在的单位编码
		*/
		getOrgCode: function(){
			return Jxstar.session['orgcode'];
		},
		
		/**
		* 取当前登录人所在的单位名称
		*/
		getOrgName: function(){
			return Jxstar.session['orgname'];
		},
		
		/**
		* 取当前登录人的角色ID
		*/
		getRoleId: function(){
			return Jxstar.session['role_id'];
		}
	});//Ext.apply

})();

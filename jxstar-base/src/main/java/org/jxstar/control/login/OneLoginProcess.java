/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.control.login;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

/**
 * 方便用户扩展当前登录用户信息加工处理的类。
 *
 * @author TonyTan
 * @version 1.0, 2012-12-29
 */
public abstract class OneLoginProcess {

	/**
	 * 输入的是外部系统账号，输出的是jxstar账号
	 * @param userCode
	 * @return
	 */
	protected String getUserCode(String userCode) {
		return userCode;
	}
	
	/**
	 * 对请求信息进一步检查，如果不合法，则返回非法的提示信息，否则返回true或空
	 * @param request
	 * @return
	 */
	protected abstract String valid(HttpServletRequest request);
	
	/**
	 * 给原有的用户信息添加更多的用户信息
	 * @param mpUser -- 包含有user_id, user_code, user_name, dept_id, dept_code, dept_name, role_id信息。
	 * @return
	 */
	protected Map<String,String> getUserMap(Map<String,String> mpUser) {
		return mpUser;
	}
}

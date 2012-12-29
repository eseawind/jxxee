/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.control.login;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.jxstar.util.MapUtil;

/**
 * 单点登录的工具类。
 *
 * @author TonyTan
 * @version 1.0, 2012-12-29
 */
public class OneLoginUtil {

	/**
	 * 取会话信息中的用户信息，并转换为JSON数据。
	 * @param request
	 * @return
	 */
	public static String getSessionData(HttpServletRequest request) {
		Map<String,String> mpUser = (Map<String,String>) request.getSession().getAttribute("curruser");
		if (mpUser == null || mpUser.isEmpty()) return "";
		
		return MapUtil.toJson(mpUser);
	}
}

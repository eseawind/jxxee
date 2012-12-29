/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.control.login;

import java.util.Map;

import org.jxstar.service.BusinessObject;
import org.jxstar.service.util.SysUserUtil;
import org.jxstar.util.config.SystemVar;
import org.jxstar.util.resource.JsMessage;

/**
 * 单点登录用到的类。
 *
 * @author TonyTan
 * @version 1.0, 2012-12-27
 */
public class OneLoginBO extends BusinessObject {
	private static final long serialVersionUID = 1L;
	
	/**
	 * 根据账号获取用户信息。
	 * @param userCode
	 * @return
	 */
	public Map<String,String> getUserMap(String userCode) {
		//从数据库中去用户信息
		Map<String,String> mpUser = SysUserUtil.getUserByCode(userCode);
		if (mpUser == null || mpUser.isEmpty()) {
			setMessage(JsMessage.getValue("loginbm.nouserinfo", userCode));
			return null;
		}
		
		//取当前用户的角色
		String userId = (String) mpUser.get("user_id");
		String roleId = SysUserUtil.getRoleID(userId);
		if (roleId == null || roleId.length() == 0) {
			setMessage(JsMessage.getValue("loginbm.nouserrole", userCode));
			return null;
		}
		
		//保存角色ID
		mpUser.put("role_id", roleId);
		mpUser.put("project_path", SystemVar.REALPATH);
		
		return mpUser;
	}
}

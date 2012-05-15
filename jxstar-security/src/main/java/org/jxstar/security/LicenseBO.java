/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.security;

import org.jxstar.service.BusinessObject;
import org.jxstar.util.StringUtil;

/**
 * 与许可相关的业务处理类。
 *
 * @author TonyTan
 * @version 1.0, 2012-5-15
 */
public class LicenseBO extends BusinessObject {
	private static final long serialVersionUID = 1L;

	/**
	 * 读取机器序列号
	 * @return
	 */
	public String readKey() {
		String key = LicenseKey.getLocalKey();
		if (key == null || key.length() == 0) {
			setMessage("获取的服务器序列号为空！");
			return _returnFaild;
		}
		
		setReturnData("{key:'"+ key +"'}");
		
		return _returnSuccess;
	}
	
	/**
	 * 读取许可信息
	 * @return
	 */
	public String readInfo() {
		SafeManager mng = SafeManager.getInstance();
		License lic = mng.readLicense("");
		
		String str = "";
		str += "用户信息：" + str(lic.customer);
		str += "序列代号：" + str(lic.serialNo);
		str += "平台厂家：" + str(lic.developer);
		str += "平台网站：" + str(lic.website);
		str += "平台名称：" + str(lic.productName);
		str += "版本类型：" + str(lic.versionType);
		str += "初始日期：" + str(lic.tmpEnd).split(" ")[0];
		
		setReturnData("{info:'"+ StringUtil.strForJson(str) +"'}");
		
		return _returnSuccess;
	}
	
	private String str(int[] s) {
		return SafeUtil.encode(s) + "<p>";
	}
}

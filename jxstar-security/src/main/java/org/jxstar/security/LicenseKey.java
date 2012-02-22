/*
 * LicenseKey.java 2011-4-2
 * 
 * Copyright 2010 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */

package org.jxstar.security;

import org.jxstar.util.SystemUtil;
import org.jxstar.util.config.SystemVar;

/**
 * 许可服务序列号生成器。
 *
 * @author TonyTan
 * @version 1.0, 2011-4-2
 */
public class LicenseKey {
	/**
	 * 检查许可key的有效性
	 * @return
	 */
	public static int validKey() {
		String key = SystemVar.getValue("license.service.key");
		if (key.length() == 0) {
			return 300;
		}
			
		String mac = null;
		String os = SystemUtil.getOSName();
		if(os.startsWith("windows")){
			mac = SafeUtil.getWindowsAddr();
		} else {
			mac = SafeUtil.getLinuxAddr();
		}
		
		if (mac == null || mac.length() == 0) {
			return 301;
		}
		
		boolean ret = mac.equals(Password.decrypt(key));
		if (ret == false) {
			return 302;
		}
		
		return 0;
	}
	
	/**
	 * 生成Windows系统下key
	 * @return
	 */
	public static String createWindowsKey() {
		String mac = SafeUtil.getWindowsAddr();
		return Password.encrypt(mac);
	}
	
	/**
	 * 生成Linux系统下key
	 * @return
	 */
	public static String createLinuxKey() {
		String mac = SafeUtil.getLinuxAddr();
		return Password.encrypt(mac);
	}
}

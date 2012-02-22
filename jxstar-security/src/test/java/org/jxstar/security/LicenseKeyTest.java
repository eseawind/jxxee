/*
 * LicenseKeyTest.java 2011-4-2
 * 
 * Copyright 2010 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */

package org.jxstar.security;

import org.jxstar.util.SystemUtil;
import org.jxstar.util.config.SystemVar;

/**
 * 
 *
 * @author TonyTan
 * @version 1.0, 2011-4-2
 */
public class LicenseKeyTest {

	/**
	* 测试用的main方法.
	*/
	public static void main(String[] argc) {
		String os = SystemUtil.getOSName();
		System.out.println("OS Tyepe:"+os);
		String key = "";
		if(os.startsWith("windows")){
			//本地是windows
			String mac = SafeUtil.getWindowsAddr();
			System.out.println("MAC Address:"+mac);
			key = LicenseKey.createWindowsKey();
		}else{
			//本地是非windows系统 一般就是linux
			String mac = SafeUtil.getLinuxAddr();
			System.out.println("MAC Address:"+mac);
			key = LicenseKey.createLinuxKey();
		}
		
		System.out.println("key:"+key);
		SystemVar.setValue("license.service.key", key);
		int valid = LicenseKey.validKey();
		System.out.println("valid:"+valid);
	}
}

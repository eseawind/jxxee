/*
 * LicenseKeyTest.java 2011-4-2
 * 
 * Copyright 2010 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */

package org.jxstar.security;

import org.jxstar.util.SystemUtil;


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
		
		if(os.startsWith("windows")){
			//本地是windows
			String mac = SafeUtil.getWindowsAddr();
			System.out.println("MAC Address:"+mac);
		}else{
			//本地是非windows系统 一般就是linux
			String mac = SafeUtil.getLinuxAddr();
			System.out.println("MAC Address:"+mac);
		}
		
		String key = LicenseKey.getLocalKey();
		System.out.println("key:" + key);
	}
}

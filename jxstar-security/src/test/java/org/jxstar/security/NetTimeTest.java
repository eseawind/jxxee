/*
 * NetTimeTest.java 2011-4-2
 * 
 * Copyright 2010 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */

package org.jxstar.security;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 取网络时间的测试类。
 *
 * @author TonyTan
 * @version 1.0, 2011-4-2
 */
public class NetTimeTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		System.out.println("--------linetime=" + NetTime.getTimeLine());
		
		System.out.println("--------nettime=" + NetTime.getNetTime());
		
		LicenseVar.setValue(LicenseVar.REAL_PATH, "d:\\tomcat6\\webapps\\jxstar");
		Date netDate = NetTime.getNetTime();
		String time = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(netDate);
		System.out.println("....................百度时间：" + time);
		//如检查为非法，则会自动修改非法标志
		SafeManager.getInstance().validCode(netDate);
		
		System.out.println("....................失效代码：" + SafeManager.getInstance().validCode());
	}

}

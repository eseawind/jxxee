/*
 * CheckLicThread.java 2011-4-2
 * 
 * Copyright 2010 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */

package org.jxstar.security;

import java.util.Date;


/**
 * 检查临时许可的时间是否到期的线程。
 *
 * @author TonyTan
 * @version 1.0, 2011-4-2
 */
public class CheckLicThread extends Thread {
	
	public void run() {
		SafeManager manger = SafeManager.getInstance();
		
		while(true) {
			//等待检查间隔时间，10分钟检查一次
			try {
				sleep(10*60*1000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			//取网络时间
			Date netDate = NetTime.getNetTime();
			//String time = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(netDate);
			//System.out.println("....................百度时间：" + time);
			//如检查为非法，则会自动修改非法标志
			manger.validCode(netDate);
		}
	}
}

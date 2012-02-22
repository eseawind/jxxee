/*
 * CheckDogThread.java 2011-4-2
 * 
 * Copyright 2010 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */

package org.jxstar.security;

import java.text.SimpleDateFormat;
import java.util.Calendar;


/**
 * 检测软件狗的线程。
 *
 * @author TonyTan
 * @version 1.0, 2011-4-2
 */
public class CheckDogThread extends Thread {

	public void run() {
		SafeManager manger = SafeManager.getInstance();
		
		while(true) {
			//等待检查间隔时间
			try {
				sleep(10*60*1000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			//检查许可key的有效性
			int code = LicenseKey.validKey();
			
			//如果有效，则修改结束时间为当前时间+1天
			if (code > 0) {
				Calendar calendar = Calendar.getInstance();
				calendar.add(Calendar.DAY_OF_MONTH, 1);
				String endtime = (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).
					format(calendar.getTime());
				
				manger.setDogEnd(endtime);
			} else {
			//如果无效，则修改软件狗为非法标志
				manger.setDogValid("0");
			}
		}
	}
}

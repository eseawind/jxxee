/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.test.pref;


/**
 * 测试在多线程环境下，同步锁的作用；
 *
 * @author TonyTan
 * @version 1.0, 2012-9-3
 */
public class SynchTest {
	private static SynchTest _instance = new SynchTest();
	
	private int flag = 0;
	
	private static int cnt = 0;
	
	private SynchTest() {}
	
	public static SynchTest getInstance() {
		return _instance;
	}
	
	@SuppressWarnings("static-access")
	public synchronized void synch() {
		cnt++;
		System.out.println("..................cnt=" + cnt);
		
		this.flag += 1;
		//必须添加延时，才能看出效果
		try {
			Thread.currentThread().sleep(10);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
		//如果添加synchronized，则没有下面的输出，否则会输出很多
		if (this.flag > 1) {
			System.out.println("..................flag=" + this.flag + "; thread:" + Thread.currentThread().hashCode());
		}
		
		this.flag -= 1;
	}
}

/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.test.pref;

import org.jxstar.test.base.TestBase;

/**
 * 测试在多线程环境下，同步锁的作用；
 *
 * @author TonyTan
 * @version 1.0, 2012-9-3
 */
public class SynchTestPref extends TestBase {

	protected boolean exeTest() {
		SynchTest.getInstance().synch();
		/*
		try {
			Thread.currentThread().sleep(5);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}*/
		
		return true;
	}
}

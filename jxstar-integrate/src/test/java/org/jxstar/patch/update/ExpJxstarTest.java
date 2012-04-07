/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.patch.update;

import org.jxstar.test.AbstractTest;

/**
 * 平台工具更新。
 *
 * @author TonyTan
 * @version 1.0, 2012-3-15
 */
public class ExpJxstarTest extends AbstractTest {

	public static void main(String[] args) {
		ExpJxstarBO plat = new ExpJxstarBO();
		
		plat.expInsertSql();
		
		//plat.expDeleteSql();
	}

}

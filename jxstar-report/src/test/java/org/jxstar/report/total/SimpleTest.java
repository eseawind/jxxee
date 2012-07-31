/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.report.total;

import org.jxstar.total2.DealExpress;

/**
 * 二维动态统计报表测试。
 *
 * @author TonyTan
 * @version 1.0, 2012-7-28
 */
public class SimpleTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		String exp = "[field1]/[field2]";
		String str = DealExpress.pareseExpress(exp, "jx1001");
		System.out.println("......str=" + str);
	}

}

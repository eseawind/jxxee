/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.service.event;

import org.jxstar.test.AbstractTest;

/**
 * 
 *
 * @author TonyTan
 * @version 1.0, 2012-7-17
 */
public class SubStatBOTest extends AbstractTest {

	public static void main(String[] args) {
		init("d:/tomcat6/webapps/jxstar_ee");
		
		SubStatBO stat = new SubStatBO();
		stat.subStat("jxstar7432767", "mat_app");
		String ret = stat.getReturnData();
		System.out.println("........return data:" + ret);
	}
}

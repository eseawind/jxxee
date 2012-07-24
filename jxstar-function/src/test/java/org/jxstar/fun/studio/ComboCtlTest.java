/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.fun.studio;

import org.jxstar.test.AbstractTest;

/**
 * 测试智能查询控件
 *
 * @author TonyTan
 * @version 1.0, 2012-7-24
 */
public class ComboCtlTest extends AbstractTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		init("D:\\tomcat6\\webapps\\jxstar_ee");

		ComboCtl ctl = new ComboCtl();
		ctl.createCtl("mat_app", "mat_app.dept_name");
	}

}

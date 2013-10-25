/*
 * Copyright(c) 2013 DongHong Inc.
 */
package org.jxstar.fun.update;

import java.util.Map;

import org.jxstar.fun.design.parser.PageParserUtil;
import org.jxstar.test.AbstractTest;

/**
 * 公共测试类。
 *
 * @author TonyTan
 * @version 1.0, 2013-10-25
 */
public class CommonDBTest extends AbstractTest {

	public static void main(String[] args) {
		init("C:\\D\\docs\\我的项目\\志华环讯\\面辅料进销存\\SVNDB\\40程序文件\\app");
		Map<String,String> mplen = PageParserUtil.funFieldLen("dev_des_up");
		System.out.println("........." + mplen.toString());
	}

}

/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.patch.update;

import org.jxstar.test.AbstractTest;

/**
 * 更新页面设计文件。
 *
 * @author TonyTan
 * @version 1.0, 2012-3-16
 */
public class UpdatePageTest extends AbstractTest {
	//文件保存路径
	private static String _save_path = "d:/update/";
	
	public static void main(String[] args) {
		UpdatePageBO page = new UpdatePageBO();
		page.update(_save_path + "/fun_design/");
	}

}

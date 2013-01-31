/*
 * Copyright(c) 2013 Donghong Inc.
 */
package org.jxstar.fun.studio;

import org.jxstar.test.AbstractTest;

/**
 * 生成功能文件。
 *
 * @author TonyTan
 * @version 1.0, 2013-1-28
 */
public class FunDefineTest extends AbstractTest {

	public static void main(String[] args) {
		String path = "D:/我的项目/志华环讯/面辅料进销存/SVNDB/40程序文件/app";
		init(path);
		FunDefineBO fun = new FunDefineBO();
		fun.createJson(path, "10120001");
	}

}

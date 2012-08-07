/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.fun.update;

import org.jxstar.fun.update.DesignUpdateBO;
import org.jxstar.test.AbstractTest;

/**
 * 设计文件更新的工具类，支持两种方式更新设计文件：
 * 1、生成所有需要更新设计文件为文本文件，放在一个文件夹中；
 *    再设计一个写入设计文件的程序，把此文件夹中的所有设计文件更新到本系统中；
 * 2、直接根据数据源，对比两个库中的设计文件不同的功能，直接更新设计文件。
 * 设计文件名规则为：[fun_id]__[grid|form].txt
 *
 * @author TonyTan
 * @version 1.0, 2012-8-7
 */
public class DesignUpdateTest extends AbstractTest {

	public static void main(String[] args) {
		init("D:\\tomcat6\\webapps\\jxstar_ee");

		String toPath = "d:\\design_update";
		String detsDN = "default";
		
		DesignUpdateBO update = new DesignUpdateBO();
		//update.compareDesign("default", detsDN, toPath);
		update.updateDesign(detsDN, toPath);
	}

}

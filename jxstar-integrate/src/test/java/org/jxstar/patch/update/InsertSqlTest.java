/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.patch.update;

import org.jxstar.test.AbstractTest;

/**
 * 测试SQL语句导出。
 *
 * @author TonyTan
 * @version 1.0, 2012-3-15
 */
public class InsertSqlTest extends AbstractTest {

	public static void main(String[] args) {
		init("D:\\tomcat6\\webapps\\xbgd");
		InsertSqlBO exp = new InsertSqlBO();
		
		//导出功能的配置SQL
		String[] funIds = {"device_param", "device_listparam"};
		exp.funExpToFile(funIds);
		
		//导出模块的配置信息
		//String[] moduleIds = {"10120001"};
		//exp.modExpToFile(moduleIds);
	}

}

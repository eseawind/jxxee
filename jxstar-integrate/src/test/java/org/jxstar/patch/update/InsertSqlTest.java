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
		init("D:\\我的项目\\固定资产\\SVNDB\\40程序文件\\app");
		InsertSqlBO exp = new InsertSqlBO();
		
		//导出功能的配置SQL
		//String[] funIds = {"pur_apply", "provider_type"};
		//exp.funExpToFile(funIds);
		
		//导出模块的配置信息
		//String[] moduleIds = {"1016"};
		//exp.modExpToFile(moduleIds);
		
		//StringBuilder sb = exp.batchMakeSQL("funall_module", "module_id like '1016%'");
		//System.out.println(sb.toString());
	}

}

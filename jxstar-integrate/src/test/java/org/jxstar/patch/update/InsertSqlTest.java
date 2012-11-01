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
		init("d:\\tomcat6\\webapps\\jxstar_ee");
		InsertSqlBO exp = new InsertSqlBO();
		
		//导出功能的配置SQL
		//String[] funIds = {"equ_type", "equ_station"};
		//exp.funExpToFile(funIds);
		
		//导出模块的配置信息
		//String[] moduleIds = {"1013", "1015", "1016"};
		//exp.modExpToFile(moduleIds);
		
		/*
		//导出功能模块定义信息
		StringBuilder sb = exp.batchMakeSQL("funall_module", "module_id like '1013%'");
		sb.append(exp.batchMakeSQL("funall_module", "module_id like '1015%'"));
		sb.append(exp.batchMakeSQL("funall_module", "module_id like '1016%'"));
		System.out.println(sb.toString());*/
		
		//导出选项控件定义信息
		//StringBuilder sb = exp.batchMakeSQL("funall_control", "control_prop = '1' and control_code not in ('selmat', 'appstatus', 'apptype')");
		//System.out.println(sb.toString());
		
		//导出编码规则定义信息
		//StringBuilder sb = exp.batchMakeSQL("sys_coderule", "fun_id = 'equ_card'");
		//System.out.println(sb.toString());
		
		//导出数据文件导入定义信息
		StringBuilder sb = exp.batchMakeSQL("imp_list", "fun_id = 'equ_card'");
		sb.append(exp.batchMakeSQL("imp_field", "imp_id in (select imp_id from imp_list where fun_id = 'equ_card')"));
		sb.append(exp.batchMakeSQL("imp_relat", "imp_id in (select imp_id from imp_list where fun_id = 'equ_card')"));
		System.out.println(sb.toString());
	}

}

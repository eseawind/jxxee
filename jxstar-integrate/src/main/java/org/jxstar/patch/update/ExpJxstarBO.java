/*
 * ExpJxstarBO.java 2012-3-15
 * 
 * Copyright 2010 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
package org.jxstar.patch.update;

import org.jxstar.service.BusinessObject;
import org.jxstar.util.FileUtil;

/**
 * 平台更新的工具类。
 *
 * @author TonyTan
 * @version 1.0, 2012-3-15
 */
public class ExpJxstarBO extends BusinessObject {
	private static final long serialVersionUID = 1L;
	//文件保存路径
	private static String _save_path = "d:/update/";
	//导出SQL文件名
	private static String _exp_ins_sql = "exp_insert.sql";
	//导出SQL文件名
	private static String _exp_del_sql = "exp_delete.sql";
	
	/**
	 * 导出平台的新增SQL
	 */
	public void expInsertSql() {
		InsertSqlBO insbo = new InsertSqlBO();
		StringBuilder sbInsert = new StringBuilder();
		
		//导出指定模块的SQL
		String[] moduleIds = {"1010", "10090002", "10090003", "10090004", "10090005"};
		for (String moduleId : moduleIds) {
			sbInsert.append(insbo.modExpSql(moduleId));
		}

		//导出指定功能的SQL
		String[] funIds = {"login", "queryevent", "sysevent"};
		for (String funId : funIds) {
			sbInsert.append(insbo.funExpSql(funId));
		}
		
		String fileName = _save_path + _exp_ins_sql;
		FileUtil.saveFile(fileName, sbInsert.toString(), "GBK");
	}
	
	/**
	 * 导出平台的卸载SQL
	 */
	public void expDeleteSql() {
		DeleteSqlBO delbo = new DeleteSqlBO();
		StringBuilder sbDelete = new StringBuilder();
		
		//导出指定模块的SQL
		String[] moduleIds = {"1010", "10090002", "10090003", "10090004", "10090005"};
		for (String moduleId : moduleIds) {
			sbDelete.append(delbo.modExpSql(moduleId));
		}
		
		//导出指定功能的SQL
		String[] funIds = {"login", "queryevent", "sysevent"};
		for (String funId : funIds) {
			sbDelete.append(delbo.funExpSql(funId));
		}
		
		String fileName = _save_path + _exp_del_sql;
		FileUtil.saveFile(fileName, sbDelete.toString(), "GBK");
	}
}

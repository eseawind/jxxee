/*
 * DmDaoUtil.java 2011-1-26
 * 
 * Copyright 2010 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
package org.jxstar.dao;

import java.util.List;
import java.util.Map;

import org.jxstar.util.MapUtil;
import org.jxstar.util.StringUtil;
import org.jxstar.util.factory.FactoryUtil;

/**
 * 读取数据模型配置信息，用于DmDao类。
 *
 * @author TonyTan
 * @version 1.0, 2011-1-26
 */
public class DmDaoUtil {
	private static BaseDao _dao = BaseDao.getInstance();
	
	/**
	 * 取指定表的主键字段名
	 * @param tableName -- 表名
	 * @return
	 */
	public static String getKeyField(String tableName) {
		String sql = "select key_field from dm_table where table_name = ?";
		
		DaoParam param = _dao.createParam(sql);
		param.addStringValue(tableName);
		
		Map<String,String> mpTable = _dao.queryMap(param);
		
		return mpTable.get("key_field");
	}
	
	/**
	 * 取指定表的字段名与数据类型的MAP对象
	 * @param tableName -- 表名
	 * @return
	 */
	public static Map<String,String> getParamType(String tableName) {
		Map<String,String> mpType = FactoryUtil.newMap();
		
		List<Map<String,String>> lsField = queryField(tableName);
		for (int i = 0, n = lsField.size(); i < n; i++) {
			Map<String,String> mpField = lsField.get(i);
			
			String fieldName = mpField.get("field_name");
			String dataType = mpField.get("data_type");
			String paramType = cvtDataType(dataType);
			
			mpType.put(fieldName, paramType);
		}
		
		return mpType;
	}
	
	/**
	 * 取所有字段构建的SQL，格式如：field1, field2, field3 ...
	 * @param tableName -- 表名
	 * @return
	 */
	public static String getFieldSql(String tableName) {
		StringBuilder sbField = new StringBuilder();
		List<Map<String,String>> lsField = queryField(tableName);
		
		for (int i = 0, n = lsField.size(); i < n; i++) {
			Map<String,String> mpField = lsField.get(i);
			
			String fieldName = mpField.get("field_name");
			sbField.append(fieldName).append(", ");
		}
		String sql = "";
		if (sbField.length() > 0) {
			sql = sbField.substring(0, sbField.length()-2);
		}
		
		return sql;
	}
	
	//如果是数据建模表中没有定义的视图，则从功能定义列中取字段类型
	//还是不建议采用这种方式，不规范的用法就不处理 tony.tan 2012-09-27
	private static List<Map<String,String>> getFunField(String tableName) {
		String funId = getFunId(tableName);
		if (funId.length() == 0) return FactoryUtil.newList();
		
		String sql = "select col_code, data_type from fun_col where fun_id = ? and col_code like ?";
		DaoParam param = _dao.createParam(sql);
		param.addStringValue(funId);
		param.addStringValue(tableName+".%");
		
		List<Map<String,String>> lsCol = _dao.query(param);
		//去掉字段名中的表名
		for (Map<String,String> mpCol : lsCol) {
			String colcode = mpCol.get("col_code");
			colcode = StringUtil.getNoTableCol(colcode);
			mpCol.put("field_name", colcode);
		}
		
		return lsCol;
	}
	
	//根据表名取功能ID，包括此表为字段功能ID
	private static String getFunId(String tableName) {
		String sql = "select fun_id from fun_col where col_code like ?";
		DaoParam param = _dao.createParam(sql);
		param.addStringValue(tableName+".%");
		
		Map<String,String> mpFun = _dao.queryMap(param);
		if (!mpFun.isEmpty()) {
			return MapUtil.getValue(mpFun, "fun_id");
		}
		return "";
	}
	
	/**
	 * 从数据模型中查询表的字段列表；如果没有则在功能字段表中找
	 * @param tableName -- 表名
	 * @return
	 */
	private static List<Map<String,String>> queryField(String tableName) {
		List<Map<String,String>> lsRet = FactoryUtil.newList();
		if (tableName == null || tableName.length() == 0) return lsRet;
		tableName = tableName.toLowerCase();
		
		String sql = "select field_name, data_type from dm_field where table_id in " +
				"(select table_id from dm_table where table_name = ?) order by field_index";
		
		DaoParam param = _dao.createParam(sql);
		param.addStringValue(tableName);
		
		lsRet = _dao.query(param);
		//如果在数据表设计器中没有找到，再从功能字段列表中找
		if (lsRet.isEmpty()) {
			lsRet = getFunField(tableName);
		}
		
		return lsRet;
	}
	
	/**
	 * 把数据模型中的数据类型转换为DAO操作中的参数类型。
	 * @param dataType -- 数据类型
	 * @return
	 */
	private static String cvtDataType(String dataType) {
		dataType = dataType.toLowerCase();
		
		if (dataType.indexOf("char") >= 0) {
			return "string";
		} else if (dataType.indexOf("number") >= 0) {
			return "double";
		} else if (dataType.indexOf("date") >= 0) {
			return "date";
		} else if (dataType.equals("int") || dataType.equals("double")) {
			return dataType;
		}
		
		return "string";
	}
}

/*
 * ProcessUtil.java 2011-1-28
 * 
 * Copyright 2010 Guangzhou Donghong Software Technology Inc.
 * Licensed under the GNU GPL Version 3.0
 */
package org.jxstar.wf.util;

import java.util.Map;

import org.jxstar.dao.BaseDao;
import org.jxstar.dao.DaoParam;
import org.jxstar.service.define.FunDefineDao;

/**
 * 工作流中的工具类。
 *
 * @author TonyTan
 * @version 1.0, 2011-1-28
 */
public class ProcessUtil {
	private static BaseDao _dao = BaseDao.getInstance();
	
	/**
	 * 判断当前功能是否需要执行审批流程，根据功能定义中的“有效记录值”判断，
	 * 如果是“审批通过”，表示需要检查流程定义，否则不检查是否有流程定义。
	 * @param funId -- 功能
	 * @return
	 */
	public static boolean isNeedWf(String funId) {
		//取功能定义信息
		Map<String,String> mpDefine = FunDefineDao.queryFun(funId);
		//取有效记录值，如果为3则表示需要检查
		String validFlag = mpDefine.get("valid_flag");
		
		return validFlag.equals("3");
	}
	
	/**
	 * 取指定功能的一条数据。
	 * @param funId -- 功能ID
	 * @param dataId -- 主键值
	 * @return
	 */
	public static Map<String,String> queryFunData(String funId, String dataId) {
		//取功能定义信息
		Map<String,String> mpDefine = FunDefineDao.queryFun(funId);
		//取主键字段名
		String keyField = mpDefine.get("pk_col");
		//取表名
		String tableName = mpDefine.get("table_name");
		//构建SQL
		StringBuilder sbsql = new StringBuilder();
		sbsql.append("select * from ").append(tableName).append(" where ");
		sbsql.append(keyField).append(" = ?");
		
		//查询数据
		DaoParam param = _dao.createParam(sbsql.toString());
		param.addStringValue(dataId);
		return _dao.queryMap(param);
	}
	
	/**
	 * 修改业务记录状态值。
	 * @param funId -- 功能ID
	 * @param dataId -- 数据ID
	 * @param audit -- 记录状态值
	 * @return
	 */
	public static boolean updateFunAudit(String funId, String dataId, String audit) {
		//取功能定义信息
		Map<String,String> mpDefine = FunDefineDao.queryFun(funId);
		//取主键字段名
		String keyField = mpDefine.get("pk_col");
		//取表名
		String tableName = mpDefine.get("table_name");
		//取记录状态字段
		String auditField = mpDefine.get("audit_col");
		
		//构建SQL
		StringBuilder sbsql = new StringBuilder();
		sbsql.append("update ").append(tableName).append(" set ").append(auditField);
		sbsql.append(" = ? where ").append(keyField).append(" = ?");
		
		DaoParam param = _dao.createParam(sbsql.toString());
		param.addStringValue(audit);
		param.addStringValue(dataId);
		return _dao.update(param);
	}
}

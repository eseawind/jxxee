/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.service.warn;

import java.util.List;
import java.util.Map;

import org.jxstar.dao.DaoParam;
import org.jxstar.service.BoException;
import org.jxstar.service.BusinessObject;
import org.jxstar.service.define.DefineDataManger;
import org.jxstar.service.util.WhereUtil;
import org.jxstar.util.StringUtil;

/**
 * 上报任务数量显示。
 *
 * @author TonyTan
 * @version 1.0, 2012-5-8
 */
public class WarnQuery extends BusinessObject {
	private static final long serialVersionUID = 1L;

	/**
	 * 查询上报任务中当前用户的记录条数
	 * @return
	 */
	public String query(String userId) {
		List<Map<String,String>> lsWarn = WarnUtil.queryWarn();
		if (lsWarn.isEmpty()) return _returnSuccess;
		
		DefineDataManger manger = DefineDataManger.getInstance();
		
		String json = "{root:[]}";
		StringBuilder sbJson = new StringBuilder();
		for (Map<String,String> mpWarn : lsWarn) {
			String funId = mpWarn.get("fun_id");
			String warnId = mpWarn.get("warn_id");
			String funName = mpWarn.get("fun_name");
			
			String whereSql = mpWarn.get("where_sql");
			
			String whereAll = "";
			try {
				whereAll = WhereUtil.queryWhere(funId, userId, whereSql, "0");
			} catch (BoException e) {
				_log.showError(e);
				this.setReturnData(json);
				return _returnSuccess;
			}
			_log.showDebug("........funName=" + funName + "; whereAll=" + whereAll);
			
			//取功能定义信息
			Map<String,String> mpFun = manger.getFunData(funId);
			//取功能表名
			String tableName = mpFun.get("table_name");
			if (tableName.length() == 0) continue;
			
			//取记录条数
			String cnt = queryCnt(tableName, whereAll);
			if (!cnt.equals("0")) {
				sbJson.append("{fun_id:'").append(funId).append("', warn_id:'").append(warnId);
				sbJson.append("', warn_num:'").append(cnt).append("', warn_name:'").append(funName);
				sbJson.append("', whereSql:'").append(StringUtil.strForJson(whereSql)).append("'},");
			}
		}
		if (sbJson.length() > 0) {
			json = "{root:["+ sbJson.substring(0, sbJson.length()-1) +"]}";
		}
		this.setReturnData(json);
		
		return _returnSuccess;
	}
	
	//取当前记录条数
	private String queryCnt(String tableName, String where) {
		StringBuilder sql = new StringBuilder("select count(*) as cnt from ");
		sql.append(tableName);
		if (where.length() > 0) {
			sql.append(" where ").append(where);
		}
		
		DaoParam param = _dao.createParam(sql.toString());
		Map<String,String> mp = _dao.queryMap(param);
		
		return mp.get("cnt");
	}
}

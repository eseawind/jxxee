/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.service.studio;

import java.util.Map;

import org.jxstar.dao.DaoParam;
import org.jxstar.dao.JsonDao;
import org.jxstar.service.BusinessObject;
import org.jxstar.util.ArrayUtil;

/**
 * 处理查询方案与统计方案。
 *
 * @author TonyTan
 * @version 1.0, 2012-4-17
 */
public class QueryCaseBO extends BusinessObject {
	private static final long serialVersionUID = 1L;
	
	private JsonDao _jsonDao = JsonDao.getInstance();

	/**
	 * 关闭查询方案界面或打开功能页面时调用
	 * @param funId
	 * @param userId
	 * @return
	 */
	public String reloadQryCase(String funId, String userId) {
		StringBuilder jsonsb = new StringBuilder("{");
		
		//取第一个查询方案的名称
		String queryId = queryFirstId(funId, userId);
		if (queryId.length() == 0) {
			setReturnData("{qrycase:[],qrycond:[],qryid:''}");
			return _returnSuccess;
		}
		
		//取所有查询方案
		String qrycase = queryNameJson(funId, userId);
		if (qrycase.length() == 0) {
			jsonsb.append("qrycase:[],");
		} else {
			jsonsb.append("qrycase:[" + qrycase + "],");
		}
		
		//取第一个查询方案的查询条件
		String qrycond = queryCondJson(queryId);
		if (qrycond.length() == 0) {
			jsonsb.append("qrycond:[],");
		} else {
			jsonsb.append("qrycond:[" + qrycond + "],");
		}
		
		jsonsb.append("qryid:'"+ queryId +"'}");
		setReturnData(jsonsb.toString());
		
		return _returnSuccess;
	}
	
	/**
	 * 选择指定的查询方案时调用
	 * @param queryId
	 * @return
	 */
	public String selectQryCase(String queryId) {
		StringBuilder jsonsb = new StringBuilder("{");
		
		String qrycond = queryCondJson(queryId);
		if (qrycond.length() == 0) {
			jsonsb.append("qrycond:[],");
		} else {
			jsonsb.append("qrycond:[" + qrycond + "],");
		}
		
		jsonsb.append("qryid:'"+ queryId +"'}");
		setReturnData(jsonsb.toString());
		
		return _returnSuccess;
	}
	
	/**
	 * 取查询方案的JSON
	 * @param funId
	 * @param userId
	 * @return
	 */
	private String queryNameJson(String funId, String userId) {
		String sqlm = "select query_id, query_name from sys_query where fun_id = ? and " +
				"(is_share = '1' or user_id = ?) order by query_no";
		DaoParam param = _dao.createParam(sqlm);
		param.addStringValue(funId);
		param.addStringValue(userId);
		return _jsonDao.query(param, new String[]{"value", "text"});
	}
	
	/**
	 * 取查询条件的JSON
	 * @param queryId
	 * @return
	 */
	private String queryCondJson(String queryId) {
		String[] cols = new String[]{"left_brack", "colcode", "colname", "condtype", 
				"cond_value", "right_brack", "andor", "coltype", "row_no"};
		String sqlm = "select "+ ArrayUtil.arrayToString(cols) +" from sys_query_det " +
				"where query_id = ? order by col_no";
		
		DaoParam param = _dao.createParam(sqlm);
		param.addStringValue(queryId);
		
		return _jsonDao.query(param, cols);
	}
	
	/**
	 * 取第一个查询方案
	 * @param funId
	 * @param userId
	 * @return
	 */
	private String queryFirstId(String funId, String userId) {
		String sqlm = "select query_id from sys_query where fun_id = ? and " +
				"(is_share = '1' or user_id = ?) order by query_no";
		DaoParam param = _dao.createParam(sqlm);
		param.addStringValue(funId);
		param.addStringValue(userId);
		
		Map<String,String> mp = _dao.queryMap(param);
		if (mp.isEmpty()) return "";
		
		return mp.get("query_id");
	}
}

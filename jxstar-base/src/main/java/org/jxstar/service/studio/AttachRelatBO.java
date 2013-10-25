/*
 * Copyright(c) 2013 DongHong Inc.
 */
package org.jxstar.service.studio;

import java.util.List;
import java.util.Map;

import org.jxstar.dao.DaoParam;
import org.jxstar.service.BusinessObject;
import org.jxstar.util.MapUtil;
import org.jxstar.util.StringUtil;
import org.jxstar.util.factory.FactoryUtil;

/**
 * 查询关联附件处理类：
 * 1、在“sys_attach_main公共附件表”中定义有哪些基础数据的附件需要共享给其它功能；
 * 2、在“sys_attach_det关联功能表”中定义可以查看此共享附件的功能有哪些，需要根据哪个字段的值关联查询；
 *
 * @author TonyTan
 * @version 1.0, 2013-10-21
 */
public class AttachRelatBO extends BusinessObject {
	private static final long serialVersionUID = 1L;
	
	/**
	 * 查询关联附件。
	 * @param funId
	 * @param dataId
	 * @return
	 */
	public String onRelatAttach(String funId, String dataId) {
		//取表名
		Map<String,String> mpFun = queryFun(funId);
		String tableName = MapUtil.getValue(mpFun, "table_name");
		List<Map<String,String>> lsRet = queryRelatAttach(tableName, dataId);
		
		StringBuilder sbJson = new StringBuilder();
		for (int i = 0, n = lsRet.size(); i < n; i++) {
			Map<String,String> mpData = lsRet.get(i);
			
			String dataid = mpData.get("data_id");
			String json = "{data_id:'"+ dataid +"', " +
					"attach_id:'"+ mpData.get("attach_id") +"', " +
					"attach_name:'"+ mpData.get("attach_name") +"', " +
					"fun_id:'"+ mpData.get("fun_id") +"', " +
					"content_type:'"+ mpData.get("content_type") +"'},";
			
			sbJson.append(json);
		}
		String jsdata = "[]";
		if (sbJson.length() > 0) {
			jsdata = "[" + sbJson.substring(0, sbJson.length()-1) + "]";
		}
		_log.showDebug("query relat attach json=" + jsdata);
		
		//返回查询数据
		setReturnData(jsdata);
		
		return _returnSuccess;
	}
	
	/**
	 * 取多条件记录的关联附件
	 * @param tableName -- 数据表名
	 * @param dataIds -- 多个记录ID，用,分隔
	 * @return
	 */
	public List<Map<String,String>> queryRelatMore(String tableName, String dataIds) {
		List<Map<String,String>> lsRet = FactoryUtil.newList();
		if (tableName == null || tableName.length() == 0 || 
				dataIds == null || dataIds.length() == 0) {
			return lsRet;
		}
		
		String[] keyIds = dataIds.split(",");
		for (String keyId : keyIds) {
			List<Map<String,String>> ls = queryRelatAttach(tableName, keyId);
			//关联附件对应关系处理
			for (Map<String,String> mp : ls) {
				String data_id = MapUtil.getValue(mp, "data_id");
				mp.put("data_id", keyId);		//识别此附件显示在哪行数据中
				mp.put("is_relat", "1");		//标记是关联附件
				mp.put("src_data_id", data_id);	//记录关联来源的数据ID
			}
			
			lsRet.addAll(ls);
		}
		
		return lsRet;
	}

	/**
	 * 查询关联附件，附件列标志中可以调用。
	 * @param tableName
	 * @param dataId
	 * @return
	 */
	public List<Map<String,String>> queryRelatAttach(String tableName, String dataId) {
		List<Map<String,String>> lsRet = FactoryUtil.newList();
		_log.showDebug("...........det relat in dataid:" + dataId);
		
		List<Map<String,String>> lsDet = queryDetRelat(tableName);
		for (Map<String,String> mpDet : lsDet) {
			String main_id = mpDet.get("main_id");
			String det_pkcol = mpDet.get("det_pkcol");
			String det_glcol = mpDet.get("det_glcol");
			_log.showDebug("...........det relat define:" + tableName + ";" + det_pkcol + ";" + det_glcol);
			
			Map<String,String> mpMain = queryMainRelat(main_id);
			if (mpMain.isEmpty()) continue;
			//取当前表中的关联字段值
			String detDataId = queryDataId(tableName, det_pkcol, det_glcol, dataId);
			_log.showDebug("...........det relat dataid:" + detDataId);
			if (detDataId.length() == 0) continue;
			
			String main_glcol = mpMain.get("main_glcol");
			String main_pkcol = mpMain.get("main_pkcol");
			String main_table = mpMain.get("main_table");
			_log.showDebug("...........main relat define:" + main_table + ";" + main_pkcol + ";" + main_glcol);
			if (main_glcol.length() == 0 || main_pkcol.length() == 0 || main_table.length() == 0) {
				_log.showDebug("...........main relat define is error!!!");
				continue;
			}
			
			//根据关联字段取基础表中的主键值
			String mainDataId = queryDataId(main_table, main_glcol, main_pkcol, detDataId);
			_log.showDebug("...........main relat dataid:" + mainDataId);
			if (mainDataId.length() == 0) continue;
			
			List<Map<String,String>> lsAttach = queryAttach(main_table, mainDataId);
			lsRet.addAll(lsAttach);
		}
		_log.showDebug("...........all relat size:" + lsRet.size());
		
		return lsRet;
	}
	
	//取附件记录
	private List<Map<String,String>> queryAttach(String tableName, String dataId) {
		String sql = "select data_id, attach_id, attach_name, content_type, fun_id from sys_attach " +
				"where table_name = ? and data_id = ? order by data_id";
		DaoParam param = _dao.createParam(sql);
		param.addStringValue(tableName);
		param.addStringValue(dataId);
		return _dao.query(param);
	}
	
	//取关联字段数据值
	private String queryDataId(String table, String pkcol, String glcol, String dataId) {
		String sql = "select "+ glcol +" from "+ table +" where "+ pkcol +" = ?";
		DaoParam param = _dao.createParam(sql);
		param.addStringValue(dataId);
		
		Map<String,String> mp =  _dao.queryMap(param);
		
		String col = StringUtil.getNoTableCol(glcol);
		return MapUtil.getValue(mp, col);
	}
	
	//根据表名查询当前功能与哪些表做附件关联
	private List<Map<String,String>> queryDetRelat(String tableName) {
		String sql = "select det_glcol, det_pkcol, main_id from sys_attach_det where det_table = ?";
		DaoParam param = _dao.createParam(sql);
		param.addStringValue(tableName);
		
		return  _dao.query(param);
	}
	
	//查询关联的附件来源
	private Map<String,String> queryMainRelat(String main_id) {
		String sql = "select main_glcol, main_pkcol, main_table from sys_attach_main where main_id = ?";
		DaoParam param = _dao.createParam(sql);
		param.addStringValue(main_id);
		
		return  _dao.queryMap(param);
	}
	
	//取功能定义信息
	private Map<String,String> queryFun(String funId) {
		String sql = "select table_name, pk_col from fun_base where fun_id = ?";
		DaoParam param = _dao.createParam(sql);
		param.addStringValue(funId);
		
		return  _dao.queryMap(param);
	}
}

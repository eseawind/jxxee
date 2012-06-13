/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.dataimp;

import java.util.List;
import java.util.Map;

import org.jxstar.dao.DaoParam;
import org.jxstar.dao.DmDao;
import org.jxstar.service.BusinessObject;
import org.jxstar.util.DateUtil;
import org.jxstar.util.MapUtil;
import org.jxstar.util.StringUtil;
import org.jxstar.util.factory.FactoryUtil;

/**
 * 根据功能ID对应的数据表，找相应的字段定义信息，导入到数据字段明细表中。
 *
 * @author TonyTan
 * @version 1.0, 2012-6-13
 */
public class ImpFieldBO extends BusinessObject {
	private static final long serialVersionUID = 1L;

	public String createField(String impId, String userId) {
		if (impId == null || impId.length() == 0) {
			setMessage("自动创建数据字段时功能ID与定义ID为空！");
			return _returnFaild;
		}
		
		Map<String,String> mpImp = DataImpUtil.queryImpById(impId);
		String funId = MapUtil.getValue(mpImp, "fun_id");
		String table = DataImpUtil.getTableName(funId);
		if (table == null || table.length() == 0) {
			setMessage("没有找到数据导入功能的数据表定义！");
			return _returnFaild;
		}
		
		if (!insertField(table, impId, userId)) {
			setMessage("自动创建数据字段失败！");
			return _returnFaild;
		}
		
		return _returnSuccess;
	}
	
	//新增数据字段
	private boolean insertField(String table_name, String imp_id, String user_id) {
		List<Map<String,String>> lsField = queryField(table_name);
		if (lsField.isEmpty()) {
			_log.showDebug("当前表【{0}】没有字段定义！", table_name);
			return false;
		}
		
		int index = 0;
		for (Map<String,String> mpField : lsField) {
			Map<String,String> mpData = FactoryUtil.newMap();
			
			String field_name = mpField.get("col_code");
			mpData.put("field_name", StringUtil.getNoTableCol(field_name));
			mpData.put("field_title", mpField.get("col_name"));
			mpData.put("data_type", mpField.get("data_type"));
			
			mpData.put("field_no", Integer.toString(++index));
			mpData.put("data_src", "1");
			mpData.put("imp_id", imp_id);
			mpData.put("add_date", DateUtil.getTodaySec());
			mpData.put("add_userid", user_id);
			
			DmDao.insert("imp_field", mpData);
		}
		
		return true;
	}
	
	//根据表名取基本字段信息
	private List<Map<String,String>> queryField(String tableName) {
		String sql = "select col_code, col_name, data_type from v_field_info where table_name = ?";
		DaoParam param = _dao.createParam(sql);
		param.addStringValue(tableName);
		return _dao.query(param);
	}
}

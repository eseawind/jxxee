/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.total2;

import java.util.List;
import java.util.Map;

import org.jxstar.total.util.TotalDao;
import org.jxstar.util.MapUtil;

/**
 * 处理数据的工具类。
 *
 * @author TonyTan
 * @version 1.0, 2012-7-28
 */
public class DealUtil {
	//分隔动态字段的标志
	public static final String FIELD_FLAG = "__";
	
	/**
	 * 添加字段动态标志
	 * @param field -- 原字段名
	 * @param typeId -- 动态分类ID
	 * @return
	 */
	public static String fieldFlag(String field, String typeId) {
		StringBuilder sb = new StringBuilder(field);
		sb.append(FIELD_FLAG);
		sb.append(typeId);
		return sb.toString();
	}
	
	//取横向|纵向分类ID字段
	public static String getTypeField(String reportId, String type) {
		String field = "";
		List<Map<String,String>> lsType =  TotalDao.queryTotalArea(reportId, type);
		if (!lsType.isEmpty()) {
			field = MapUtil.getValue(lsType.get(0), "field_typeid");
		}
		
		return field;
	}
}

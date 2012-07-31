/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.total.page;

import java.util.List;
import java.util.Map;

import org.jxstar.report.ReportException;
import org.jxstar.total.util.TotalDao;
import org.jxstar.total.util.TotalUtil;
import org.jxstar.util.MapUtil;

/**
 * 构建普通统计报表显示数据的页面对象需要的JSON数据。
 *
 * @author TonyTan
 * @version 1.0, 2012-7-30
 */
public class TotalPage extends AbstractTotalPage {
	private static final long serialVersionUID = 1L;

	/* (non-Javadoc)
	 * @see org.jxstar.total.page.AbstractTotalPage#columnJson(java.lang.String)
	 */
	@Override
	public String columnJson(String reportId) throws ReportException {
		List<Map<String,String>> lsCol = TotalUtil.queryColumn(reportId);
		if (lsCol.isEmpty()) {
			throw new ReportException("没有定义统计报表的列信息！");
		}
		
		return columnToJson(lsCol);
	}

	/* (non-Javadoc)
	 * @see org.jxstar.total.page.AbstractTotalPage#groupTitle(java.lang.String)
	 */
	@Override
	public String groupTitle(String reportId) throws ReportException {
		List<Map<String,String>> lsArea = TotalDao.queryArea(reportId);
		if (lsArea.isEmpty()) {
			throw new ReportException("没有定义统计报表的统计数据区域！");
		}
		
		StringBuilder sbTitle = new StringBuilder();
		for (int i = 0, n = lsArea.size(); i < n; i++) {
			Map<String,String> mpArea = lsArea.get(i);
			String is_head = mpArea.get("is_head");
			if (!is_head.equals("1")) continue;
			
			//标题
			String title = mpArea.get("area_name");
			//列数
			//String areaId = mpArea.get("area_id");
			//String colspan = TotalDao.queryShowNum(areaId);
			String colspan = MapUtil.getValue(mpArea, "head_colnum", "0");
			if (colspan.equals("0")) continue;
			
			sbTitle.append("{header:'" + title + "', colspan:" + colspan + ", align:'center'},");
		}
		
		String json = "[]";
		if (sbTitle.length() > 1) {
			json = "[" + sbTitle.substring(0, sbTitle.length()-1) + "]";
		}
		
		return json;
	}
}

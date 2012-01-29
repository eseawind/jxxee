package org.jxstar.total.studio;

import java.util.List;
import java.util.Map;

import org.jxstar.service.BusinessObject;
import org.jxstar.total.util.ConditionJson;
import org.jxstar.total.util.TotalDao;
import org.jxstar.total.util.TotalUtil;
import org.jxstar.util.MapUtil;
import org.jxstar.util.factory.FactoryUtil;

/**
 * 统计结果集表格定义的JSON
 *
 * @author TonyTan
 * @version 1.0, 2011-12-1
 */
public class TotalGridQuery extends BusinessObject {
	private static final long serialVersionUID = 1L;

	/**
	 * 统计结果集表格定义
	 * @param funId -- 功能ID
	 * @return
	 */
	public String totalControl(String funId) {
		Map<String,String> mpReport = TotalDao.queryReport(funId);
		if (mpReport.isEmpty()) {
			setMessage("没有找到报表定义信息！");
			return _returnFaild;
		}
		//取报表定义ID
		String reportId = mpReport.get("report_id");
		
		//取统计条件的JSON
		String toolJs = toolJson(funId, reportId);
		
		//取输出表格列信息的JSON
		String colJs = columnJson(reportId);
		
		//取表格分组标题的JSON
		String groupJs = groupTitle(reportId);
		
		StringBuilder sbjs = new StringBuilder();
		sbjs.append("{toolfn:"+ toolJs +", cols:"+ colJs +", groups:"+ groupJs +", reportId:'"+ reportId +"'}");
		_log.showDebug("...............control toolJs=" + sbjs.toString());
		
		this.setReturnData(sbjs.toString());
		
		return _returnSuccess;
	}
	
	/**
	 * 取统计报表的第一层标题，先取需要显示标题的区域，而后取每个区域有多少个需要显示的列，返回数据格式如：
	 * [{header: 'title1', colspan: 2, align: 'center'},{header: 'title2', colspan: 2, align: 'center'}...]
	 * @param reportId
	 * @return
	 */
	private String groupTitle(String reportId) {
		List<Map<String,String>> lsArea = TotalDao.queryArea(reportId);
		if (lsArea.isEmpty()) return "[]";
		
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
	
	/**
	 * 取统计工具栏的JSON
	 * @param funId
	 * @param reportId
	 * @return
	 */
	private String toolJson(String funId, String reportId) {
		List<Map<String,String>> lsParam = TotalDao.queryRequestParam(reportId);
		lsParam = getDesign(lsParam);
		
		ConditionJson parser = new ConditionJson();
		return parser.parse(funId, lsParam);
	}
	
	/**
	 * 处理控件参数
	 * @param lsParam
	 * @return
	 */
	private List<Map<String,String>> getDesign(List<Map<String,String>> lsParam) {
		List<Map<String,String>> lsRet = FactoryUtil.newList();
		
		for (int i = 0, n = lsParam.size(); i < n; i++) {
			lsRet.add(getDesignItem(lsParam.get(i)));
		}
		
		return lsRet;
	}
	
	/**
	 * 保存统计条件参数信息为输出页面需要的格式
	 * @param mpItem -- 统计条件参数
	 * @return
	 */
	private Map<String,String> getDesignItem(Map<String,String> mpItem) {
		Map<String,String> mpDesign = FactoryUtil.newMap();
		
		String ctltype = mpItem.get("ctl_type");
		if (ctltype.length() == 0) {
			ctltype = "text";
		}
		
		String isshow = mpItem.get("is_show");
		if (!isshow.equals("1")) {
			ctltype = "hidden";
		}
		
		mpDesign.put("col_code", mpItem.get("param_code"));
		mpDesign.put("col_name", mpItem.get("param_name"));
		mpDesign.put("col_control", ctltype);
		mpDesign.put("control_name", mpItem.get("ctl_code"));
		mpDesign.put("anchor", "100");
		mpDesign.put("is_edit", "1");
		mpDesign.put("is_show", isshow);
		mpDesign.put("default_value", mpItem.get("def_val"));
		mpDesign.put("format_id", mpItem.get("format"));
		mpDesign.put("is_notnull", mpItem.get("is_must"));
		mpDesign.put("source_cols", mpItem.get("ctl_srccol"));
		mpDesign.put("target_cols", mpItem.get("ctl_descol"));
		
		return mpDesign;
	}
	
	/**
	 * 取列定义信息
	 * @param reportId -- 报表ID
	 * @return
	 */
	private String columnJson(String reportId) {
		List<Map<String,String>> lsCol = TotalUtil.queryColumn(reportId);
		if (lsCol.isEmpty()) return "[]";
		
		StringBuilder sbJson = new StringBuilder();
		for (int i = 0, n = lsCol.size(); i < n; i++) {
			Map<String,String> mpcol = lsCol.get(i);
			String is_show = MapUtil.getValue(mpcol, "is_show", "0");
			if (is_show.equals("0")) continue;
			
			String width = MapUtil.getValue(mpcol, "col_width", "100");
			if (Integer.parseInt(width) <= 0) width = "100";
			
			sbJson.append("{col_code:'" + mpcol.get("col_code") + "',");
			sbJson.append("display:'" + mpcol.get("display") + "',");
			sbJson.append("format:'" + MapUtil.getValue(mpcol, "format", "text") + "',");
			sbJson.append("combo_code:'" + mpcol.get("combo_code") + "',");
			sbJson.append("col_width:" + width + "},");
		}
		
		String json = "";
		if (sbJson.length() > 1) {
			json = "[" + sbJson.substring(0, sbJson.length()-1) + "]";
		}
		
		return json;
	}
}

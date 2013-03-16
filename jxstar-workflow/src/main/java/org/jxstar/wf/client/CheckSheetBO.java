/*
 * Copyright(c) 2013 Donghong Inc.
 */
package org.jxstar.wf.client;

import java.util.List;
import java.util.Map;

import org.jxstar.control.action.RequestContext;
import org.jxstar.dao.DaoParam;
import org.jxstar.service.BusinessObject;
import org.jxstar.service.util.ConditionUtil;
import org.jxstar.service.util.TaskUtil;
import org.jxstar.util.DateUtil;
import org.jxstar.util.MapUtil;
import org.jxstar.util.key.KeyCreator;

/**
 * 查找审批单定义信息。
 *
 * @author TonyTan
 * @version 1.0, 2013-3-12
 */
public class CheckSheetBO extends BusinessObject {
	private static final long serialVersionUID = 1L;
	
	/**
	 * 标记审批过程实例采用的审批单ID；
	 * process_1过程实例启动事件调用；
	 * @param request -- 过程实例请求对象
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String markReport(RequestContext request) {
		String processId = request.getRequestValue("process_id");
		String instanceId = request.getRequestValue("instance_id");
		Map<String, String> appData = (Map<String, String>) request.getRequestObject("app_data");
		//找到审批单版本定义，后就填写标记数据
		String reportId = getReportIdBySheet(processId, appData);
		if (reportId.length() > 0) {
			boolean ret = writeSheetMark(instanceId, reportId);
			if (!ret) return _returnFaild;
		}
		
		return _returnSuccess;
	}
	
	/**
	 * 取当前业务记录使用的报表模块ID：
	 * 1、先根据取当前业务记录找过程实例ID，再根据过程实例ID找报表ID；
	 * 2、如果在当前实例表中找不到，则到历史实例表中找，如果有多记录，则找最近一条过程实例记录；
	 * 3、如果在标记表中没有记录，则直接根据功能ID找报表模板；
	 * 
	 * ReportInfoBO.queryCheckReport -- 原来用这个方法找审批表单
	 * @param funId -- 功能ID
	 * @param dataId -- 数据ID
	 * @return
	 */
	public String checkReport(String funId, String dataId) {
		_log.showDebug(".........find report id, funId={0}, dataId={1}.", funId, dataId);
		
		String reportId = getReportIdByMark(funId, dataId);
		_log.showDebug(".........find mark reportid={0}.", reportId);
		
		//如果没有找到报表ID，则直接根据功能ID找报表ID
		if (reportId.length() == 0) {
			reportId = queryReportId(funId);
			_log.showDebug(".........find define reportid={0}.", reportId);
		}
		
		//返回报表ID到前台
		if (reportId.length() > 0) {
			setReturnData("[{report_id:'"+reportId+"'}]");
		}
		
		return _returnSuccess;
	}

	/**
	 * 先根据过程定义找到有效的审批单；
	 * 如果没有找到，则再根据功能ID到报表定义表中审批单；
	 * @param processId -- 过程定义ID
	 * @param appData -- 当前过程实例的应用数据
	 * @return
	 */
	private String getReportIdBySheet(String processId, Map<String, String> appData) {
		String sql = "select report_id, where_sql from wf_sheet where state = '1' " +
				"and process_id = ? order by version_code desc";
		
		DaoParam param = _dao.createParam(sql);
		param.addStringValue(processId);
		
		List<Map<String,String>> lsData = _dao.query(param);
		if (lsData.isEmpty()) return ""; 
		
		//解析过滤条件，找出过滤条件为真的审批单，支持定义各分厂的审批单
		for (Map<String,String> mpData : lsData) {
			String whereSql = mpData.get("where_sql");
			String reportId = mpData.get("report_id");
			
			if (whereSql.length() == 0) return reportId;
			
			whereSql = TaskUtil.parseAppField(whereSql, appData, true);
			_log.showDebug("----------检查符合条件的审批单=" + whereSql);
			
			if (ConditionUtil.validCondition(whereSql)) return reportId;
		}
		
		return "";
	}
	
	/**
	 * 根据功能ID找审批单
	 * @param funId -- 功能ID
	 * @return
	 */
	private String queryReportId(String funId) {
		String sql = "select report_id, report_name from rpt_list where (fun_id like ? or fun_id = ?) "
			   	   + " and report_type = 'form' order by report_index ";
		DaoParam param = _dao.createParam(sql);
		param.addStringValue("%," + funId + ",%");
		param.addStringValue(funId);
		
		Map<String, String> mpData = _dao.queryMap(param);
		return MapUtil.getValue(mpData, "report_id");
	}
	
	/**
	 * 记录当前过程实例采用的报表ID
	 * @param instanceId -- 实例ID
	 * @param reportId -- 报表ID
	 * @return
	 */
	private boolean writeSheetMark(String instanceId, String reportId) {
		String sql = "insert into wf_sheet_mark(mark_id, instance_id, fun_id, data_id, report_id, mark_date) "
			+ "select ?, instance_id, fun_id, data_id, ?, ? from wf_instance where instance_id = ?";
		
		String markId = KeyCreator.getInstance().createKey("wf_sheet_mark");
		
		DaoParam param = _dao.createParam(sql);
		param.addStringValue(markId);
		param.addStringValue(reportId);
		param.addDateValue(DateUtil.getTodaySec());
		param.addStringValue(instanceId);
		
		return _dao.update(param);
	}
	
	//从标记数据表中取报表ID
	private String getReportIdByMark(String funId, String dataId) {
		String sql = "select instance_id, report_id from wf_sheet_mark " +
				"where fun_id = ? and data_id = ? order by mark_date desc";
		DaoParam param = _dao.createParam(sql);
		param.addStringValue(funId);
		param.addStringValue(dataId);
		
		Map<String, String> mpData = _dao.queryMap(param);
		return MapUtil.getValue(mpData, "report_id");
	}
}

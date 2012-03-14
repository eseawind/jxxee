/*
 * XlsToHtmlBO.java 2010-11-16
 * 
 * Copyright 2010 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
package org.jxstar.report.studio;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;

import org.jxstar.control.action.RequestContext;
import org.jxstar.report.ReportException;
import org.jxstar.report.util.ReportDao;
import org.jxstar.report.util.XlsToHtml;
import org.jxstar.security.SafeManager;
import org.jxstar.service.BusinessObject;
import org.jxstar.util.resource.JsMessage;
import org.jxstar.util.resource.JsParam;

/**
 * 根据当前的报表记录构建报表模板文件。
 *
 * @author TonyTan
 * @version 1.0, 2010-11-16
 */
public class XlsToHtmlBO extends BusinessObject {
	private static final long serialVersionUID = 1L;

	/**
	 * 根据报表ID取报表模板文件
	 * @param reportId -- 报表ID
	 * @return
	 */
	public String loadHtml(RequestContext request) {	
		String reportId = request.getRequestValue("reportId");
		String realPath = request.getRequestValue(JsParam.REALPATH);
		_log.showDebug("参数信息 reportId=" + reportId + "; realPath=" + realPath);
		if (reportId == null || reportId.length() == 0) {
			//"报表定义ID为空！"
			setMessage(JsMessage.getValue("xlstohtmlbo.error01"));
			return _returnFaild;
		}
		
		//许可检测
		int code = SafeManager.getInstance().validCode();
		if (code > 0) {
			setMessage(JsMessage.getValue("license.notvalid"), code);
			return _returnFaild;
		}
		//企业版才可以使用此功能
		if (!SafeManager.getInstance().isEE()) {
			setMessage(JsMessage.getValue("license.notee"), code);
			return _returnFaild;
		}
		
		//取报表定义信息
		Map<String,String> mpReport = ReportDao.getReport(reportId);
		if (mpReport.isEmpty()) {//"报表定义信息为空，报表ID为【{0}】！"
			setMessage(JsMessage.getValue("xlstohtmlbo.error02"), reportId);
			return _returnFaild;
		}
		String rptFile = mpReport.get("report_file");
		if (rptFile == null || rptFile.length() == 0) {
			//"报表模板文件没有设置，报表ID为【{0}】！"
			setMessage(JsMessage.getValue("xlstohtmlbo.error03"), reportId);
			return _returnFaild;
		}
		
		rptFile = realPath + "/report/xls" + rptFile;
		_log.showDebug("报表模板文件完整路径=" + rptFile);
		
		//把xls文件转换为html文件
		XlsToHtml xlsTo = new XlsToHtml();
		StringBuilder sbHtml = new StringBuilder();
		try {
			String html = xlsTo.parserXls(rptFile);
			sbHtml.append(html);
		} catch (ReportException e) {
			e.printStackTrace();
			setMessage(e.getMessage());
			return _returnFaild;
		}
		
		//添加字段设置位置信息
		sbHtml.append("<script>\n");
		sbHtml.append("var headPos = [], detailPos = [];\n");
		
		//取表头字段位置信息
		List<Map<String,String>> lsHead = ReportDao.getHeadInfo(reportId);
		if (lsHead.isEmpty()) {
			_log.showDebug("报表头位置定义信息为空！");
		} else {
			StringBuilder sbHead = new StringBuilder();
			for (int i = 0; i < lsHead.size(); i++) {
				Map<String,String> mpHead = lsHead.get(i);
				
				String display = mpHead.get("display");
				String colpos = mpHead.get("col_pos");
				
				if (display.length() > 0 && colpos.length() > 0) {
					sbHead.append("['"+ colpos +"', '"+ display +"'],");
				}
			}
			//去掉最后一个,
			String shead = "";
			if (sbHead.length() > 0) {
				shead = sbHead.substring(0, sbHead.length()-1);
			}
			sbHtml.append("headPos = ["+ shead +"];\n");
		}
		
		//取报表字段位置信息
		List<Map<String,String>> lsDetail = ReportDao.getReportCol(reportId);
		if (lsDetail.isEmpty()) {
			_log.showDebug("报表明细位置定义信息为空！");
		} else {
			StringBuilder sbDetail = new StringBuilder();
			for (int i = 0; i < lsDetail.size(); i++) {
				Map<String,String> mpDetail = lsDetail.get(i);
				
				String display = mpDetail.get("display");
				String colpos = mpDetail.get("col_pos");
				
				if (display.length() > 0 && colpos.length() > 0) {
					sbDetail.append("['"+ colpos +"', '"+ display +"'],");
				}
			}
			//去掉最后一个,
			String sdet = "";
			if (sbDetail.length() > 0) {
				sdet = sbDetail.substring(0, sbDetail.length()-1);
			}
			sbHtml.append("detailPos = ["+ sdet +"];\n");
		}
		
		//显示字段位置信息
		sbHtml.append("for(var i = 0, n = headPos.length; i < n; i++) {\n");
		sbHtml.append("	document.getElementById(headPos[i][0]).innerHTML = headPos[i][1];\n");
		sbHtml.append("}\n");
		sbHtml.append("for(var i = 0, n = detailPos.length; i < n; i++) {\n");
		sbHtml.append("	document.getElementById(detailPos[i][0]).innerHTML = detailPos[i][1];\n");
		sbHtml.append("}\n");
		sbHtml.append("</script>\n");
		//_log.showDebug(sbHtml.toString());
		
		try {
			request.setReturnBytes(sbHtml.toString().getBytes("utf-8"));
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		
		return _returnSuccess;
	}
}

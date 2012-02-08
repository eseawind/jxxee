/*
 * ReportActionTest.java 2009-10-6
 * 
 * Copyright 2010 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
package org.jxstar.report.studio;

import java.io.FileOutputStream;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;


import org.jxstar.report.Report;
import org.jxstar.report.ReportException;
import org.jxstar.report.util.ReportDao;
import org.jxstar.report.util.ReportFactory;
import org.jxstar.test.AbstractTest;
import org.jxstar.util.factory.FactoryUtil;
import org.jxstar.util.resource.JsParam;

/**
 * 控制器测试
 *
 * @author TonyTan
 * @version 1.0, 2009-10-6
 */
public class ReportActionTest extends AbstractTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		ReportActionTest test = new ReportActionTest();
		
		try {
			Map<String, Object> mpParam = test.initAction();
			HSSFWorkbook xlswb = (HSSFWorkbook) test.outputXls(mpParam);
			
			try {
				FileOutputStream fis = new FileOutputStream("d:/cc.xls");
				xlswb.write(fis);
				
				fis.flush();
				fis.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
			
		} catch (ReportException e) {
			e.printStackTrace();
		}
		
	}
	
	@SuppressWarnings("unchecked")
	public Object outputXls(Map<String, Object> mpParam) throws ReportException {
		Object ret = null;
		//取报表定义对象
		Map<String,String> mpReport = (Map<String,String>) mpParam.get("report");
		//报表类型
		String reportName = mpReport.get("report_type");
		//报表自定义处理类
		String exec_clazz = mpReport.get("custom_class");
		
		if (exec_clazz.length() == 0) {
			reportName = ReportFactory.getReportXls(reportName);
		} else {
			reportName = exec_clazz;
		}
		
		//创建报表处理实例
		Report report = ReportFactory.newInstance(reportName);
		
		//初始化报表对象
		report.initReport(mpParam);
			
		//构建报表输出对象
		ret = report.output();
		
		return ret;
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
    public Map<String, Object> initAction() throws ReportException {
		Map mpRet = FactoryUtil.newMap();
		
		//判断用户信息-----------------------
		String curUserId = "administor";
		Map<String,String> mpUser = FactoryUtil.newMap();
		mpUser.put("user_code", "admin");
		mpUser.put("user_id", "administor");
		mpRet.put("user", mpUser);
		
		//取页面参数-----------------------
		String funid = "run_malrecord";
		mpRet.put(JsParam.FUNID, funid);
		mpRet.put("printType", "xls");
		
		String reportId = "jxstar15";
		mpRet.put("reportId", reportId);
		mpRet.put("orderSql", "");
		
		String whereSql = "run_mal_record.mal_id in ('jxstar3886', 'jxstar61991')";//jxstar61991
		mpRet.put("whereSql", whereSql);
		
		String whereType = "";
		mpRet.put("whereType", whereType);
		
		String whereValue = "";
		mpRet.put("whereValue", whereValue);
		//取页面参数 end-----------------------
		
		//取报表定义信息
		Map<String,String> mpReport = ReportDao.getReport(reportId);
		mpRet.put("report", mpReport);
		
		//取报表主区域SQL
		String mainSql = ReportDao.getMainAreaSql(funid, reportId, whereSql, curUserId);
		mpRet.put("mainSql", mainSql);
		
		//设置当前程序的实际路径
		String realPath = "d:/Tomcat6/webapps/jxstar";
		mpRet.put("realPath", realPath);
		
		return mpRet;
	}
}

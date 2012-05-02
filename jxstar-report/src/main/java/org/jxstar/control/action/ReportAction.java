/*
 * ReportAction.java 2010-11-11
 * 
 * Copyright 2010 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
package org.jxstar.control.action;

import java.io.IOException;
import java.util.Map;

import javax.servlet.ServletOutputStream;
import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.jxstar.dao.transaction.TransactionException;
import org.jxstar.dao.transaction.TransactionManager;
import org.jxstar.report.Report;
import org.jxstar.report.ReportException;
import org.jxstar.report.util.ReportDao;
import org.jxstar.report.util.ReportFactory;
import org.jxstar.security.SafeManager;
import org.jxstar.util.factory.FactoryUtil;
import org.jxstar.util.factory.SystemFactory;
import org.jxstar.util.resource.JsMessage;
import org.jxstar.util.resource.JsParam;

/**
 * 输出报表的控制器：负责组织前台参数，调用报表处理类，输出报表。
 *
 * @author TonyTan
 * @version 1.0, 2010-11-11
 */
public class ReportAction extends Action {
	// 事务管理对象
	private static TransactionManager _tranMng = null;
	
	public void execute(HttpServletRequest request, HttpServletResponse response) {
		//许可检测
		int code = SafeManager.getInstance().validCode();
		if (code > 0) {
			String msg = JsMessage.getValue("license.notvalid", code);
			responseWrite(response, msg);
			return;
		}
		//企业版才可以使用此功能
		if (!SafeManager.getInstance().isEE()) {
			responseWrite(response, JsMessage.getValue("license.notee"));
			return;
		}
		
		try {
			//创建事务对象并开始事务
			_tranMng = (TransactionManager) SystemFactory.createSystemObject("TransactionManager");
			_tranMng.startTran();
			
			//判断前台参数是否有效，并初始化参数
			Map<String, Object> mpParam = initAction(request);
			
			//报表输出类型
			String printType = (String) mpParam.get("printType");
			
			//输出excel报表
			if (printType.equals("xls")) {
				HSSFWorkbook xlswb = (HSSFWorkbook) outputXls(mpParam);
				
				String reportName = (String) mpParam.get("reportName");
				responseXls(xlswb, reportName, request, response);
			} else if (printType.equals("html")) {
			//输出html报表
				outputHtml(mpParam, request, response);
			} else {
			//当前报表类型不支持
				_log.showWarn("print type ["+ printType +"] is not valid!!");
			}
			
			try {
				_tranMng.commitTran();
			} catch (TransactionException e) {
				_log.showError(e);
			}
		} catch (ReportException e) {
			_log.showError(e);
			try {
				_tranMng.rollbackTran();
			} catch (TransactionException e2) {
				_log.showError(e2);
			}
			
			//反馈响应信息
			responseWrite(response, e.getMessage());
		}
	}

	/**
	 * 输出excel类型报表
	 * @param mpParam
	 * @return
	 * @throws ReportException
	 */
	@SuppressWarnings("unchecked")
	private Object outputXls(Map<String, Object> mpParam) throws ReportException {
		Object ret = null;
		//取报表定义对象
		Map<String,String> mpReport = (Map<String,String>) mpParam.get("report");
		//报表类型
		String reportType = mpReport.get("report_type");
		//报表自定义处理类
		String className = mpReport.get("custom_class");
		
		if (className.length() == 0) {
		    className = ReportFactory.getReportXls(reportType);
		}
		
		//创建报表处理实例
		Report report = ReportFactory.newInstance(className);
		
		//初始化报表对象
		report.initReport(mpParam);
			
		//构建报表输出对象
		ret = report.output();
		
		return ret;
	}
	
	/**
	 * 输出html类型的报表
	 * @param mpParam -- 所有前台参数
	 */
	@SuppressWarnings("unchecked")
	private void outputHtml(Map<String, Object> mpParam, 
	        HttpServletRequest request, HttpServletResponse response) {
		//取报表定义对象
		Map<String,String> mpReport = (Map<String,String>) mpParam.get("report");
		
		//取报表模板文件名
		String modelFile = mpReport.get("report_file");

		modelFile = modelFile.substring(0, modelFile.lastIndexOf(".")) + ".htm";
		String url = request.getContextPath() + "/report/html" + modelFile.replaceAll("\\\\", "/");
		_log.showDebug("output html report file=" + url);
		
		//把报表参数信息返回前台
        HttpSession session = request.getSession();

        //将当前报表打印的信息存放到session
        session.setAttribute("reportParam", mpParam);
        
		//重定向到报表目标文件
        try {
            response.sendRedirect(url);
        } catch (IOException e) {
            e.printStackTrace();
        }
	}
	
	/**
	 * 输出报表文件流。
	 * @param xlswb -- 报表文件对象
	 * @param reportName -- 报表文件名称
	 * @param request -- http请求对象
	 * @param response -- http响应对象
	 * @throws ReportException
	 */
	private void responseXls(HSSFWorkbook xlswb, String reportName, HttpServletRequest request, 
						HttpServletResponse response) throws ReportException {
		//设置响应头信息
		response.setHeader("Content-Type", "application/vnd.ms-excel");
		String userAgent = request.getHeader("User-Agent");
		
		try {
			reportName = ActionHelper.getAttachName(userAgent, reportName+".xls") ;
			response.setHeader("Content-Disposition", "attachment;filename=" + reportName);
			ServletOutputStream out = response.getOutputStream();
	
			xlswb.write(out);
			out.flush();
			out.close();
			_log.showDebug("---------file output end!");
		} catch (Exception e) {
			e.printStackTrace();//"报表文件流输出出错！"
			throw new ReportException(JsMessage.getValue("reportaction.error01"));
		}
	}
	
	/**
	 * 初始化报表参数，并判断参数的有效性。
	 * @param request -- http请求对象
	 * @return
	 * @throws ReportException
	 */
	@SuppressWarnings("unchecked")
	private Map<String, Object> initAction(HttpServletRequest request) throws ReportException {
	    Map<String, Object> mpRet = FactoryUtil.newMap();
	    //保存所有请求参数，特殊报表中用（暂时用于统计报表模板输出）
	    mpRet.put("all_params", request.getParameterMap());
	    
		//判断用户信息-----------------------
		String curUserId = "";
		Map<String,String> mpUser = (Map<String,String>) request.getSession().
										getAttribute(JsParam.CURRUSER);
		if (mpUser == null || mpUser.isEmpty()) {
			throw new ReportException(JsMessage.getValue("commonaction.nologin"));
		} else {
			//判断当前用户是否有效
			curUserId = mpUser.get("user_id");
			String reqUserId = getRequestValue(request, "user_id");
			if (!reqUserId.equals(curUserId)) {
				throw new ReportException(JsMessage.getValue("commonaction.nouser"));
			}
		}
		mpRet.put("user", mpUser);
		
		//取页面参数-----------------------
		String funid = getRequestValue(request, JsParam.FUNID);
		//"初始化出错：功能ID不能为空！"
		if (funid.length() == 0) 
			throw new ReportException(JsMessage.getValue("reportaction.error02"));
		mpRet.put(JsParam.FUNID, funid);
		
		String printType = getRequestValue(request, "printType");
		//"初始化出错：报表输出类型不能为空！"
		if (printType.length() == 0) 
			throw new ReportException(JsMessage.getValue("reportaction.error03"));
		mpRet.put("printType", printType);
		
		String reportId = getRequestValue(request, "reportId");
		//"初始化出错：报表定义ID不能为空！"
		if (reportId.length() == 0) 
			throw new ReportException(JsMessage.getValue("reportaction.error04"));
		mpRet.put("reportId", reportId);
		
		String orderSql = getRequestValue(request, "orderSql");
		mpRet.put("orderSql", orderSql);
		
		String whereSql = getRequestValue(request, "whereSql");
		mpRet.put("whereSql", whereSql);
		
		String whereType = getRequestValue(request, "whereType");
		mpRet.put("whereType", whereType);
		
		String whereValue = getRequestValue(request, "whereValue");
		mpRet.put("whereValue", whereValue);
		//取页面参数 end-----------------------
		
		//取报表定义信息
		Map<String,String> mpReport = ReportDao.getReport(reportId);
		mpRet.put("report", mpReport);
		mpRet.put("reportName", mpReport.get("report_name"));
		
		//取报表主区域SQL
		String mainSql = "";
		
		//是否审批表单，如果是，则根据记录ID查询值
		String isCheck = getRequestValue(request, "isCheck");
		if (isCheck.equals("true")) {
			mainSql = ReportDao.getCheckMainSql(reportId, whereSql);
		} else {
			mainSql = ReportDao.getMainAreaSql(funid, reportId, whereSql, curUserId);
		}
		mpRet.put("mainSql", mainSql);
		
		//设置当前程序的实际路径
		String realPath = request.getSession().getServletContext().getRealPath("/");
		if (realPath == null || realPath.equals("null")) {
			//"初始化出错：程序事件路径为空！"
			throw new ReportException(JsMessage.getValue("reportaction.error05"));
		}
		realPath = realPath.replace('\\', '/');
		if (realPath.charAt(realPath.length()-1) == '/') {
			realPath = realPath.substring(0, realPath.length()-1);
		}
		mpRet.put("realPath", realPath);
		
		_log.showDebug("-----------ReportAction initAction param: funid={0} printType={1} " +
				"whereSql={2} whereValue={3} whereType={4} realPath={5}", 
				funid, printType, whereSql, whereValue, whereType, realPath);
		
		return mpRet;
	}
	
	/**
	 * 取请求对象中的参数。
	 * @param req
	 * @param name
	 * @return
	 */
	private String getRequestValue(ServletRequest request, String name) {
		String val = request.getParameter(name);
		if (val == null) {
			val = (String) request.getAttribute(name);
			if (val == null) val = "";
		}
		
		return val;
	}
	
	/**
	 * 输出消息到前台
	 * @param response
	 * @param msg
	 */
	private void responseWrite(HttpServletResponse response, String msg) {
		try {
			response.getWriter().write(msg);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}

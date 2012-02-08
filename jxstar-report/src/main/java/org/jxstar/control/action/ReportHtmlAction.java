/*
 * ReportXlsUtil.java 2010-11-11
 * 
 * Copyright 2010 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
package org.jxstar.control.action;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jxstar.report.Report;
import org.jxstar.report.ReportException;
import org.jxstar.report.util.ReportFactory;

/**
 * 输出html报表Action类。
 *
 * @author TonyTan
 * @version 1.0, 2010-11-11
 */
public class ReportHtmlAction extends Action {
    
    @SuppressWarnings("unchecked")
    public void execute(HttpServletRequest request, HttpServletResponse response) {
        _log.showDebug("ReportHtmlAction.execute(): doing...");
        response.setContentType("text/html; charset=utf-8");

        //获取报表参数信息
        Map<String, Object> mpParam = (Map<String, Object>) request.getSession().getAttribute("reportParam");

        //判断报表参数信息是否为空
        if (mpParam == null || mpParam.isEmpty()) {
            _log.showDebug("输出html报表错误: 报表参数信息[reportParam]不能为空!");
            return;
        }

        //取报表定义对象
        Map<String,String> mpReport = (Map<String,String>) mpParam.get("report");
        //报表类型
        String reportType = mpReport.get("report_type");
        //报表自定义处理类
        String className = mpReport.get("custom_class");
        
        if (className.length() == 0) {
            className = ReportFactory.getReportHtml(reportType);
        }
        
        try {
            //创建报表处理实例
            Report report = ReportFactory.newInstance(className);
            
            //初始化报表对象
            report.initReport(mpParam);
                
            //构建报表输出对象
            String js = (String) report.output();
            _log.showDebug("------js=" + js);
            response.getWriter().println(js);
        
            response.getWriter().println("f_window_print();");
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ReportException e) {
            e.printStackTrace();
        }
    }
}

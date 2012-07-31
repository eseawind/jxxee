/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.report.total;

import java.util.Map;

import org.jxstar.control.action.RequestContext;
import org.jxstar.test.AbstractTest;
import org.jxstar.total.studio.TotalExecuteBO;
import org.jxstar.util.factory.FactoryUtil;
import org.jxstar.util.resource.JsParam;

/**
 * 二维动态统计报表测试类。
 *
 * @author TonyTan
 * @version 1.0, 2012-7-30
 */
public class TotalExecuteTest extends AbstractTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		init("d:/tomcat6/webapps/jxstar_ee");

		TotalExecuteBO exebo = new TotalExecuteBO();
		
		RequestContext request = createContext();
		exebo.exeTotal(request);
	}

	private static RequestContext createContext() {
		Map<String,Object> mp = FactoryUtil.newMap();
		String funid = "rpt_list";
		String code = "totalexe";
		String type = "grid";
		
		Map<String,String> user = FactoryUtil.newMap();
		user.put("user_code", "jxstar");
		user.put("user_id", "jxstar94888");
		
		//请求头部
		//mp.put(JsParam.KEYID, "tm6703025");
		//mp.put("fkValue", "tm6078704");
		mp.put(JsParam.EVENTCODE, code);
		mp.put(JsParam.PAGETYPE, type);
		mp.put(JsParam.FUNID, funid);
		mp.put(JsParam.REALPATH, "d:/Tomcat6/webapps/jxstar_ee");
		
		//请求参数值
		mp.put("end_date", "2012-07-30");
		mp.put("start_date", "2012-01-01");
		mp.put("rpt_funid", "mat_stat");
		
		RequestContext context = new RequestContext(mp);
		context.setFunID(funid);
		context.setEventCode(code);
		context.setPageType(type);
		context.setUserInfo(user);
		
		return context;
	}
}

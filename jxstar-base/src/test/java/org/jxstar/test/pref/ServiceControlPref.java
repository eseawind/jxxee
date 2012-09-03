/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.test.pref;

import java.util.Map;

import org.jxstar.control.action.RequestContext;
import org.jxstar.service.control.ServiceControllerImp;
import org.jxstar.test.base.TestBase;
import org.jxstar.util.factory.FactoryUtil;
import org.jxstar.util.resource.JsParam;

/**
 * 长事务做压力测试。
 *
 * @author TonyTan
 * @version 1.0, 2012-8-17
 */
public class ServiceControlPref extends TestBase {
	
	public ServiceControlPref(){
		//不需要启动事务
		this.hastran = false;
	}
	
	@Override
	protected boolean exeTest() {
		ServiceControllerImp ctl = new ServiceControllerImp();
		
		RequestContext context = createContext();
		boolean ret = ctl.execute(context);
		
		_log.showDebug("..........return: " + ret + "; message: " + context.getMessage());
		
		return true;
	}

	private static RequestContext createContext() {
		Map<String,Object> mp = FactoryUtil.newMap();
		String funid = "event_param";
		String code = "save_eg";
		String type = "editgrid";
		
		Map<String,String> user = FactoryUtil.newMap();
		user.put("user_code", "admin");
		user.put("user_id", "administor");
		
		//请求头部
		mp.put(JsParam.KEYID, "tm6703025");
		mp.put("fkValue", "tm6078704");
		mp.put(JsParam.EVENTCODE, code);
		mp.put(JsParam.PAGETYPE, type);
		mp.put(JsParam.FUNID, funid);
		mp.put(JsParam.REALPATH, "d:/Tomcat6/webapps/jxstar");
		
		//请求参数值
		mp.put("fun_event_param.param_type", "parameter");
		mp.put("fun_event_param.param_id", "tm6703025");
		mp.put("fun_event_param.invoke_id", "tm6078704");
		mp.put("fun_event_param.param_name", JsParam.FUNID);
		mp.put("fun_event_param.param_index", "1");
		mp.put("fun_event_param.param_value", "");
		mp.put("fun_event_param.param_memo", "AA");
		
		RequestContext context = new RequestContext(mp);
		context.setFunID(funid);
		context.setEventCode(code);
		context.setPageType(type);
		context.setUserInfo(user);
		
		return context;
	}

}

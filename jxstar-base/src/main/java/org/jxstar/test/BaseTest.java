/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.test;

import org.jxstar.util.log.Log;
import org.jxstar.util.system.SystemInitUtil;

/**
 * 项目中的测试基类，各种BO的测试类都需要继承BaseTest类，
 * 且必须覆盖setClassesPath、test方法，一般写执行BO方法的代码，示例代码：
 * public class MyBtnTest extends BaseTest {
 * 		
 * 		protected void setClassesPath() {
 * 			classesPath = "D:/tomcat6/webapps/xbgd/WEB-INF/classes/";
 * 		}
 * 		
 * 		protected void test()  {
 * 			MyBtnBO mybtn = new MyBtnBO();
 * 			mybtn.test();
 * 		}
 * }
 *
 * @author TonyTan
 * @version 1.0, 2012-2-8
 */
public class BaseTest {

	/**
	 * 全局变量，取系统配置文件路径，在setClassesPath方法设置值
	 */
	protected String classesPath = "";
	
	/**
	 * 初始化系统环境
	 */
	protected void init() {
		if (classesPath == null || classesPath.length() == 0) {
			System.out.println("classesPath属性为空，必须通过setClassesPath方法给classesPath赋值！");
			return;
		}
		
	    System.out.println("..........classes=" + classesPath);
        String configFile = "conf/server.xml";
        
        //加载日志配置
        String logFile = "conf/log.properties";
        Log.getInstance().init(classesPath, logFile);
        
        //加载系统配置
        SystemInitUtil.initSystem(classesPath, configFile, false);   
	}
	
	/**
	 * 在测试类中必须覆盖，写classesPath属性，一般写法如，写绝对路径：
	 * classesPath = "D:/tomcat6/webapps/jxstar/WEB-INF/classes/";
	 */
	protected void setClassesPath() {}
	
	/**
	 * 在测试类中必须覆盖，写测试方法。
	 */
	protected void test()  {}
	
	public static void main(String[] args) {
		BaseTest test = new BaseTest();
		
		test.setClassesPath();
		test.init();
		test.test();
	}

}

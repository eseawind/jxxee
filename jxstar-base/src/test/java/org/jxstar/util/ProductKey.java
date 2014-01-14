/*
 * Copyright(c) 2014 DongHong Inc.
 */
package org.jxstar.util;

import org.jxstar.security.Password;

/**
 * 执行此类，把生成加密串写入对应的系统变量中，重启服务器就会生效。
 * 服务器序列号，需要用户提供，点击系统变量功能的“读取序列号”按钮可以看到。
 *
 * @author TonyTan
 * @version 1.0, 2014-1-10
 */
public class ProductKey {

	public static void main(String[] args) {
		//控制在线用户数：把生成的加密串写入系统变量：license.user.num，表示最多在线用户数为9999
		String snum = "9999";
		createUser(snum);
		//控制产品试用期：把生成的加密串写入系统变量：license.user.endtime，表示试用期至2014-01-01
		String sdate = "2014-01-01";
		createDate(sdate);
		//检验服务器序列号：把生成的加密串写入系统变量：license.user.serial，如果试用期过期后系统会检查服务器序列号是否正确
		String serial = "41442F433D30443E3633383232442D3846";
		createSerial(serial);
	}
	
	private static void createUser(String snum) {
		String ss = Password.encodeNum(snum);
		System.out.println("用户数加密串：" + ss);
	}

	private static void createDate(String sdate) {
		String ss = Password.encrypt(sdate);
		System.out.println("试用期加密串：" + ss);
	}
	
	private static void createSerial(String serial) {
		String ss = Password.encrypt(serial);
		System.out.println("序列号加密串：" + ss);
	}
}

/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.security;

/**
 * 创建用户许可注册信息。
 *
 * @author TonyTan
 * @version 1.0, 2012-7-5
 */
public class UserLicense {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		String userNum = "9999";
		String s0 = Password.encodeNum(userNum);
		System.out.println(userNum + " encrypt= " + s0 + "||" + Password.decodeNum(s0));
		String endTime = "2022-01-01";
		String s1 = Password.encrypt(endTime);
		System.out.println(endTime + " encrypt= " + s1 + "||" + Password.decrypt(s1));
		String serial = "41462F4E493036513644413235412D3739";
		String s2 = Password.encrypt(serial);
		System.out.println(serial + " encrypt= " + s2 + "||" + Password.decrypt(s2));
	}

}

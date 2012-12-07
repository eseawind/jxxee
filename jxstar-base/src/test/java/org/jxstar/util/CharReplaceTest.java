/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.util;

import java.util.Date;

/**
 * 比较用字符串替换与字符拼接的效率。
 * 第一种方法比第二种方法快10倍。
 *
 * @author TonyTan
 * @version 1.0, 2012-12-7
 */
public class CharReplaceTest {

	public static void main(String[] args) {
		long n1 = (new Date()).getTime();
		String other, val = "生成需要\\我的知识'，每次都\r\n不知道！\"\"好好的！";
		System.out.println("val=" + val);
		
		for (int i = 0; i < 100000; i++) {
			other = strForJson(val);
			if (i == 0) {
				System.out.println("val1=" + other);
			}
		}
		long n2 = (new Date()).getTime();
		System.out.println("time1=" + (n2-n1));

		for (int i = 0; i < 100000; i++) {
			other = strForJson1(val);
			if (i == 0) {
				System.out.println("val2=" + other);
			}
		}
		long n3 = (new Date()).getTime();
		System.out.println("time2=" + (n3-n2));
	}
	
	public static String strForJson(String strVal) {
		StringBuilder sbstr = new StringBuilder();
		for (int i = 0, n = strVal.length(); i < n; i++) {
			char ch = strVal.charAt(i);
			if (ch == '\\') {
				sbstr.append("\\\\");
			} else if (ch == '\r') {
				sbstr.append("\\r");
			} else if (ch == '\n') {
				sbstr.append("\\n");
			} else if (ch == '\'') {
				sbstr.append("\\'");
			} else if (ch == '"') {
				sbstr.append("\\'");
			} else {
				sbstr.append(ch);
			}
		}
		
		return sbstr.toString();
	}
	
	public static String strForJson1(String strVal) {
		strVal = strVal.replaceAll("\\\\", "\\\\\\\\");
		strVal = strVal.replaceAll("\r", "\\\\r");
		strVal = strVal.replaceAll("\n", "\\\\n");
		strVal = strVal.replaceAll("'", "\\\\'");
		strVal = strVal.replaceAll("\"", "\\\\'");
		
		return strVal;
	}
}

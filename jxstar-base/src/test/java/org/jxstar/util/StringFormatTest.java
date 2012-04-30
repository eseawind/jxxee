/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.util;

import java.text.DecimalFormat;

/**
 * 字符串格式转换方法测试。
 *
 * @author TonyTan
 * @version 1.0, 2012-4-23
 */
public class StringFormatTest {

	public static void main(String[] args) {
		strToNum(6);
		strToNum(2);
		strToInt();
		strToCur(2);
	}

	private static void strToNum(int len) {
		String value = "42.7890";
		String value1 = "-22.3300";
		String value2 = "32";
		String value3 = "-12";
		
		hint(value+"="+StringFormat.StringToNumber(value, len));
		hint(value1+"="+StringFormat.StringToNumber(value1, len));
		hint(value2+"="+StringFormat.StringToNumber(value2, len));
		hint(value3+"="+StringFormat.StringToNumber(value3, len));
	}
	
	private static void strToInt() {
		String value = "42.7890";
		String value1 = "-22.3300";
		//String value2 = "32";
		//String value3 = "-12";
		
		hint(value+"="+StringFormat.StringToInteger(value));
		hint(value1+"="+StringFormat.StringToInteger(value1));
	}
	
	private static void strToCur(int len) {
		DecimalFormat decformat = new DecimalFormat("###,###.##");
		
		double value = 234123442.7890;
		double value1 = -23423422.3300;
		double value2 = 2342432;
		double value3 = -13412;
		
		hint(value+"="+decformat.format(value));
		hint(value1+"="+decformat.format(value1));
		hint(value2+"="+decformat.format(value2));
		hint(value3+"="+decformat.format(value3));
	}
	
	private static void hint(String str) {
		System.out.println(str);
	}
}

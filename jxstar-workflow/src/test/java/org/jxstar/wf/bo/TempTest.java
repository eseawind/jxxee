/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.wf.bo;

import java.util.regex.Pattern;

/**
 * 临时测试类。
 *
 * @author TonyTan
 * @version 1.0, 2012-4-11
 */
public class TempTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		String value = "0:5";
		String regex = "([0-9]+):([0-9]|[0-5][0-9])";
		Pattern p = Pattern.compile(regex);
		System.out.println(value + "=" + p.matcher(value).matches());

	}

}

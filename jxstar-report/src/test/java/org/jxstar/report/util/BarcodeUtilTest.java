/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.report.util;



/**
 * 条码打印测试。
 *
 * @author TonyTan
 * @version 1.0, 2012-6-15
 */
public class BarcodeUtilTest {
	
	public static void main(String[] args) {
		byte[] datas = JxBarcodeUtil.createBarcode("89123724");
		JxBarcodeUtil.saveFile("d:/my.png", datas);
	}

}

/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.report.studio;

import org.jxstar.test.AbstractTest;

/**
 * 导入模板测试。
 *
 * @author TonyTan
 * @version 1.0, 2012-6-13
 */
public class XlsToHtmlBOTest extends AbstractTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		String path = "D:/works/jxstar/jxstar-webapp/src/main/webapp";
		init(path);
		
		XlsToHtmlBO tpl = new XlsToHtmlBO();
		byte[] datas = tpl.loadHtml("jxstar198117", path);
		
		System.out.println("............datas=" + new String(datas));
	}

}

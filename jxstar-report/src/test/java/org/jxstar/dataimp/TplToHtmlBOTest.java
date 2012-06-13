/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.dataimp;

import org.jxstar.test.AbstractTest;

/**
 * 加载数据导入模板类测试。
 *
 * @author TonyTan
 * @version 1.0, 2012-6-12
 */
public class TplToHtmlBOTest extends AbstractTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		String path = "D:/works/jxstar/jxstar-webapp/src/main/webapp";
		init(path);
		
		TplToHtmlBO tpl = new TplToHtmlBO();
		byte[] datas = tpl.loadHtml("jxstar1111", path);
		
		System.out.println("............datas=" + new String(datas));
	}

}

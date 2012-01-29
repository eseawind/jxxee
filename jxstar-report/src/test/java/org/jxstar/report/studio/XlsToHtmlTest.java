/*
 * XlsToHtmlTest.java 2010-11-12
 * 
 * Copyright 2010 Guangzhou Donghong Software Technology Inc.
 * Licensed under the GNU GPL Version 3.0
 */
package org.jxstar.report.studio;


import org.jxstar.report.ReportException;
import org.jxstar.report.util.XlsToHtml;
import org.jxstar.test.AbstractTest;

/**
 * 
 *
 * @author TonyTan
 * @version 1.0, 2010-11-12
 */
public class XlsToHtmlTest extends AbstractTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		XlsToHtml xls = new XlsToHtml();
		try {
			xls.parserXls("d:/grid.xls");
		} catch (ReportException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}

package org.jxstar.report.studio;


import org.jxstar.report.studio.ReportInfoBO;
import org.jxstar.test.AbstractTest;

public class ReportInfoTest extends AbstractTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		ReportInfoBO info = new ReportInfoBO();
		info.createReport("run_malrecord", "grid", "DongHong");
		//info.createReport("run_malrecord", "form", "DongHong");
	}

}

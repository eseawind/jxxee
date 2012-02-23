/*
 * LicenseCreator.java 2011-4-2
 * 
 * Copyright 2010 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */

package org.jxstar.security;




/**
 * 安全许可相关测试类。
 *
 * @author TonyTan
 * @version 1.0, 2011-4-2
 */
public class LicenseCreator {

	public static void main(String[] args) {
		writeFile();
	}

	public static void writeFile() {
		SafeManager mng = SafeManager.getInstance();
		
		License lic = new License();
		lic.productName = SafeUtil.decode("东宏软件开发平台");
		lic.versionNo = SafeUtil.decode("V1.0");
		lic.customer = SafeUtil.decode("广州正泰西部管道项目");
		lic.userNum = SafeUtil.decode("10");
		lic.developer = SafeUtil.decode("广州市东宏软件科技有限公司");
		lic.website = SafeUtil.decode("www.jxstar.org");
		
		lic.tmpStart = SafeUtil.decode("2012-02-22 16:53:02");
		lic.tmpEnd = SafeUtil.decode("2012-07-22 16:53:02");
		lic.tmpValid = SafeUtil.decode("1");
		
		lic.dogStart = SafeUtil.decode("2010-11-30 12:10:10");
		lic.dogEnd = SafeUtil.decode("2022-02-30 12:10:10");
		lic.dogValid = SafeUtil.decode("1");
		
		mng.writeLicense(lic);
		
		System.out.println("--writeFile=" + lic);
	}
}
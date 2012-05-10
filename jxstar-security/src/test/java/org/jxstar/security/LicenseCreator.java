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
		lic.developer = SafeUtil.decode("广州市东宏软件科技有限公司");
		lic.website = SafeUtil.decode("www.jxstar.org");
		lic.productName = SafeUtil.decode("东宏软件开发平台");
		lic.versionNo = SafeUtil.decode("V1.0.0.0");
		lic.versionType = SafeUtil.decode("EE");
		lic.customer = SafeUtil.decode("广州市东宏软件科技有限公司");
		lic.serialNum = SafeUtil.decode("10");
		
		lic.tmpStart = SafeUtil.decode("2012-02-22 16:53:02");
		lic.tmpEnd = SafeUtil.decode("2012-06-22 16:53:02");
		lic.tmpValid = SafeUtil.decode("1");
		
		lic.serialNo = SafeUtil.decode("1");
		lic.serialValid = SafeUtil.decode("1");
		
		mng.writeLicense(lic);
		
		System.out.println("--writeFile=" + lic);
	}
}

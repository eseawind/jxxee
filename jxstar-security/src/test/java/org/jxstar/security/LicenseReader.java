/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.security;

/**
 * 
 *
 * @author TonyTan
 * @version 1.0, 2012-3-23
 */
public class LicenseReader {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		readFile();
	}

	public static void readFile() {
		SafeManager mng = SafeManager.getInstance();
		License lic = mng.readLicense();
		
		String str = "productName: " + SafeUtil.encode(lic.productName) + ";\n";
		str += "versionNo: " + SafeUtil.encode(lic.versionNo) + ";\n";
		str += "customer: " + SafeUtil.encode(lic.customer) + ";\n";
		str += "userNum: " + SafeUtil.encode(lic.userNum) + ";\n";
		str += "developer: " + SafeUtil.encode(lic.developer) + ";\n";
		str += "website: " + SafeUtil.encode(lic.website) + ";\n";
		str += "tmpStart: " + SafeUtil.encode(lic.tmpStart) + ";\n";
		str += "tmpEnd: " + SafeUtil.encode(lic.tmpEnd) + ";\n";
		str += "tmpValid: " + SafeUtil.encode(lic.tmpValid) + ";\n";
		str += "dogStart: " + SafeUtil.encode(lic.dogStart) + ";\n";
		str += "dogEnd: " + SafeUtil.encode(lic.dogEnd) + ";\n";
		str += "dogValid: " + SafeUtil.encode(lic.dogValid) + ";\n";
		
		System.out.println("--readFile=" + str);
	}
}

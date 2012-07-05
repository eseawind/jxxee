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
		License lic = mng.readLicense("d:/license.dat");
		
		String str = "";
		str += "developer: " + SafeUtil.encode(lic.developer) + ";\n";
		str += "website: " + SafeUtil.encode(lic.website) + ";\n";
		str += "productName: " + SafeUtil.encode(lic.productName) + ";\n";
		str += "versionNo: " + SafeUtil.encode(lic.versionNo) + ";\n";
		str += "versionType: " + SafeUtil.encode(lic.versionType) + ";\n";
		str += "customer: " + SafeUtil.encode(lic.customer) + ";\n";
		str += "serialNum: " + SafeUtil.encode(lic.serialNum) + ";\n";
		
		str += "tmpStart: " + SafeUtil.encode(lic.tmpStart) + ";\n";
		str += "tmpEnd: " + SafeUtil.encode(lic.tmpEnd) + ";\n";
		str += "tmpValid: " + SafeUtil.encode(lic.tmpValid) + ";\n";
		
		str += "serialNo: " + SafeUtil.encode(lic.serialNo) + ";\n";
		str += "serialValid: " + SafeUtil.encode(lic.serialValid) + ";\n";
		
		str += "funNum: " + SafeUtil.encode(lic.funNum) + ";\n";
		str += "flowNum: " + SafeUtil.encode(lic.flowNum) + ";\n";
		str += "userNum: " + SafeUtil.encode(lic.userNum) + ";\n";
		
		System.out.println("--readFile=\n" + str);
	}
}

/*
 * SafeManager.java 2011-4-2
 * 
 * Copyright 2010 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */

package org.jxstar.security;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInput;
import java.io.ObjectInputStream;
import java.io.ObjectOutput;
import java.io.ObjectOutputStream;
import java.util.Calendar;
import java.util.Date;

import org.jxstar.util.DateUtil;
import org.jxstar.util.config.SystemVar;


/**
 * 安全管理工具类。
 *
 * @author TonyTan
 * @version 1.0, 2011-4-2
 */
public class SafeManager {
	private static SafeManager _instance = new SafeManager();
	//单例，私有构造函数
	private SafeManager(){}
	
	public static SafeManager getInstance() {
		return _instance;
	}
	
	/**
	 * 检测系统是否合法，检测方法：
	 * 先检测许可文件为合法的，则系统合法；
	 * 否则再检测软件狗是否合法，判断系统是否合法；
	 * @return
	 */
	public int validCode() {
		Date curDate = Calendar.getInstance().getTime();
		return validCode(curDate);
	}
	
	/**
	 * 根据指定时间检验许可是否合法
	 * @param curDate -- 指定时间
	 * @return
	 */
	public int validCode(Date curDate) {
		return getCode(curDate);
	}
	
	/**
	 * 避免替换类方法
	 * @return
	 */
	public int checkCode() {
		Date curDate = Calendar.getInstance().getTime();
		return getCode(curDate);
	}

	/**
	 * 创建新的许可文件
	 * @param lic -- 许可对象
	 */
	public boolean writeLicense(License lic) {
		//取输出文件的路径
		String path = SystemVar.getValue("license.create.path", "d:/");
		
		path += "license.dat";
		
		return writeLicense(lic, path);
	}
	
	/**
	 * 读取许可文件
	 * @return
	 */
	public License readLicense() {
		//取输出文件的路径
		String path = SystemVar.getValue("license.create.path", "d:/");
		
		path += "license.dat";
		
		return readLicense(path);
	}
	
	/**
	 * 检测软件狗是否合法，判断方法是：
	 * 先检查合法标志，如果不合法，则返回false；
	 * 再检查当前时间是否超过结束时间，如果超过，则返回false。
	 * 
	 * 通过后台任务定时检查服务器的狗，如果检测到，则延长结束时间，否则修改为非法；
	 * 
	 * @param lic -- 许可对象
	 * @param curDate -- 当前时间
	 * @return
	 */
	public int validDog(License lic, Date curDate) {
		if (lic == null) {
			return 200;
		}
		if (SafeUtil.encode(lic.dogValid).length() == 0) {
			return 201;
		}
		if (SafeUtil.encode(lic.dogValid).equals("0")) {
			return 202;
		}
		if (SafeUtil.encode(lic.dogEnd).length() == 0) {
			return 203;
		}
		
		Calendar end = DateUtil.strToCalendar(SafeUtil.encode(lic.dogEnd));
		//如果当前时间超过了结束时间，则算无效
		if (curDate.compareTo(end.getTime()) > 0) {
			return 204;
		}
		
		return 0;
	}
	
	/**
	 * 判断临时许可文件是否合法，判断方法是：
	 * 先检查合法标志，如果不合法，则返回false；
	 * 再检查当前时间是否超过结束时间，如果超过，则返回false。
	 * 
	 * 为防止用户修改服务器的时间，则定时通过后台任务比较网络时间与许可结束时间，如果超过，则修改合法标志为0。
	 * 
	 * @param lic -- 许可对象
	 * @param curDate -- 当前时间
	 * @return
	 */
	public int validTmp(License lic, Date curDate) {
		if (lic == null) {
			return 100;
		}
		if (SafeUtil.encode(lic.tmpValid).length() == 0) {
			return 101;
		}
		if (SafeUtil.encode(lic.tmpValid).equals("0")) {
			return 102;
		}
		if (SafeUtil.encode(lic.tmpEnd).length() == 0) {
			return 103;
		}
		
		Calendar end = DateUtil.strToCalendar(SafeUtil.encode(lic.tmpEnd));
		//如果当前时间超过了结束时间，则算无效
		if (curDate.compareTo(end.getTime()) > 0) {
			return 104;
		}
		
		return 0;
	}
	
	/**
	 * 修改系统许可文件中的dogValid值
	 * @param valid -- 1表示合法，0表示非法
	 */
	public void setDogValid(String valid) {
		License lic = readLicense("");
		if (lic != null) {
			lic.dogValid = SafeUtil.decode(valid);
			writeLicense(lic, "");
		}
	}
	
	/**
	 * 修改系统许可文件中的dogEnd值
	 * @param dogEnd
	 */
	public void setDogEnd(String dogEnd) {
		License lic = readLicense("");
		if (lic != null) {
			lic.dogEnd = SafeUtil.decode(dogEnd);
			writeLicense(lic, "");
		}
	}
	
	/**
	 * 获取许可有效结束时间
	 * @return
	 */
	public String getEndTime() {
		License lic = readLicense("");
		if (lic != null) {
			return SafeUtil.encode(lic.tmpEnd);
		}
		return "";
	}
	
	/**
	 * 修改系统许可文件中的tmpValid值
	 * @param valid -- 1表示合法，0表示非法
	 */
	public void setTmpValid(String valid) {
		License lic = readLicense("");
		if (lic != null) {
			lic.tmpValid = SafeUtil.decode(valid);
			writeLicense(lic, "");
		}
	}
	
	//取许可校验代码
	private int getCode(Date curDate) {
		License lic = readLicense("");
		if (lic == null) return 999;
		
		int code = validTmp(lic, curDate);
		//检测许可文件是否合法
		if (code > 0) {
			setTmpValid("0");	//修改临时许可为非法标志
			return code;
		}
		
		//检测软件狗是否合法
		/*code = validDog(lic, curDate);
		if (code > 0) {
			setDogValid("0");	//修改软件狗为非法标志
			return code;
		}*/
		
		return 0;
	}
	
	/**
	 * 取出系统许可文件，生成License对象
	 * @return
	 */
	private License readLicense(String path) {
		if (path == null || path.length() == 0) {
			path = SystemVar.REALPATH + "/WEB-INF/classes/license.dat";
		}
		
		ObjectInput in = null;
		try {
			in = new ObjectInputStream(new FileInputStream(path));
			
			return (License) in.readObject();
		} catch (Exception e) {
			//e.printStackTrace();
			System.out.println(e.getMessage());
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (IOException e) {
					//e.printStackTrace();
					System.out.println(e.getMessage());
				}
			}
		}
		
		return null;
	}
	
	/**
	 * 写许可文件
	 * @param lic -- 许可对象
	 * @param path -- 文件路径
	 */
	private boolean writeLicense(License lic, String path) {
		if (path == null || path.length() == 0) {
			path = SystemVar.REALPATH + "/WEB-INF/classes/license.dat";
		}
		
		ObjectOutput out = null;
		try {
			out = new ObjectOutputStream(new FileOutputStream(path));
			
			out.writeObject(lic);
			return true;
		} catch (Exception e) {
			//e.printStackTrace();
			System.out.println(e.getMessage());
		} finally {
			if (out != null) {
				try {
					out.close();
				} catch (IOException e) {
					//e.printStackTrace();
					System.out.println(e.getMessage());
				}
			}
		}
		
		return false;
	}
}

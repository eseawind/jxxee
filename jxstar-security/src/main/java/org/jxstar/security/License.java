/*
 * License.java 2011-4-2
 * 
 * Copyright 2010 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */

package org.jxstar.security;

import java.io.Serializable;

/**
 * 许可信息文件。
 *
 * @author TonyTan
 * @version 1.0, 2011-4-2
 */
public class License implements Serializable {
	private static final long serialVersionUID = -9054394433259732244L;
	//公共信息
	public int[] productName;	//产品名称，如：东宏软件开发平台
	public int[] versionNo;		//版本号，如：V1.0
	public int[] customer;		//客户名称，如：中国石油公司
	public int[] userNum;		//控制用户数，如：10
	public int[] developer;		//开发商，如：广州市东宏软件科技有限公司
	public int[] website;		//开发商网址，如：www.dhsdp.com
	//临时许可的有效信息
	public int[] tmpStart;		//有效开始时间，初始写入，如：2010-11-30 12:10:10
	public int[] tmpEnd;		//有效结束时间，初始写入，如：2011-02-30 12:10:10
	public int[] tmpValid;		//合法标志，如：1，由后台任务定时检查超过结束时间时修改值为0
	//软件狗的有效信息
	public int[] dogStart;		//有效开始时间，动态写入当前时间
	public int[] dogEnd;		//有效结束时间，动态写入一天后的时间
	public int[] dogValid;		//合法标志，动态写入，缺省为1
}

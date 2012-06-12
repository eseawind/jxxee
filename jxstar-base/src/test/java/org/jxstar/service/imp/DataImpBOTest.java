/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.service.imp;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.Map;

import org.jxstar.test.AbstractTest;
import org.jxstar.util.factory.FactoryUtil;

/**
 * 数据导入测试类。
 *
 * @author TonyTan
 * @version 1.0, 2012-6-12
 */
public class DataImpBOTest extends AbstractTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		init("D:/works/jxstar/jxstar-webapp/src/main/webapp");

		DataImpBO impbo = new DataImpBO();
		String funId = "mat_app";
		String fkValue = "";
		Map<String,String> userInfo = FactoryUtil.newMap(); 
		userInfo.put("user_id", "tanh007");
		userInfo.put("user_name", "谭浩");
		
		FileInputStream ins = null;
		try {
			ins = new FileInputStream(new File("d:/tpl_mat_app.csv"));
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		impbo.dataImp(ins, funId, fkValue, userInfo);
	}

}

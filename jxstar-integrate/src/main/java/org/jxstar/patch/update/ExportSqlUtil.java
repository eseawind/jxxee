/*
 * ExportSqlUtil.java 2012-3-15
 * 
 * Copyright 2010 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
package org.jxstar.patch.update;

import java.io.File;
import java.util.List;
import java.util.Map;

import org.jxstar.dao.BaseDao;
import org.jxstar.dao.DaoParam;
import org.jxstar.util.factory.FactoryUtil;

/**
 * 导出SQL用的工具类。
 *
 * @author TonyTan
 * @version 1.0, 2012-3-15
 */
public class ExportSqlUtil {
	private static BaseDao _dao = BaseDao.getInstance();
	
	/**
	 * 取一个模块的所有功能ID
	 * @param moduleId -- 模块ID
	 * @return
	 */
	public static List<String> moduleFunId(String moduleId) {
		List<String> lsRet = FactoryUtil.newList();
		
		String sql = "select fun_id from fun_base where module_id like ? order by fun_index";
		DaoParam param = _dao.createParam(sql);
		param.addStringValue(moduleId + "%");
		
		List<Map<String, String>> lsData = _dao.query(param);
		for (Map<String, String> mpData : lsData) {
			lsRet.add(mpData.get("fun_id"));
		}
		
		return lsRet;
	}
	
	/**
	 * 取文件路径下面的文件
	 * @return
	 */
	public static String[] listFileNames(String path) {
		String[] rets = new String[0];
		
		File df = new File(path);
		if (df.isDirectory()) {
			rets = df.list();
		}
		
		return rets;
	}

}

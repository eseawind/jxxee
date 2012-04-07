/*
 * UpdatePageBO.java 2012-3-15
 * 
 * Copyright 2010 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
package org.jxstar.patch.update;

import org.jxstar.dao.util.BigFieldUtil;
import org.jxstar.service.BusinessObject;
import org.jxstar.util.FileUtil;

/**
 * 保存页面设计文件到数据库中。
 *
 * @author TonyTan
 * @version 1.0, 2012-3-16
 */
public class UpdatePageBO extends BusinessObject {
	private static final long serialVersionUID = 1L;
	
	/**
	 * 更新设计文件到数据库中
	 * @param path
	 */
	public void update(String path) {
		//找到设计文件路径下面的文件
		String[] names = ExportSqlUtil.listFileNames(path);
		
		//更新到数据表中
		for (String name : names) {
			_log.showDebug(".............update " + name + " ...");
			String[] ns = name.split("\\.");
			if (ns.length == 3) {
				String sql = "update fun_design set page_content = ? where design_id = '"+ ns[1] +"'";
				String data = FileUtil.readFileUtf8(path + name);
				_log.showDebug(".............update sql=" + sql);
				//_log.showDebug(".............update data=" + data);
				
				BigFieldUtil.updateStream(sql, data, "");
			}
			_log.showDebug(".............update " + name + " end.");
		}
	}
}

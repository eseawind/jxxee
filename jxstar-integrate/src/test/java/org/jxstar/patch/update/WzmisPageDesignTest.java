/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.patch.update;

import java.util.List;
import java.util.Map;

import org.jxstar.dao.BaseDao;
import org.jxstar.dao.DaoParam;
import org.jxstar.dao.util.BigFieldUtil;
import org.jxstar.test.AbstractTest;
import org.jxstar.util.FileUtil;
import org.jxstar.util.MapUtil;

/**
 * 用于保存于更新WZMIS系统中的设计文件用。
 *
 * @author TonyTan
 * @version 1.0, 2012-3-16
 */
public class WzmisPageDesignTest extends AbstractTest {
	//文件保存路径
	private static String _save_path = "d:/update/";
	
	public static void main(String[] args) {
		init("D:\\tomcat6\\webapps\\jxstar_ee");
		
		saveBlob();
	}
	
	//保存设计文件
	public static void saveBlob() {
		BaseDao _dao = BaseDao.getInstance();
		
		String keyName = "designpage_id";
		String tableName = "system_designpage";
		String blobName = "page_content";
		String sql = "select designpage_id from system_designpage where fun_id in " +
		"(select fun_id from bs_function where module_id like '10111009%' or module_id like '10111011%')";
		
		DaoParam param = _dao.createParam(sql);
		List<Map<String,String>> lsKey = _dao.query(param);
		
		for (Map<String,String> mpKey : lsKey) {
			String keyId = MapUtil.getValue(mpKey, keyName);
			if (keyId.length() == 0) continue;
			
			String querySql = "select * from "+tableName+" where "+ keyName +"='"+keyId+"'";
			
			String blobValue = BigFieldUtil.readStream(querySql, blobName, "");
			
			String fileName = _save_path + tableName + "/" + tableName + "." + keyId + ".txt";
			FileUtil.saveFileUtf8(fileName, blobValue);
		}
	}
	//更新设计文件
	public static void updateBlob() {
		UpdatePageBO page = new UpdatePageBO();
		page.update(_save_path + "/system_designpage/");
	}
}

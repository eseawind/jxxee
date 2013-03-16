/*
 * Copyright(c) 2013 Donghong Inc.
 */
package org.jxstar.patch.update;

import java.util.List;
import java.util.Map;

import org.jxstar.dao.BaseDao;
import org.jxstar.dao.DaoParam;
import org.jxstar.test.AbstractTest;
import org.jxstar.util.FileUtil;

/**
 * 导出所有表的数据，并导入大字段数据。
 *
 * @author TonyTan
 * @version 1.0, 2013-3-12
 */
public class ExpTableTest extends AbstractTest {
	private static BaseDao _dao = null;
	
	public static void main(String[] args) {
		init();
		test();
	}

	public static void test() {
		_dao = BaseDao.getInstance();
		InsertSqlBO sqlbo = new InsertSqlBO();
		StringBuilder sbInsert = new StringBuilder();
		
		String sql = "select table_name from dm_table where table_type <> '9'";
		DaoParam param = _dao.createParam(sql);
		List<Map<String,String>> lsData = _dao.query(param);
		for (Map<String,String> mpData : lsData) {
			String tableName = mpData.get("table_name");
			sbInsert.append(sqlbo.tableExpSql(tableName));
		}
		
		FileUtil.saveFile("d:/expdata.sql", sbInsert.toString());
	}
}

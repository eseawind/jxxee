/*
 * Copyright(c) 2013 DongHong Inc.
 */
package org.jxstar.dm;

import java.util.List;
import java.util.Map;

import org.jxstar.dao.BaseDao;
import org.jxstar.dao.DaoParam;
import org.jxstar.dm.ddl.OracleDmParser;
import org.jxstar.test.AbstractTest;
import org.jxstar.util.factory.FactoryUtil;
import org.jxstar.util.log.Log;

/**
 * 简单的链接数据库的测试类。
 *
 * @author TonyTan
 * @version 1.0, 2013-11-21
 */
public class DBtest extends AbstractTest {
	//日志对象
	private static Log _log = Log.getInstance();
	//模板解析对象
	private static DmParser _parser = null;
	//字段解析对象
	//private static DdlField _fieldObj = null;
	//索引解析对象
	private static DdlIndex _indexObj = null;
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		init("C:\\D\\docs\\我的项目\\东风商用车\\SVNDB\\40程序文件\\app");
		initdb();
		
		try {
			buildsql();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static void buildsql() throws Exception {
		BaseDao _dao = BaseDao.getInstance();
		
		List<String> lssql = FactoryUtil.newList();
		DaoParam param = _dao.createParam("select * from dm_tablecfg where table_name <> 'sys_field'");
		List<Map<String,String>> lsTable = _dao.query(param);
		
		for (Map<String,String> mpTable : lsTable) {
			_log.showDebug("..........table=" + mpTable.get("table_name"));
			
			//取创建主键SQL
			lssql.add(_indexObj.buildKey(mpTable));
			//取创建索引SQL
			lssql.addAll(_indexObj.buildIndexs(mpTable));
		}
		
		_log.showDebug("create table sql:" + lssql.toString());
	}
	
	/**
	 * 初始化全局对象
	 */
	public static void initdb() {
		//创建ORACLE模板解析类
		_parser = new OracleDmParser();
		//创建字段解析对象
		//_fieldObj = new DdlField(_parser);
		//创建索引解析对象
		_indexObj = new DdlIndex(_parser);
	}
}

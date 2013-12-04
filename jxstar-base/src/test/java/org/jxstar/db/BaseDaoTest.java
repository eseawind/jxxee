/*
 * BaseDaoTest.java 2010-12-17
 * 
 * Copyright 2010 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
package org.jxstar.db;

import java.util.Map;

import org.jxstar.dao.BaseDao;
import org.jxstar.dao.DaoParam;
import org.jxstar.dao.transaction.TransactionException;
import org.jxstar.dao.transaction.TransactionManager;
import org.jxstar.dao.util.BigFieldUtil;
import org.jxstar.test.AbstractTest;
import org.jxstar.util.factory.SystemFactory;

/**
 * 
 *
 * @author TonyTan
 * @version 1.0, 2010-12-17
 */
public class BaseDaoTest extends AbstractTest {
	private static BaseDao _dao = null;
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		init();
		_dao = BaseDao.getInstance();
		
		test2();
	}
	
	public static void test1() {
		TransactionManager _tranMng = (TransactionManager) SystemFactory.createSystemObject("TransactionManager");
		//开始一个事务
		_tranMng.startTran();
		try {
			DaoParam param = _dao.createParam("update dm_tablecfg set table_title = table_title||'12' where table_name = 'mat_app' ");
			_dao.update(param);
			
			DaoParam param1 = _dao.createParam("select table_title from dm_tablecfg where table_name = 'mat_app' ");
			Map<String,String> mp = _dao.queryMap(param1);
			System.out.println("table_title=" + mp.get("table_title"));
			_tranMng.commitTran();
		} catch (TransactionException e) {
			e.printStackTrace();
		}
	}
	
	public static void test2() {
		DaoParam param1 = _dao.createParam("select news_id, news_title, news_cont from sys_news  ");
		Map<String,String> mp = _dao.queryMap(param1);
		System.out.println("news_title=" + mp.get("news_title"));
		System.out.println("news_cont=" + mp.get("news_cont"));
	}
	
	public static void test3() {
		String sql = "select news_cont from sys_news where news_id = 'jxstar74451'";
		String cont = BigFieldUtil.readStream(sql, "news_cont", "");
		System.out.println("news_cont=" + cont);
	}
}

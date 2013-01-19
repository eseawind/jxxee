package org.jxstar.db;

import java.util.Map;

import org.jxstar.dao.BaseDao;
import org.jxstar.dao.DaoParam;
import org.jxstar.dao.transaction.TransactionException;
import org.jxstar.dao.transaction.TransactionManager;
import org.jxstar.test.AbstractTest;
import org.jxstar.util.factory.SystemFactory;

/**
 * 测试普通查询的连接释放情况；基于平台事务的连接释放情况；
 * 单数据源连接报错时的连接释放情况；多数据源连接报错时的连接释放情况；
 *
 * @author TonyTan
 * @version 1.0, 2013-1-19
 */
public class TransactionTest {
	private static BaseDao _dao = null;
	
	public static void main(String[] args) {
		AbstractTest.init("d:/tomcat6/webapps/jxstar_zc");

		boolean hastran = false;
		_dao = BaseDao.getInstance();
		TransactionManager _tranMng = (TransactionManager) SystemFactory
		.createSystemObject("TransactionManager");
		try {
			if (hastran) _tranMng.startTran();
			
			boolean bret = exeTest();
			print("-------bret:" + bret);
			if (hastran) {
				if (bret) {
					_tranMng.commitTran();
				}
				else {
					_tranMng.rollbackTran();
				}
			}
		} catch (TransactionException e) {
			e.printStackTrace();
			
			try {
				if (hastran) _tranMng.rollbackTran();
			} catch (TransactionException e1) {
				e1.printStackTrace();
			}
		}
	}
	
	public static boolean exeTest() {
		boolean ret = true;
		ret = ret && queryMySql();
		ret = ret && updateMySql();
		ret = ret && queryOracle();
		ret = ret && updateOracle();
		return ret;
	}
	
	public static boolean queryMySql() {
		String sql = "select count(*) as cnt from fun_base";
		DaoParam param = _dao.createParam(sql);
		Map<String,String> mp = _dao.queryMap(param);
		String cnt = mp.get("cnt");
		print("-------query mysql:" + cnt);
		return !cnt.equals("0");
	}
	
	public static boolean updateMySql() {
		String sql = "update mat_app set app_user = '刘丽33' where app_id = 'jxstar4744'";
		DaoParam param = _dao.createParam(sql);
		return _dao.update(param);
	}
	
	public static boolean queryOracle() {
		String sql = "select count(*) as cnt from fun_base";
		DaoParam param = _dao.createParam(sql);
		param.setDsName("default_ora");
		Map<String,String> mp = _dao.queryMap(param);
		String cnt = mp.get("cnt");
		print("-------query oralce:" + cnt);
		return !cnt.equals("0");
	}
	
	public static boolean updateOracle() {
		String sql = "update mat_app set app_user = '刘丽33' where app_id = 'jxstar4744'";
		DaoParam param = _dao.createParam(sql);
		param.setDsName("default_ora");
		return _dao.update(param);
	}
	
	public static void print(String info) {
		System.out.println(info);
	}
}

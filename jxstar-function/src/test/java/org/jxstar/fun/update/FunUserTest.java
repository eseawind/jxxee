/*
 * Copyright(c) 2013 Donghong Inc.
 */
package org.jxstar.fun.update;

import java.sql.Connection;

import org.jxstar.dao.BaseDao;
import org.jxstar.dao.DaoParam;
import org.jxstar.dao.pool.DataSourceConfig;
import org.jxstar.dao.pool.DataSourceConfigManager;
import org.jxstar.dao.pool.PooledConnection;
import org.jxstar.security.Password;
import org.jxstar.test.AbstractTest;

/**
 * 清除许可信息的类。
 *
 * @author TonyTan
 * @version 1.0, 2013-9-6
 */
public class FunUserTest extends AbstractTest {
	public static String DSNAME = "funuser";
	
	//jxstar_info_log(info_id, info_ip, add_date)
	//jxstar_info(info_id, info_os, info_jvm, info_ip, info_org, info_ver, info_lic, add_date)
	public static void delInfo() {
		BaseDao _dao = BaseDao.getInstance();
		String sql = "delete from jxstar_info_log";
		DaoParam param = _dao.createParam(sql);
		param.setDsName("funuser");
		param.setUseTransaction(false);
		boolean ret = _dao.update(param);
		System.out.println("........jxstar_info_log=" + ret);
		
		param.setSql("delete from jxstar_info");
		ret = _dao.update(param);
		System.out.println("........jxstar_info=" + ret);
	}

	public static void main(String[] args) {
		//删除所有记录，第二天留下的就是生产服务器中的程序。
		boolean bi = initMysql();
		System.out.println("........connect success=" + bi);
		
		delInfo();
	}

	public static boolean initMysql() {
		String param = "useUnicode=true&characterEncoding=UTF-8&useOldAliasMetadataBehavior=true&autoReconnect=true";
		String s1 = "8064708768";//tanzb
		String s2 = "7372767C6C777242";//gotoftp4
		String s3 = "3D3C3A40363B3347";//19830819
		
		String t1 = Password.decrypt(s1);
		String t2 = Password.decrypt(s2);
		String t3 = Password.decrypt(s3);
		
		StringBuilder sburl = new StringBuilder("jdbc:mysql:");
		sburl.append("//");
		sburl.append(t1);
		sburl.append(".");
		sburl.append(t2);
		sburl.append(".com/");
		sburl.append(t1);
		sburl.append("?").append(param);
		
		String dbmsType = "mysql";
		String driveName = "org.gjt.mm.mysql.Driver";
		
		//添加新的数据源
		DataSourceConfig dsc = new DataSourceConfig();
		dsc.setDataSourceName(DSNAME);
		dsc.setSchemaName(t1);
		dsc.setDriverClass(driveName);
		dsc.setJdbcUrl(sburl.toString());
		dsc.setUserName(t1);
		dsc.setPassWord(t3);
		dsc.setDbmsType(dbmsType);
		//屏蔽取不到数据库连接时，后台抛错误信息
		dsc.setCatchError(false);
		//添加下面的校验是防止中途断网，后台报数据库连接错误信息
		dsc.setValidTest("true");
		dsc.setValidQuery("select count(*) from jxstar_info");
		
		DataSourceConfigManager.getInstance().addDataSourceConfig(dsc);
		
		Connection con = PooledConnection.getInstance().getConnection(DSNAME);
		return (con != null);
	}
}

package org.jxstar.design;

import java.sql.Connection;

import org.jxstar.dao.BaseDao;
import org.jxstar.dao.DaoParam;
import org.jxstar.dao.pool.DataSourceConfig;
import org.jxstar.dao.pool.DataSourceConfigManager;
import org.jxstar.dao.pool.PooledConnection;
import org.jxstar.security.Password;
import org.jxstar.test.AbstractTest;

public class LicenseTest extends AbstractTest {
	private static BaseDao _dao;
	private static final String DSNAME = "funuser";
	
	public static void main(String[] args) {
		init();
		_dao = BaseDao.getInstance();

		delete("fce0d723-8a97-4922-9ad1-7fdf28cc8ca5");
	}

	public static void delete(String uuid) {
		String sql = "delete from jxstar_info_log where info_id = ?";
		DaoParam param = _dao.createParam(sql);
		param.setDsName(DSNAME);
		param.addStringValue(uuid);
		_dao.update(param);
		
		sql = "delete from jxstar_info where info_id = ?";
		param.setSql(sql);
		_dao.update(param);
	}
	
	public static void delete() {
		String sql = "delete from jxstar_info_log";
		DaoParam param = _dao.createParam(sql);
		param.setDsName(DSNAME);
		_dao.update(param);
		
		sql = "delete from jxstar_info";
		param.setSql(sql);
		_dao.update(param);
	}

	public static void getInfo() {
		String os_name = System.getProperty("os.name");
		String os_version = System.getProperty("os.version");
		
		String java_version = System.getProperty("java.version");
		String java_home = System.getProperty("java.home");
		
		System.out.println("操作系统：" + os_name + " " + os_version);
		System.out.println("JAVA的版本：" + java_version + " " + java_home);
	}
	
	public static void pass() {
		String s1 = "tanzb";
		System.out.println(Password.encrypt(s1));
		String s2 = "gotoftp4";
		System.out.println(Password.encrypt(s2));
		String s3 = "19830819";
		System.out.println(Password.encrypt(s3));
		
		String t1 = "8064708768";
		String t2 = "7372767C6C777242";
		String t3 = "3D3C3A40363B3347";
		System.out.println(Password.decrypt(t1));
		System.out.println(Password.decrypt(t2));
		System.out.println(Password.decrypt(t3));
		
		String b1 = "select dept_name from sys_dept where dept_id = '10'";
		String b2 = "select dept_name from sys_dept where dept_level = 1";
		System.out.println(Password.encrypt(b1));
		System.out.println(Password.encrypt(b2));
		
		String c1 = "7F686E72697722726E727C646E616D652066726F6D207379735F6465707420776865726520646570745F6964203D2027313027";
		String c2 = "7F686E72697722726E727C646E616D652066726F6D207379735F6465707420776865726520646570745F6C6576656C203D2031";
		System.out.println(Password.decrypt(c1));
		System.out.println(Password.decrypt(c2));
	}
	
	//添加数据库信息
	public static boolean init() {
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

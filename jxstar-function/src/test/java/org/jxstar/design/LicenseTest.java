package org.jxstar.design;

import java.util.List;
import java.util.Map;

import org.jxstar.dao.BaseDao;
import org.jxstar.dao.DaoParam;
import org.jxstar.security.Password;
import org.jxstar.test.AbstractTest;

public class LicenseTest extends AbstractTest {
	private static BaseDao dao;
	
	public static void main(String[] args) {
		init();
		/*
		dao = BaseDao.getInstance();

		insert();
		List<Map<String,String>> data = query();
		for(Map<String,String> mp:data) {
			System.out.println(MapUtil.toString(mp));
		}*/
		
		getInfo();
	}

	public static void insert() {
		String sql = "insert into jxstar_user(user_id, os_name, dev_info, ip_info) values(?, ?, ?, ?)";
		DaoParam param = dao.createParam(sql);
		param.setDsName("default_mysql");
		param.addStringValue("112");
		param.addStringValue("windows");
		param.addStringValue("cpu");
		param.addStringValue("192.168.1.1");
		
		dao.update(param);
	}
	
	public static List<Map<String,String>> query() {
		String sql = "select user_id, os_name, dev_info, ip_info, dept_info, other_info, version_info from jxstar_user";
		
		DaoParam param = dao.createParam(sql);
		param.setDsName("default_mysql");
		return dao.query(param);
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
}

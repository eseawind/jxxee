package org.jxstar.util;

import java.lang.reflect.Method;

import org.jxstar.dao.BaseDao;
import org.jxstar.dao.DaoParam;
import org.jxstar.util.log.Log;





public class LogTest {
	private static Log log = null;

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		String realPath1 = "D:/works/jxstar/jxstar-webapp/src/main/webapp/WEB-INF/classes/";
		SystemInitTest.initSystem(realPath1);
		log = Log.getInstance();

		String id = "1111" + 100;
		id = id.substring(id.length()-4, id.length());
		log.showDebug(id);
		
		log.showWarn("sdfsdfsd");
		log.showError(new Exception("那时要"));
		
		BaseDao dao = BaseDao.getInstance();
		String sql = "update fun_base set ='1'  where fun_base.fun_id = ?";
		DaoParam param = dao.createParam(sql);
		dao.update(param);
	}
	
	public static void s(String s) {
		
	}

	@SuppressWarnings({"rawtypes"})
	public static Object loadclass(String classname) {
		try {
			//创建资源工具的class对象
			Class clzz = Class.forName(classname);
			//调用资源工具的初始化方法
			Method method = clzz.getMethod("hello", new Class[]{String.class});
			return method.invoke(null, new Object[]{"tanzhi"});
		} catch (Exception e) {
			log.showError(e);
			return null;
		}
	}
}

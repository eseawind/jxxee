package org.jxstar.db;


import java.util.List;
import java.util.Map;

import org.jxstar.dao.BaseDao;
import org.jxstar.dao.DaoParam;
import org.jxstar.dao.util.SQLParseException;
import org.jxstar.dao.util.SqlParserImp;
import org.jxstar.test.AbstractTest;

public class SqlParserTest extends AbstractTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		String path = "D:/works/jxstar/jxstar-webapp/src/main/webapp";
		init(path);
		
		String sql = "select "+
		 "{JOINSTR}({JOINSTR}('[dept_id] like ''',sys_user.dept_id),'%''') as cond";

		SqlParserImp parser = new SqlParserImp();
		try {
			String bb = parser.parse(sql);
			System.out.println(bb);
		} catch (SQLParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		BaseDao dao = BaseDao.getInstance();
		String sql1 = "select * from fun_base";
		DaoParam param = dao.createParam(sql1);
		List<Map<String, String>> ls = dao.query(param);
		System.out.println(ls);
	}

}

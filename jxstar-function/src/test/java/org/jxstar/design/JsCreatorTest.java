package org.jxstar.design;

import java.util.List;
import java.util.Map;

import org.jxstar.dao.BaseDao;
import org.jxstar.dao.DaoParam;
import org.jxstar.fun.design.PageParserBO;
import org.jxstar.test.AbstractTest;

public class JsCreatorTest extends AbstractTest {
	private static String path = "D:/我的项目/志华环讯/面辅料进销存/SVNDB/40程序文件/app";
	
	public static void main(String[] args) {
		init(path);
		/*PageTemplet pageTpl = PageTemplet.getInstance();
		pageTpl.read(path+"/WEB-INF/tpl/grid-page-tpl.txt", "grid");
		
		ElementTemplet elTpl = ElementTemplet.getInstance();
		elTpl.read(path+"/WEB-INF/tpl/grid-element-tpl.xml", "grid");
		
		pageTpl.read(path+"/WEB-INF/tpl/form-page-tpl.txt", "form");
		elTpl.read(path+"/WEB-INF/tpl/form-element-tpl.xml", "form");*/
		
		//JsCreatorBO parse = new JsCreatorBO();
		//parse.createJs("doss_card", "form", path);
		
		createpage();
	}
	
	@SuppressWarnings("rawtypes")
	public static void createpage() {
		BaseDao dao = BaseDao.getInstance();
		String sql = "select * from fun_base where (module_id like '1013%' or module_id like '1014%')";
		DaoParam param = dao.createParam(sql);
		List ls = dao.query(param);
		System.out.println("............total fun num:" + ls.size());
		
		PageParserBO parser = new PageParserBO();
		for (int i = 0; i < ls.size(); i++) {
			Map mp = (Map) ls.get(i);
			
			String funid = (String) mp.get("fun_id");
			
			parser.createJs(funid, "grid", path);
			parser.createJs(funid, "form", path);
			
			System.out.println("............total num:"+ ls.size() +", complete no:" + (i+1));
		}
	}
}

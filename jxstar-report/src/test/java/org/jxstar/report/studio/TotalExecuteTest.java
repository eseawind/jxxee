package org.jxstar.report.studio;

import java.util.Map;

import org.jxstar.control.action.RequestContext;
import org.jxstar.test.AbstractTest;
import org.jxstar.total.studio.TotalExecuteBO;
import org.jxstar.util.factory.FactoryUtil;

/**
 * 
 *
 * @author TonyTan
 * @version 1.0, 2011-12-3
 */
public class TotalExecuteTest extends AbstractTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		TotalExecuteBO exe = new TotalExecuteBO();
		
		Map<String, Object> data = FactoryUtil.newMap();
		data.put("rpt_funid", "sum_year1");
		data.put("plan_year", "2012");
		
		RequestContext request = new RequestContext(data);
		exe.exeTotal(request);
	}

}

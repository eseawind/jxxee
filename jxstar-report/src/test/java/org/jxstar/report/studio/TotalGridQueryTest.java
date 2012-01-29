package org.jxstar.report.studio;

import org.jxstar.test.AbstractTest;
import org.jxstar.total.studio.TotalGridQuery;

/**
 * 
 *
 * @author TonyTan
 * @version 1.0, 2011-12-2
 */
public class TotalGridQueryTest extends AbstractTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		TotalGridQuery query = new TotalGridQuery();
		query.totalControl("sum_year1");
	}

}

/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.service.query;

import org.jxstar.test.AbstractTest;

/**
 * 
 *
 * @author TonyTan
 * @version 1.0, 2012-2-29
 */
public class TreeQueryTest  extends AbstractTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		TreeQuery query = new TreeQuery();
		query.createJson("adminitrator", "basic_model", "10", "", "", "");
	}
}

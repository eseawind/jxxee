/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.service.note;

/**
 * 
 *
 * @author TonyTan
 * @version 1.0, 2012-5-21
 */
public class NoteBackParserTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		String retInfo = "num=2&success=1393710***4,1393710***5&faile=1393710***5&err=发送成功11&errid=0";
		
		info(""+NoteBackParser.getSendNum(retInfo));
		info(NoteBackParser.getFaileCode(retInfo));
		info(NoteBackParser.getError(retInfo));
	}

	private static void info(String info) {
		System.out.println(info);
	}
}

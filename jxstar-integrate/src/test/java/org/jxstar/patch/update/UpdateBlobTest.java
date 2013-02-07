/*
 * Copyright(c) 2013 Donghong Inc.
 */
package org.jxstar.patch.update;

import org.jxstar.test.AbstractTest;

/**
 * 
 *
 * @author TonyTan
 * @version 1.0, 2013-2-6
 */
public class UpdateBlobTest extends AbstractTest {
	private static String _save_path = "d:/update";
	private static UpdatePageBO _update;
	
	public static void main(String[] args) {
		init("D:\\works\\jxstar\\jxstar-webapp\\src\\main\\webapp");
		_update = new UpdatePageBO();
		
		//saveBlob();
		updateBlob();
	}

	public static void saveBlob() {
		//导出功能页面设计文件
		_update.saveBlob(_save_path, "design_id", "fun_design", "page_content", "");
		//导出流程图设计文件
		_update.saveBlob(_save_path, "design_id", "wf_design", "process_file", "");
		//导出流程导航图设计文件
		_update.saveBlob(_save_path, "design_id", "wfnav_design", "design_file", "");
	}
	
	public static void updateBlob() {
		_update.update(_save_path + "/fun_design");
		_update.update(_save_path + "/wf_design");
		_update.update(_save_path + "/wfnav_design");
	}
}

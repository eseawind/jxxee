/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.wf.studio;

import java.util.Map;

import org.jxstar.control.action.RequestContext;
import org.jxstar.dao.DaoParam;
import org.jxstar.dao.util.BigFieldUtil;
import org.jxstar.service.BusinessObject;
import org.jxstar.util.DateUtil;
import org.jxstar.util.MapUtil;
import org.jxstar.util.key.KeyCreator;
import org.jxstar.util.resource.JsMessage;

/**
 * 导航流程图设计器处理类。
 *
 * @author TonyTan
 * @version 1.0, 2012-11-8
 */
public class WfGraphBO extends BusinessObject {
	private static final long serialVersionUID = 1L;

	/**
	 * 读取设计文件
	 * @param graphId
	 * @return
	 */
	public String readDesign(String graphId) {
		String sql = "select design_file from wfnav_design where graph_id = '"+ graphId +"'";
		String fieldName = "design_file";
		String dsName = "default";
		
		String xmlfile = BigFieldUtil.readStream(sql, fieldName, dsName);
		//_log.showDebug("---------xmlfile:" + xmlfile);
		
		if (xmlfile != null && xmlfile.length() > 0) {
			xmlfile = "<?xml version='1.0' encoding='utf-8'?>" + xmlfile;
			setReturnData(xmlfile);
		}
		
		return _returnSuccess;
	}
	
	/**
	 * 保存设计文件
	 * @param graphId
	 * @return
	 */
	public String saveDesign(RequestContext request) {
		String userId = request.getUserInfo().get("user_id");
		String graphId = request.getRequestValue("graph_id");
		
		String xmlfile = request.getRequestValue("xmlfile");
		_log.showDebug("xmlfile=" + xmlfile);
		if (!saveDesignFile(graphId, userId, xmlfile)) {//"保存流转设计文件失败！"
			setMessage(JsMessage.getValue("wfdesignbo.error06"));
			return _returnFaild;
		}
		
		return _returnSuccess;
	}
	
	private boolean saveDesignFile(String graphId, String userId, String xmlfile) {
		String csql = "select count(*) as cnt from wfnav_design where graph_id = ?";
		DaoParam param = _dao.createParam(csql);
		param.addStringValue(graphId);
		Map<String,String> mpCnt = _dao.queryMap(param);
		
		//如果没有设计文件，则新增设计记录
		if (!MapUtil.hasRecord(mpCnt)) {
			if (!insertDesignFile(graphId, userId)) return false;
		} else {
			String usql = "update wfnav_graph set modify_date = ?, modify_userid = ? where graph_id = ?";
			DaoParam uparam = _dao.createParam(usql);
			uparam.addDateValue(DateUtil.getTodaySec());
			uparam.addStringValue(userId);
			uparam.addStringValue(graphId);
			
			if (!_dao.update(uparam)) return false;
		}
		
		//保存设计文件
		String usql = "update wfnav_design set design_file = ? where graph_id = '"+ graphId +"'";
		BigFieldUtil.updateStream(usql, xmlfile, "default");
		
		return true;
	}
	
	private boolean insertDesignFile(String graphId, String userId) {
		String isql = "insert into wfnav_design(design_id, graph_id, add_userid, add_date) " +
					  "values(?, ?, ?, ?)";
		DaoParam param = _dao.createParam(isql);
		String keyId = KeyCreator.getInstance().createKey("wfnav_graph");
		param.addStringValue(keyId);
		param.addStringValue(graphId);
		param.addStringValue(userId);
		param.addDateValue(DateUtil.getTodaySec());
		
		return _dao.update(param);
	}

	/**
	 * 删除设计文件
	 * @param graphId
	 * @return
	 */
	public String deleteDesign(String graphId) {
		deleteDefine(graphId, "wfnav_node");
		deleteDefine(graphId, "wfnav_design");
		
		return _returnSuccess;
	}
	
	private boolean deleteDefine(String graphId, String tableName) {
		String sql = "delete from "+ tableName +" where graph_id = ?";
		
		DaoParam param = _dao.createParam(sql);
		param.addStringValue(graphId);
		return _dao.update(param);
	}
}

/*
 * Copyright(c) 2013 DongHong Inc.
 */
package org.jxstar.service.studio;

import java.util.List;
import java.util.Map;

import org.jxstar.control.action.RequestContext;
import org.jxstar.dao.DaoParam;
import org.jxstar.service.BusinessObject;
import org.jxstar.util.ArrayUtil;
import org.jxstar.util.DateUtil;
import org.jxstar.util.MapUtil;
import org.jxstar.util.key.CodeCreator;
import org.jxstar.util.key.KeyCreator;

/**
 * 新闻公告处理类。
 *
 * @author TonyTan
 * @version 1.0, 2013-11-29
 */
public class SysNewsBO extends BusinessObject {
	private static final long serialVersionUID = 1L;

	/**
	 * 新增的时候自动创建一条记录，方便保存附件、添加明细记录
	 * @param mpUser
	 * @return
	 */
	public String createNews(Map<String,String> mpUser) {
		String sql = "insert into sys_news(news_id, news_code, state, edit_date, edit_user, edit_userid, add_userid, add_date) " +
			"values(?, ?, ?, ?, ?, ?, ?, ?)";
		DaoParam param = _dao.createParam(sql);
		
		String news_id = KeyCreator.getInstance().createKey("sys_news");
		String news_code = CodeCreator.getInstance().createCode("sys_news");
		String user_id = MapUtil.getValue(mpUser, "user_id");
		String user_name = MapUtil.getValue(mpUser, "user_name");
		
		param.addStringValue(news_id);
		param.addStringValue(news_code);
		param.addStringValue("0");
		param.addDateValue(DateUtil.getTodaySec());
		param.addStringValue(user_name);
		param.addStringValue(user_id);
		param.addStringValue(user_id);
		param.addDateValue(DateUtil.getTodaySec());
		if (!_dao.update(param)) {
			setMessage("新增记录失败！");
			return _returnFaild;
		}
		//返回主键到前台
		setReturnData("{keyid:'"+ news_id +"'}");
		
		return _returnSuccess;
	}
	
	/**
	 * 结合用户设置，取新闻公告记录
	 * @param userId -- 新闻ID
	 * @param preMonth -- 整数，几个月内的新闻公告
	 * @return
	 */
	public String queryCont(String userId, String preMonth) {
		int imonth = 1;
		if (preMonth != null && preMonth.length() > 0) {
			imonth = Integer.parseInt(preMonth);
		}
		
		//f_isnews函数处理公告的数据权限
		String sql = "select news_id, news_code, news_title, edit_date, edit_user, edit_userid " +
				"from sys_news where f_isnews(news_id, ?) = '1' and state = '1' and " +
				"(edit_date >= ? or is_top = '1') order by is_top desc, edit_date desc";
		DaoParam param = _dao.createParam(sql);
		param.addStringValue(userId);
		String d = DateUtil.dateAddMonth(DateUtil.getToday(), -imonth);
		_log.showDebug("........query cont date:" + d + "; userid:" + userId);
		param.addDateValue(d);
		List<Map<String,String>> lsData = _dao.query(param);
		
		String json = "[]";
		if (!lsData.isEmpty()) {
			json = ArrayUtil.listToJson(lsData);
		}
		setReturnData(json);
		
		return _returnSuccess;
	}
	
	/**
	 * 保存回复记录
	 * @param request
	 * @return
	 */
	public String saveReply(RequestContext request) {
		String keyid = request.getRequestValue("keyid");			//回复ID
		String news_id = request.getRequestValue("news_id");		//新闻ID
		String reply_cont = request.getRequestValue("reply_cont");	//回复内容
		
		Map<String,String> mpuser = request.getUserInfo();
		String user_id = MapUtil.getValue(mpuser, "user_id");
		String user_name = MapUtil.getValue(mpuser, "user_name");
		
		String sql = "insert into sys_news_reply (reply_id, news_id, reply_cont, edit_date, " +
				"edit_user, edit_userid) values (?, ?, ?, ?, ?, ?)";
		DaoParam param = _dao.createParam(sql);
		
		param.addStringValue(keyid);
		param.addStringValue(news_id);
		param.addStringValue(reply_cont);
		param.addDateValue(DateUtil.getTodaySec());
		param.addStringValue(user_name);
		param.addStringValue(user_id);
		if (!_dao.update(param)) {
			setMessage("保存回复记录失败！");
			return _returnFaild;
		}
		
		return _returnSuccess;
	}
	
	/**
	 * 删除回复记录
	 * @param replyId
	 * @return
	 */
	public String deleteReply(String replyId) {
		String sql = "delete from sys_news_reply where reply_id = ?";
		DaoParam param = _dao.createParam(sql);
		
		param.addStringValue(replyId);
		if (!_dao.update(param)) {
			setMessage("删除回复记录失败！");
			return _returnFaild;
		}
		
		if (!deleteAttach("sys_news_reply", replyId)) {
			setMessage("删除回复记录相关附件失败！");
			return _returnFaild;
		}
		
		return _returnSuccess;
	}
	
	/**
	 * 查看公告内容与回复内容
	 * @param newsId
	 * @return
	 */
	public String queryContAndReply(String newsId) {
		String json = "";
		Map<String,String> mpCont = queryCont(newsId);
		if (!mpCont.isEmpty()) {
			json = "{cont:" + MapUtil.toJson(mpCont);
		} else {
			setMessage("没有找到公告新闻记录！");
			return _returnFaild;
		}
		
		List<Map<String,String>> lsReply = queryReply(newsId);
		if (!lsReply.isEmpty()) {
			json += ", reply:" + ArrayUtil.listToJson(lsReply) + "}";
		} else {
			json += ", reply:[]}"; 
		}
		_log.showDebug(".............json=" + json);
		
		setReturnData(json);
		
		return _returnSuccess;
	}
	
	//删除相关附件记录
	private boolean deleteAttach(String tableName, String dataId) {
		String sql = "select attach_id from sys_attach where table_name = ? and data_id = ?";
		DaoParam param = _dao.createParam(sql);
		
		List<Map<String, String>> lsData = _dao.query(param);
		if (lsData.isEmpty()) return true;
		
		String[] attachIds = new String[lsData.size()];
		for (int i = 0; i < lsData.size(); i++) {
			attachIds[i] = lsData.get(i).get("attach_id");
		}
		
		//删除相关附件，不处理删除异常
		AttachBO attach = new AttachBO();
		attach.deleteAttach(attachIds);
		
		return true;
	}
	
	//查询公告内容
	private Map<String,String> queryCont(String newsId) {
		String sql = "select * from sys_news where news_id = ?";
		DaoParam param = _dao.createParam(sql);
		param.addStringValue(newsId);
		return _dao.queryMap(param);
	}
	
	//查询公告回复
	private List<Map<String,String>> queryReply(String newsId) {
		String sql = "select * from sys_news_reply where news_id = ? order by edit_date";
		DaoParam param = _dao.createParam(sql);
		param.addStringValue(newsId);
		return _dao.query(param);
	}
}

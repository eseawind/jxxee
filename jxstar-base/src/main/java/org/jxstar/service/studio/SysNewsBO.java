/*
 * Copyright(c) 2013 DongHong Inc.
 */
package org.jxstar.service.studio;

import java.util.List;
import java.util.Map;

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
		
		String sql = "select news_id, news_code, news_title, edit_date, edit_user, edit_userid " +
				"from sys_news where f_isnews(news_id, ?) = '1' and state = '1' and edit_date >= ?";
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
}

/*
 * AssignTaskUtil.java 2012-2-20
 * 
 * Copyright 2010 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
package org.jxstar.wf.engine;

import java.util.List;
import java.util.Map;

import org.jxstar.dao.BaseDao;
import org.jxstar.dao.DaoParam;
import org.jxstar.util.MapUtil;
import org.jxstar.util.factory.FactoryUtil;
import org.jxstar.util.factory.SystemFactory;
import org.jxstar.wf.define.WfDefineDao;
import org.jxstar.wf.define.WfDefineManager;

/**
 * 该工具是任务实例的扩展，在以后的优化中可以重构：可以在任务实例中增加“必须同意人数”字段。
 * 把相应dao方法放到DAO对象中。
 * 
 * 处理多人分配节点，必须达到审批同意人数才能进入下一个节点。
 *
 * @author TonyTan
 * @version 1.0, 2012-2-20
 */
public class AssignTaskUtil {
	private static BaseDao _dao = BaseDao.getInstance();
	
	/**
	 * 如果任务被取回，则需要新增一条取回的任务分配消息。
	 * 同时修改其它的任务分配消息状态为“注销”，内容为“被取回”
	 * @param task
	 */
	public static boolean createBackAssign(TaskInstance task) {
		TaskInstanceDao taskDao = TaskInstanceDao.getInstance();
		
		if (!task.getCheckType().equals("K")) return true;
		
		//修改原任务分配记录的状态为“注销”
		String sql = "update wf_assign set run_state = ?, check_desc = ? where task_id = ?";
		DaoParam param = _dao.createParam(sql);
		param.addStringValue("4");
		param.addStringValue("get back");
		param.addStringValue(task.getTaskId());
		if (!_dao.update(param)) return false;
		
		//取重新分配的人员信息
		List<Map<String,String>> lsUser = FactoryUtil.newList();
		Map<String,String> mpUser = FactoryUtil.newMap();
		mpUser.put("user_id", task.getNextUserId());
		mpUser.put("user_name", task.getNextUser());
		lsUser.add(mpUser);
		
		return taskDao.insertAssign(task, lsUser);
	}
	
	/**
	 * 获取当前任务的分配用户信息
	 * @param task -- 任务实例
	 * @param appData -- 应用数据
	 * @return
	 */
	public static List<Map<String,String>> queryAssignUser(TaskInstance task, Map<String,String> appData) {
		List<Map<String,String>> lsUser = FactoryUtil.newList();
		
		//取过程ID与节点ID
		String nodeId = task.getNodeId();
		String processId = task.getProcessId();
		
		WfDefineDao defineDao = WfDefineDao.getInstance();
		Map<String,String> mpNodeAttr = defineDao.queryNodeAttr(processId, nodeId);
		if (mpNodeAttr.isEmpty()) return lsUser;
		
		//取分配规则，暂时不支持用户组检索用户
		String assignRule = mpNodeAttr.get("assign_rule");
		
		if (assignRule.equals("class")) {
		//按自定义类检索用户
			String className = mpNodeAttr.get("custom_class");
			Object object = SystemFactory.createObject(className);
			if (object != null) {
				AssignCustom custom = (AssignCustom) object;
				lsUser = custom.getAssignUser(task);
				if (lsUser == null) lsUser = FactoryUtil.newList();
			}
		} else {
		//按分配用户明细检索用户
			WfDefineManager manager = WfDefineManager.getInstance();
			lsUser = manager.queryAssignUser(processId, nodeId, appData);
		}
		
		return lsUser;
	}
	
	/**
	 * 如果是多人审批节点，且达到通过条件，则修改checkType为Y，否则为E
	 * 如果不是多人审批节点，则不处理。
	 * @param task
	 */
	public static void taskCheckType(TaskInstance task) {
		if (task.getMustAgreeNum() > 0) {
			if (checkNodePass(task)) {//表示审批通过
				task.setCheckType("Y");
			} else {//表示审批不通过
				task.setCheckType("E");
			}
		}
	}
	
	/**
	 * 检查当前节点是否所有分配都执行完成。在taskInstance.complete中用
	 * @param task -- 任务实例
	 * @return
	 */
	public static boolean assignComplete(TaskInstance task) {
		if (task.getMustAgreeNum() > 0) {
			int newAssignNum = getAssignNum(task.getTaskId(), "run_state = '0'");
			if (newAssignNum > 0) return false;
		}
		
		return true;
	}
	
	/**
	 * 检查当前节点是否为多人审批节点，如果是，则检查审批同意的人数是否达到
	 * @param task -- 任务实例
	 * @return
	 */
	private static boolean checkNodePass(TaskInstance task) {
		String taskId = task.getTaskId();
		
		//取当前节点的必须同意人数
		int mustAgreeNum = task.getMustAgreeNum();
		if (mustAgreeNum <= 0) return true;
		
		//取当前任务分配记录数
		int assignNum = getAssignNum(taskId, "");
		//取当前任务审批同意的记录数
		int checkAgreeNum = getAssignNum(taskId, "run_state >= '1' and check_type = 'Y'");
		
		//分配消息都审批通过，则返回真
		if (checkAgreeNum >= assignNum) {
			return true;
		}
		
		if (mustAgreeNum >= 9) {//全部都必须同意
			return checkAgreeNum >= assignNum;
		} else {//达到人数就可以通过
			return checkAgreeNum >= mustAgreeNum;
		}
	}
	
	/**
	 * 取当前任务各种条件的分配记录数
	 * @param taskId -- 任务ID
	 * @param where -- 过滤条件
	 * @return
	 */
	private static int getAssignNum(String taskId, String where) {
		String sql = "select count(*) as cnt from wf_assign where ";
		if (where != null && where.length() > 0) {
			sql += where +" and task_id = ?";
		} else {
			sql += "task_id = ?";
		}
		
		DaoParam param = _dao.createParam(sql.toString());
		param.addStringValue(taskId);
		
		return MapUtil.hasRecodNum(_dao.queryMap(param));
	}
}

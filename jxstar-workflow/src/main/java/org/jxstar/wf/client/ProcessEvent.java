package org.jxstar.wf.client;

import org.jxstar.control.action.RequestContext;
import org.jxstar.service.BusinessObject;
import org.jxstar.util.resource.JsMessage;
import org.jxstar.wf.define.TaskNode;
import org.jxstar.wf.util.ProcessUtil;

/**
 * 是工作流实例与任务实例触发事件时的处理类，在系统事件注册中需要使用。
 *
 * @author TonyTan
 * @version 1.0, 2011-11-16
 */
public class ProcessEvent extends BusinessObject {
	private static final long serialVersionUID = 1L;

	/**
	 * 任务实例完成，在task_3事件中调用。
	 * @param request
	 * @return
	 */
	public String completeTask(RequestContext request) {//"开始执行【{0}】事件"
		_log.showDebug(JsMessage.getValue("processclientbo.doevent", "task_3"));
		String funId = request.getRequestValue("check_funid");
		String dataId = request.getRequestValue("data_id");
		String taskId = request.getRequestValue("task_id");
		String checkType = request.getRequestValue("check_type");
		//"审批意见："
		_log.showDebug(JsMessage.getValue("processclientbo.advice") + 
				checkType + ";" + funId + ";" + dataId + ";" + taskId);
		
		return _returnSuccess;
	}
	
	/**
	 * 启动过程实例，在process_1事件中调用。
	 * @param request -- 请求对象
	 * @return
	 */
	public String startupProcess(RequestContext request) {//"开始执行【{0}】事件"
		_log.showDebug(JsMessage.getValue("processclientbo.doevent", "process_1"));
		//修改记录状态为审批中
		String audit = "2";
		String funId = request.getRequestValue("check_funid");
		String dataId = request.getRequestValue("data_id");
		
		if (!ProcessUtil.updateFunAudit(funId, dataId, audit)) {
			//"更新【{0}】的【{1}】记录的状态为【{2}】失败！"
			setMessage(JsMessage.getValue("processclientbo.uperror"), 
					funId, dataId, audit);
			return _returnFaild;
		}
		
		return _returnSuccess;
	}
	
	/**
	 * 正常完成过程实例，在process_3事件中调用。
	 * @param request -- 请求对象
	 * @return
	 */
	public String completeProcess(RequestContext request) {//"开始执行【{0}】事件"
		_log.showDebug(JsMessage.getValue("processclientbo.doevent", "process_3"));
		//修改记录状态为审批通过
		String audit = "3";
		String funId = request.getRequestValue("check_funid");
		String dataId = request.getRequestValue("data_id");

		if (!ProcessUtil.updateFunAudit(funId, dataId, audit)) {
			//"更新【{0}】的【{1}】记录的状态为【{2}】失败！"
			setMessage(JsMessage.getValue("processclientbo.uperror"), 
					funId, dataId, audit);
			return _returnFaild;
		}
		
		//给编辑人发消息通知
		
		
		return _returnSuccess;
	}
	
	/**
	 * 终止过程实例，在process_7事件中调用。
	 * @param request -- 请求对象
	 * @return
	 */
	public String terminateProcess(RequestContext request) {//"开始执行【{0}】事件"
		_log.showDebug(JsMessage.getValue("processclientbo.doevent", "process_7"));
		//根据审批意见，修改记录状态
		String funId = request.getRequestValue("check_funid");
		String dataId = request.getRequestValue("data_id");
		String checkType = request.getRequestValue("check_type");
		
		if (!updateAudit(funId, dataId, checkType)) {
			//"更新【{0}】的【{1}】记录的状态失败！"
			setMessage(JsMessage.getValue("processclientbo.staterror"), 
					funId, dataId);
			return _returnFaild;
		}
		
		//根据审批意见，给历史审批人发送通知消息
		
		
		return _returnSuccess;
	}
	
	/**
	 * 修改业务记录状态值，在过程实例结束时调用。
	 * @param funId
	 * @param dataId
	 * @param checkType
	 * @return
	 */
	private boolean updateAudit(String funId, String dataId, String checkType) {
		//已注销，发生异常了
		String audit = "7";
		if (checkType.equals(TaskNode.RETURNEDIT)) {
		//退回编辑人
			audit = "6";
		} else if (checkType.equals(TaskNode.DISAGREE)) {
		//已否决
			audit = "4";
		} else if (checkType.equals(TaskNode.RETURN)) {
		//退回
			audit = "5";
		} 
		
		return ProcessUtil.updateFunAudit(funId, dataId, audit);
	}
}

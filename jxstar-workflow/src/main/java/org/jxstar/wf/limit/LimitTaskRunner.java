/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.wf.limit;

import org.jxstar.task.SystemTask;
import org.jxstar.task.TaskException;

/**
 * 限时任务处理线程。处理方法：
 * 1、查找所有分配消息记录，查找有限时值，且大于开始时间，且大于当前时间的记录；
 * 2、再根据分配消息中的任务属性找到限时处理规则；
 * 3、根据处理规则，调用相应处理类。
 *
 * @author TonyTan
 * @version 1.0, 2012-4-11
 */
public class LimitTaskRunner extends SystemTask {

	public void execute() throws TaskException {
		

	}

}

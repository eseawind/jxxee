/*
 * AssignCustom.java 2012-2-20
 * 
 * Copyright 2010 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
package org.jxstar.wf.engine;

import java.util.List;
import java.util.Map;

/**
 * 任务分配规则自定义扩展类接口。
 * 一般用于根据业务单据中的主表信息或明细表信息取当前节点的分配用户信息。
 *
 * @author TonyTan
 * @version 1.0, 2012-2-20
 */
public interface AssignCustom {

	public List<Map<String,String>> getAssignUser(TaskInstance task);
}

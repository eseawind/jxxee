/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.test.pref;

import org.jxstar.dao.DaoParam;
import org.jxstar.test.base.TestBase;
import org.jxstar.util.DateUtil;
import org.jxstar.util.key.KeyCreator;

/**
 * 构建主键的性能测试类。需要在TestRunner中执行。
 * 测试是是否会创建重复的主键，是否会造成死锁；
 * 检查重复主键的SQL：
 * select * from (
   select aid, count(*) as cnt from
   (select substr(task_id, 10, length(task_id)) as aid from wf_taskhis) group by aid) where cnt > 1
 *
 * 经测试KeyCreator是否在同一个事务中执行性能相差不大，新增2万个，耗时87,86。
 * 
 * @author TonyTan
 * @version 1.0, 2012-4-30
 */
public class KeyCreatorPref extends TestBase {

	/* (non-Javadoc)
	 * @see org.jxstar.test.base.TestBase#exeTest()
	 */
	@Override
	protected boolean exeTest() {
		String tableName = "sys_var1";
		String threadId = Integer.toString(Thread.currentThread().hashCode());
		String key = KeyCreator.getInstance().createKey(tableName);
		_log.showDebug("----------thread id="+ threadId +";new key=" + key);
		
		if (!savePk(tableName, key, threadId)) return false;
		
		//需要添加这个延时才能测试出死锁的效果
		/*
		try {
			Thread.currentThread().sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}*/
		
		return true;
	}
	
	private boolean savePk(String tableName, String pk, String threadId) {
		DaoParam param =_dao.createParam("insert into test1(table_name, pk, thread_id, add_date) values(?, ?, ?, ?)");
		param.addStringValue(tableName);
		param.addStringValue(pk);
		param.addStringValue(threadId);
		param.addDateValue(DateUtil.getTodaySec());
		return _dao.update(param);
	}

}

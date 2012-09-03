package org.jxstar.test.base;


import org.jxstar.task.TaskException;
import org.jxstar.test.AbstractTest;

/**
 * 多线程环境下执行测试类。
 */
public class TestRunner {
	
	public static void main(String[] args) {
		//初始化环境对象
		AbstractTest.init("d:/tomcat6/webapps/jxstar_ee");
		
		TestRunner test = new TestRunner();
		try {
			test.load("200", "40", "org.jxstar.test.pref.KeyCreatorPref", 20000);
		} catch (TaskException e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 启动多个线程执行测试类
	 * @param checkTime -- 间隔时间，ms
	 * @param sThreadNum -- 同时启动线程数量
	 * @param sClassName -- 测试类名，必须继承TestBase
	 * @param maxCount -- 执行数量
	 * @return
	 * @throws TaskException
	 */
	public boolean load(String checkTime, String sThreadNum, String sClassName, int maxCount) 
		throws TaskException {
		if (checkTime == null || checkTime.length() == 0) {
			checkTime = "200";
		}
		
		if (sThreadNum == null || sThreadNum.length() == 0) {
			throw new TaskException("SystemLoadTest.load(): 参数[runThreadNum]未定义！");
		}
		int threadNum = Integer.parseInt(sThreadNum);
		
		//需要执行测试用例类名
		if (sClassName == null || sClassName.length() == 0) {
			throw new TaskException("SystemLoadTest.load(): 参数[testClassName]未定义！");
		}
		System.out.println("======启动的测试线程数=" + sThreadNum + " 测试类名=" + sClassName + " 间隔时间ms=" + checkTime);
		
		//启动测试线程
		for (int i = 0; i < threadNum; i++) {
			try { 
				Thread.sleep(200);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}	
					
			System.out.println("======已启动线程数：" + (i+1));
			TestThread tt = new TestThread(checkTime, sClassName, maxCount);
			tt.start();
		}
		
		return true;
	}
}

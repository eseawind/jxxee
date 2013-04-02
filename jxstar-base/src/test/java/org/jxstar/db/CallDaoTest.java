/*
 * Copyright(c) 2013 Donghong Inc.
 */
package org.jxstar.db;

import org.jxstar.dao.CallDao;
import org.jxstar.dao.CallParam;
import org.jxstar.test.AbstractTest;

/**
 * 调用存储过程测试，可以获取输出参数值。
 * 注册一个oracle存储过程：
 * create or replace procedure p_test(v_code varchar2, v_out out varchar2) is
	begin
	   update mat_app set project_name = 'test call dao' where app_code = v_code;
	   v_out := 'aaa';
	end p_test;
 * 注册一个sqlserver存储过程：
	CREATE PROCEDURE dbo.p_test
	(
	@vcode varchar(20),
	@vout varchar(20) output
	)
	AS
	BEGIN
		update mat_app set project_name = 'test call dao' where app_code = @vcode;
	    set @vout = 'aaa';
	END
 *
 * @author TonyTan
 * @version 1.0, 2013-3-29
 */
public class CallDaoTest extends AbstractTest {

	public static void main(String[] args) {
		//初始化执行环境
		init("d:\\tomcat6\\webapps\\jxstar_ee");
		
		CallDao dao = CallDao.getInstance();
		
		//执行存储过程注意添加{}
		String sql = "{call p_test(?, ?)}";
		CallParam param = dao.createParam(sql);
		//添加输入参数
		param.addStringValue("CG201303000051");
		//添加输出参数
		param.regStringOutParam();
		
		//执行存储过程
		boolean ret = dao.execute(param);
		print("...........执行结果：" + ret);
		
		//获取输出参数值
		String value = param.getOutValue(0);
		print("...........输出参数值：" + value);
	}

}

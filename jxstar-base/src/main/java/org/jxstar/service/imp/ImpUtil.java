/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.service.imp;

import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.jxstar.dao.BaseDao;
import org.jxstar.dao.DaoParam;
import org.jxstar.service.control.ControlerUtil;
import org.jxstar.service.define.FunctionDefine;
import org.jxstar.service.define.FunctionDefineManger;
import org.jxstar.service.util.TaskUtil;
import org.jxstar.util.factory.FactoryUtil;
import org.jxstar.util.key.CodeCreator;
import org.jxstar.util.key.KeyCreator;
import org.jxstar.util.log.Log;

/**
 * 数据导入工具方法。
 *
 * @author TonyTan
 * @version 1.0, 2012-6-11
 */
public class ImpUtil {
	private static Log _log = Log.getInstance();
	private static BaseDao _dao = BaseDao.getInstance();
	//外键标志
	public static final String FKEYID_REGEX = "\\{FKEYID\\}";
	//新增主键标志
	public static final String NEW_KEYID = "{NEWKEYID}";
	public static final String NEW_KEYID_REGEX = "\\{NEWKEYID\\}";
	//新增编号标志
	public static final String NEW_CODE = "{NEWCODE}";
	public static final String NEW_CODE_REGEX = "\\{NEWCODE\\}";
	
	/**
	 * 取得关联关系数据
	 * @param lsRelatSql
	 * @param formData
	 * @param gridData
	 * @return
	 */
	public static Map<String,String> queryRelat(List<Map<String,String>> lsRelatSql,
			Map<String,String> formData,
			Map<String,String> gridData) {
		//把表格与表头数据拼在一起作为关系SQL的where参数解析来源
		Map<String,String> paramData = FactoryUtil.newMap();
		if (formData != null && !formData.isEmpty()) paramData.putAll(formData);
		if (gridData != null && !gridData.isEmpty()) paramData.putAll(gridData);
		
		Map<String,String> queryData = FactoryUtil.newMap();
		for (Map<String,String> mpRelatSql : lsRelatSql) {
			String sql = mpRelatSql.get("relat_sql");
			if (sql.length() == 0) continue;
			
			sql = TaskUtil.parseAppField(sql, paramData, true);
			_log.showDebug("..........relatsql:" + sql);
			
			DaoParam param = _dao.createParam(sql);
			param.setUseParse(true);
			Map<String,String> mp = _dao.queryMap(param);
			
			queryData.putAll(mp);
		}
		
		return queryData;
	}
	
	/**
	 * 解析新增SQL中的ID与编码值：{NEWKEYID}{NEWCODE}
	 * @param funId
	 * @param insertSql
	 * @return
	 */
	public static String parseInsertSQL(String funId, String fkValue, 
			String insertSql, Map<String,String> userInfo) {
		if (insertSql == null || insertSql.length() == 0) return "";
		
		//创建主键生成对象
		KeyCreator keyCreator = KeyCreator.getInstance();
		//创建编码生成对象
		CodeCreator codeCreator = CodeCreator.getInstance();
		//解析目标SQL中的常量
		insertSql = parseConstant(insertSql, userInfo);
		//解析目标SQL中的外键值
		insertSql = insertSql.replaceFirst(FKEYID_REGEX, addChar(fkValue));
		
		//是否新增主键
		boolean isNewKeyId = (insertSql.indexOf(NEW_KEYID) >= 0);
		if (isNewKeyId) {
			FunctionDefine funObject = FunctionDefineManger.getInstance().getDefine(funId);
			String tableName = funObject.getElement("table_name");
			String newKeyID = keyCreator.createKey(tableName);
			insertSql = insertSql.replaceFirst(NEW_KEYID_REGEX, addChar(newKeyID));
		}
		
		//是否新增编号
		boolean isNewCode = (insertSql.indexOf(NEW_CODE) >= 0);
		if (isNewCode) {
			String newCode = codeCreator.createCode(funId);
			insertSql = insertSql.replaceFirst(NEW_CODE_REGEX, addChar(newCode));
		}
		
		return insertSql;
	}
	
	/**
	 * 取编码值
	 * @param funId
	 * @return
	 */
	public static String getCodeValue(String funId) {
		CodeCreator codeCreator = CodeCreator.getInstance();
		return codeCreator.createCode(funId);
	}
	
	/**
	 * 取主键值
	 * @param funId
	 * @return
	 */
	public static String getKeyValue(String funId) {
		KeyCreator keyCreator = KeyCreator.getInstance();
		FunctionDefine funObject = FunctionDefineManger.getInstance().getDefine(funId);
		
		String tableName = funObject.getElement("table_name");
		return keyCreator.createKey(tableName);
	}
	
	//取表格数据字段的位置信息，取行序号
	public static int getFirstRow(String impId) {
		String sql = "select field_pos from imp_field where data_src = '1' and imp_id = ?";
		
		DaoParam param = _dao.createParam(sql);
		param.addStringValue(impId);
		
		Map<String,String> mp = _dao.queryMap(param);
		if (mp.isEmpty()) return -1;
		
		String field_pos = mp.get("field_pos");
		int[] pos = getPosition(field_pos);
		if (pos.length != 2) {
			return -1;
		}
		return pos[0];
	}
	
	/**
	 * 获取位置
	 * @param position
	 * @return
	 */
    public static int[] getPosition(String position) {
        int [] ret = new int[0];
        if (position == null || position.length() == 0) {
            return ret;
        }
        String[] strRet = position.split(",");
        if (strRet.length != 2) return ret;

        ret = new int[2];
        ret[0] = Integer.parseInt(strRet[0]);   //行
        ret[1] = Integer.parseInt(strRet[1]);   //列

        return ret;
    }
    
	/**
	 * 解析SQL中的常量值。
	 * @param sql
	 * @param userInfo
	 * @return
	 */
	public static String parseConstant(String sql, 
			Map<String,String> userInfo) {
		String regex = "\\{[^}]+\\}";
		Pattern p = Pattern.compile(regex);
		Matcher m = p.matcher(sql);
		StringBuffer sb = new StringBuffer();
		while (m.find()) {
			String tag = m.group();
			//取常量的值
			String value = (String) ControlerUtil.getConstantParam(tag, userInfo);
			//如果还含{，说明没有解析
			if (value.indexOf("{") >= 0) {
				m.appendReplacement(sb, value);
			} else {
				m.appendReplacement(sb, addChar(value));
			}
		}
		m.appendTail(sb);
		
		return sb.toString();
	}
    
	/**
	 * 字符串两头加上'
	 * @param str
	 * @return
	 */
	public static String addChar(String str) {
		StringBuilder sb = new StringBuilder();
		sb.append("'").append(str).append("'");
		
		return sb.toString();
	}
}

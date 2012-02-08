/*
 * ReportUtil.java 2010-11-11
 * 
 * Copyright 2010 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
package org.jxstar.report.util;

import java.util.Map;

import org.jxstar.dao.BaseDao;
import org.jxstar.dao.DaoParam;
import org.jxstar.service.define.FunDefineDao;
import org.jxstar.util.StringFormat;
import org.jxstar.util.StringUtil;
import org.jxstar.util.log.Log;

/**
 * 输出报表的公共工具类。
 *
 * @author TonyTan
 * @version 1.0, 2010-11-11
 */
public class ReportUtil {
    protected static Log _log = Log.getInstance();
    /**
     * 取主键值
     * @param funId -- 功能ID
     * @param mpData -- 记录值
     * @return
     */
    protected static String getKeyValue(String funId, Map<String,String> mpData) {
        //取功能基础信息
        Map<String,String> mpFun = FunDefineDao.queryFun(funId);
        if (mpFun == null || mpFun.isEmpty()) {
            _log.showDebug("--------getKeyValue(): not find function is null!!");
            return "";
        }
        
        //取主键，不带表名
        String pkcol = mpFun.get("pk_col");
        pkcol = StringUtil.getNoTableCol(pkcol);
        //取主键值
        String dataId = mpData.get(pkcol);
        if (dataId == null || dataId.length() == 0) {
            _log.showDebug("--------getKeyValue(): not find data id!!");
            return "";
        }
        
        return dataId;
    }
    
    /**
     * 当前数值是0，则返回空字符串
     * @param value -- 数据值
     * @param style -- 数据类型
     * @return
     */
    protected static String getZeroOut(String value, String style){
        if (value == null|| value.length() == 0) return value;
        if (style == null || style.length() == 0) return value;
        
        if (value.indexOf(",") > 0) return value;
        if (value.equals("0.00")) return ""; 
        
        style = style.toLowerCase();
        if (style.indexOf("int") >= 0 || style.indexOf("money") >= 0 || 
                style.indexOf("number") >= 0 || style.indexOf("float") >= 0 || style.indexOf("account") >= 0){
            double d = Double.parseDouble(value);
            if (d > -0.0000001 && d < 0.0000001){
                value = "";                         
            }
        }
        return value;
    }
    
    /**
     * 根据数据格式，转换数据
     * 
     * @param value
     * @param style
     */
    protected static String convertValue(String value, String style) {
        return StringFormat.getDataValue(value, style);
    }
    
    /**
     * 取combox控件的显示值
     * @param value -- 选项值
     * @param ctlcode -- 控件代码
     * @return
     */
    protected static String getComboTitle(String value, String ctlcode) {
        String ret = value;
        
        if (ctlcode == null || ctlcode.length() == 0) {
            return ret;
        }
        
        String strSQL = "select display_data from funall_control where control_type = 'combo' " +
                    "and control_code = ? and value_data = ?";
        BaseDao dao = BaseDao.getInstance();
        DaoParam param = dao.createParam(strSQL);
        param.addStringValue(ctlcode);
        param.addStringValue(value);
        
        Map<String, String> mpctl = dao.queryMap(param);
        if (!mpctl.isEmpty()) {
            ret = mpctl.get("display_data");
        }

        return ret;
    }
    
    /**
     * 获取表格的坐标值
     * 
     * @param position -- 位置值
     * @return 
     */
    protected static int[] getPosition(String position) {
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
}

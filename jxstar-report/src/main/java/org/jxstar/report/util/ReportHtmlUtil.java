/*
 * ReportXlsUtil.java 2010-11-11
 * 
 * Copyright 2010 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
package org.jxstar.report.util;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.jxstar.util.DateUtil;
import org.jxstar.util.MapUtil;
import org.jxstar.util.StringUtil;
import org.jxstar.util.factory.FactoryUtil;

/**
 * 输出html报表的工具类。
 *
 * @author TonyTan
 * @version 1.0, 2010-11-11
 */
public class ReportHtmlUtil extends ReportUtil {
    
    /**
     * 返回javascript定义变量
     * @return String
     */
    public static String defineHead() {
        StringBuffer sbRet = new StringBuffer();
        //获取一个table对象
        sbRet.append("var tblobj = f_getTblObj();\r\n");

        //保存一个空的table模板
        sbRet.append("var tblValue = tblobj.innerHTML;\r\n");
        
        //定义一个新的table对象变量
        sbRet.append("var newTblObj = null;\r\n");

        //定义一个单元格位置变量
        sbRet.append("var posi = new Array();\r\n");
        
        //定义单元格内容变量
        sbRet.append("var cellValue = \"\";\r\n");
        return sbRet.toString();
    }
    
    /**
     * 填写报表头信息
     * @param jsTblObj -- 表格对象
     * @param lsHeadInfo -- 报表头信息
     * @param mpUser -- 当前用户
     * @return String
     */
    public static String fillHead(String jsTblObj, 
    		List<Map<String,String>> lsHeadInfo,
    		Map<String,String> mpUser) {
        StringBuilder sbRet = new StringBuilder();
        if (lsHeadInfo == null || lsHeadInfo.isEmpty()) 
            return sbRet.toString();
        
        Map<String,String> mpHeadInfo = null;
        String strColName = null, strColValue = null, strColPostion = null, strStyle = null;
        String strValue = "";
        int posi[] = null;

        for (int i = 0, n = lsHeadInfo.size(); i < n; i++) {
            mpHeadInfo = lsHeadInfo.get(i);
            if (mpHeadInfo.isEmpty()) continue;

            strStyle = mpHeadInfo.get("format");
            strColName = mpHeadInfo.get("display");
            strColValue = mpHeadInfo.get("col_code");
            strColPostion = mpHeadInfo.get("col_pos");

            posi = getPosition(strColPostion);
            if (posi.length != 2) {
                _log.showWarn(strColName + " ["+strColPostion+"] position is error!");
                continue;
            }

            //设置指定坐标位置
            sbRet.append("posi[0] = " + posi[0] + ";\r\n");
            sbRet.append("posi[1] = " + posi[1] + ";\r\n");
            
            if (strColValue.equalsIgnoreCase("{CURUSERNAME}")) {
            //当前用户
                strValue = MapUtil.getValue(mpUser, "user_name");
            } else if (strColValue.equalsIgnoreCase("{CURDATE}")) {
            //当前日期
            	strValue = convertValue(DateUtil.getTodaySec(), strStyle);
            } else if (strColValue.equalsIgnoreCase("{CURDEPTNAME}")) {
            //当前部门
            	strValue = MapUtil.getValue(mpUser, "dept_name");
            } else {
            //设置cell的显示值
                strValue = strColValue;
                strValue = (strValue.equalsIgnoreCase("null"))?"":strValue;
            }

            //设置当前字段内容
            sbRet.append("cellValue = \"" + StringUtil.strForJson(strValue) + "\";\r\n");
            sbRet.append("f_setCellValueByPos(posi ,cellValue ,"+jsTblObj+");\r\n");
        }

        return sbRet.toString();
    }

    /**
     * 填写form格式的html报表
     * @param mpData -- 记录值
     * @param lsField -- 字段信息
     * @param mpUser -- 当前用户
     * @param jsTblObj -- 当前javascript中使用的table对象
     * @param curPage -- 当前页号，用于输出页码信息
     * @param sumPage -- 总页数，用于输出页码信息
     * @return String
     */
    public static String fillForm(
    		Map<String,String> mpData,
            List<Map<String,String>> lsField,
            Map<String,String> mpUser,
            String jsTblObj, int curPage, int sumPage) {
        StringBuffer sbRet = new StringBuffer();
        if (lsField == null || mpData == null) {
            return sbRet.toString();
        }
        if (lsField.isEmpty() || mpData.isEmpty()) {
            _log.showDebug("data is empty or field is null!");
            return sbRet.toString();
        }
        
        //单元格的值
        String strValue = "";
        for (int i = 0, n = lsField.size(); i < n; i++ ) {
            Map<String,String> mpField = lsField.get(i);
            
            String strStyle = mpField.get("format");                //字段格式
            String isOutZero = mpField.get("is_outzero");           //0是否输出
            if (isOutZero == null) isOutZero = "1";
            String strColName = mpField.get("display");             //字段名称
            String strColCode = (mpField.get("col_code")).toLowerCase();        //字段编码
            String strColTag = mpField.get("combo_code");           //标签
            
            int[] posi = getPosition(mpField.get("col_pos"));
            if (posi.length != 2) {
                _log.showWarn(strColName + " ["+posi+"] position is error!");
                continue;
            }

            //设置指定坐标位置
            sbRet.append("posi[0] = " + posi[0] + ";\r\n");
            sbRet.append("posi[1] = " + posi[1] + ";\r\n");

            if (strColCode.equalsIgnoreCase("{CURUSERNAME}")) {
            //当前用户
                strValue = MapUtil.getValue(mpUser, "user_name");
            } else if (strColCode.equalsIgnoreCase("{CURDATE}")) {
            //当前日期
            	strValue = convertValue(DateUtil.getTodaySec(), strStyle);
            } else if (strColCode.equalsIgnoreCase("{CURDEPTNAME}")) {
            //当前部门
            	strValue = MapUtil.getValue(mpUser, "dept_name");
            } else if (strColCode.equalsIgnoreCase("{CURPAGENUM}")) {
            //当前所在页数
                strValue = Integer.toString(curPage);
            } else if (strColCode.equalsIgnoreCase("{CURSUMPAGE}")) {
            //当前共页数
                strValue = Integer.toString(sumPage);
            } else {
            //设置cell的显示值，如果是图片字段，则不用处理
                if (!strStyle.equals("image")) {
                    strValue = mpData.get(strColCode);
                    strValue = (strValue != null)?strValue:"";
                    strValue = (strValue.equalsIgnoreCase("null"))?"":strValue;
                    
                    //取选项显示值
                    strValue = getComboTitle(strValue, strColTag);
                    //转换数据格式
                    strValue = convertValue(strValue, strStyle);
                    if (isOutZero.equals("0")) strValue = getZeroOut(strValue, strStyle);
                }
            }
            
            //设置当前字段内容
            sbRet.append("cellValue = \"" + StringUtil.strForJson(strValue) + "\";\r\n");
            sbRet.append("f_setCellValueByPos(posi ,cellValue ,"+jsTblObj+");\r\n");
        }

        return sbRet.toString();
    }
    
    /**
     * 填写grid格式的html报表
     * @param lsData -- 记录值
     * @param lsField -- 字段信息
     * @param mpUser -- 当前用户
     * @param jsTblObj -- 当前javascript中使用的table对象
     * @param pageSize -- 每页记录数
     * @param pos -- 偏移行数
     * @param curPage -- 当前页号，用于输出页码信息
     * @param sumPage -- 总页数，用于输出页码信息
     * @return
     */
	public static String fillGrid(
			List<Map<String,String>> lsData,
			List<Map<String,String>> lsField,
			Map<String, String> mpUser,
			String jsTblObj,
			int pageSize, int pos, int curPage, int sumPage) {
		StringBuffer sbRet = new StringBuffer();
		
		if (lsField == null || lsData == null) {
			_log.showWarn("data is null or field is null!");
			return sbRet.toString();
		}
		
		if (lsField.isEmpty() || lsData.isEmpty()) {
			_log.showDebug("data is empty or field is null!");
			return sbRet.toString();
		}
		
		String strValue = null;				//每个格的信息内容
		Map<String,String> mpData = null;	//每条记录数据
		Map<String,String> mpField = null;	//每条个字段的信息
		
		int posi = (pageSize > 0 && pos >= 0)?pos:0;
		int cnt = (pageSize <= 0)?lsData.size():pageSize + posi;
		int[] posis = new int[2];
		int index = 0, rowIndex = 0;
		int currRow = 0;
		int cntCol = 1; //合计列的位置
		String strStyle = null, strColName = null, strColCode = null, strColTag = null;
		
		//用于每页小计
		List<Map<String,String>> lsStatCol = getStatField(lsField);
		String isOutZero = "0";
		Map<String,String> mpStat = null, mpStatValue = FactoryUtil.newMap();
		String strCol = null;
		BigDecimal bdStat = null;
		boolean isStatCol = false;
		//用于每页小计
		
		for (rowIndex = posi, index = 0; rowIndex < cnt; rowIndex++, index++) {
			if (lsData.size() <= rowIndex) break;					//如果rowIndex大于记录数
			mpData = lsData.get(rowIndex);
			
			for (int i = 0, n = lsField.size(); i < n; i++ ) {
				mpField = lsField.get(i);
				isOutZero = mpField.get("is_outzero");
				if (isOutZero == null) isOutZero = "1";
				strStyle = mpField.get("format");					//字段格式
				
				strColName = mpField.get("display");				//字段名称
				strColCode = mpField.get("col_code").toLowerCase();	//字段编码
				strColTag = mpField.get("combo_code");				//标签
				
				posis = getPosition(mpField.get("col_pos"));
				if (posis.length != 2) {
					_log.showWarn(strColName + " ["+mpField.get("col_pos")+"] position is error!");
					continue;
				}
				currRow = posis[0] + index;
				
				//设置指定坐标位置
				posis[0] = posis[0] + index;
				sbRet.append("posi[0] = " + posis[0] + ";\r\n");
				sbRet.append("posi[1] = " + posis[1] + ";\r\n");
				
				if (strColCode.equalsIgnoreCase("{CURUSERNAME}")) {
				//当前用户
					strValue = MapUtil.getValue(mpUser, "user_name");
				} else if (strColCode.equalsIgnoreCase("{CURDATE}")) {
				//当前日期
					strValue = convertValue(DateUtil.getTodaySec(), strStyle);
				} else if (strColCode.equalsIgnoreCase("{CURDEPTNAME}")) {
				//当前部门
					strValue = MapUtil.getValue(mpUser, "dept_name");
				} else if (strColCode.equalsIgnoreCase("{NUMBER}")) {
				//输出序号
					strValue = Integer.toString(rowIndex+1);
					cntCol = (short)posis[1];
				} else if (strColCode.equalsIgnoreCase("{CURPAGENUM}")) {
				//当前所在页数
					strValue = Integer.toString(curPage);
				} else if (strColCode.equalsIgnoreCase("{CURSUMPAGE}")) {
				//当前共页数
					strValue = Integer.toString(sumPage);
				} else {
				//设置cell的显示值
					strValue = mpData.get(strColCode);
					//如果已经设置了0值不输出，并且当前值就是0，则输出空字符串
					strValue = (strValue != null)?strValue:"";
					strValue = (strValue.equalsIgnoreCase("null"))?"":strValue;
				
					//真实值与显示值
					strValue = getComboTitle(strValue, strColTag);
					//转换数据格式
					strValue = convertValue(strValue, strStyle);
					if (isOutZero.equals("0")) strValue = getZeroOut(strValue, strStyle);
				}

	            //设置当前字段内容
	            sbRet.append("cellValue = \"" + StringUtil.strForJson(strValue) + "\";\r\n");
	            sbRet.append("f_setCellValueByPos(posi ,cellValue ,"+jsTblObj+");\r\n");
				
				if (!lsStatCol.isEmpty()) {
					for (int iStat = 0, statNum = lsStatCol.size(); iStat < statNum; iStat++) {
						mpStat = lsStatCol.get(iStat);
						
						if (mpStat.isEmpty()) continue;
						strCol = ( mpStat.get("col_code")).toLowerCase();					
						if (strColCode.equalsIgnoreCase(strCol)) {
							isStatCol = true;
					
							if (mpStatValue.get(strCol) == null) bdStat = new BigDecimal("0");
							else bdStat = new BigDecimal(mpStatValue.get(strCol));
					
							if (strValue.length() == 0) strValue = "0";
							mpStatValue.put(strCol, bdStat.add(new BigDecimal(strValue)).toString());
						}
					}
				}
			}
		}

		//填写每页小计
		if (isStatCol == true) {
			currRow ++;
			sbRet.append("posi[0] = " + currRow + ";\r\n");
			sbRet.append("posi[1] = " + cntCol + ";\r\n");
            sbRet.append("cellValue = \"小计\";\r\n");
            sbRet.append("f_setCellValueByPos(posi ,cellValue ,"+jsTblObj+");\r\n");
			
			for (int i = 0, colNum = lsStatCol.size(); i < colNum; i ++){
				mpField = lsStatCol.get(i);
				posis = getPosition(mpField.get("col_pos"));
				
				strColCode = (mpField.get("col_code")).toLowerCase();
				strValue = mpStatValue.get(strColCode);
				strStyle = mpField.get("format");
				strValue = convertValue(strValue, strStyle);
				
				sbRet.append("posi[0] = " + currRow + ";\r\n");
				sbRet.append("posi[1] = " + posis[1] + ";\r\n");
	            sbRet.append("cellValue = \""+ strValue +"\";\r\n");
	            sbRet.append("f_setCellValueByPos(posi ,cellValue ,"+jsTblObj+");\r\n");
			}
		}

		return sbRet.toString();
	}

    /**
     * 先找该报表是否有审批信息报表输出定义，取定义信息；
     * 然后根据数据ID、过程ID、节点ID找审批信息，如果有则输出；
     * @param funId -- 功能ID
     * @param areaId -- 报表区域ID
     * @param jsTblObj -- 当前javascript中使用的table对象
     * @param mpData -- 记录值
     * @param mpUser -- 当前用户
     * @return
     */
    public static String fillCheckInfo(String funId, String areaId, String jsTblObj, 
    		Map<String,String> mpData,
    		Map<String,String> mpUser) {
        //取审批信息报表输出定义
        List<Map<String,String>> lsField = ReportDao.getAreaWfCol(areaId);
        if (lsField == null || lsField.isEmpty()) {
            _log.showDebug("--------outCheckInfo(): not find report detail wfcol.");
            return "";
        }
        
        String curUserId = MapUtil.getValue(mpUser, "user_id");
        //取记录主键值
        String dataId = getKeyValue(funId, mpData);
        
        StringBuilder sbRet = new StringBuilder(); 
        //保存已取审批信息的节点ID
        String preNodeId = "";
        Map<String,String> mpSign = null;
        //保存取出的审批信息
        Map<String,String> mpCheck = null;
        List<Map<String,String>> lsCheck = null;
        //同一审批节点中的其它人的审批意见
        String allCheckDesc = "";
        for (int i = 0, n = lsField.size(); i < n; i++) {
            Map<String,String> mpField = lsField.get(i);
            
            String strStyle = mpField.get("format");
            String nodeId = mpField.get("node_id");
            String colCode = mpField.get("col_code");
            String colPos = mpField.get("col_pos");
            String viewPos = mpField.get("view_pos");
            String processId = mpField.get("process_id");
            
            //如果是同一个节点，则不用重新去审批信息，否则需要取审批信息，
            //因为一个节点有三个字段的信息要输出到报表中：check_userid, check_user, check_date, check_desc
            if (!preNodeId.equals(nodeId)) {
            	mpSign = ReportDao.getNodeAttr(processId, nodeId);
            	lsCheck = ReportDao.getCheckInfo(funId, dataId, processId, nodeId);
            	allCheckDesc = getCheckDesc(lsCheck);
            }
            if (lsCheck == null || lsCheck.isEmpty()) continue;
            mpCheck = lsCheck.get(0);
            
            int[] posi = getPosition(colPos);
            if (posi.length != 2) {
                _log.showWarn(colCode + " ["+posi+"] position is error!");
                continue;
            }

            //设置指定坐标位置
            sbRet.append("posi[0] = " + posi[0] + ";\r\n");
            sbRet.append("posi[1] = " + posi[1] + ";\r\n");
            
            String valHtml = "";
            String scriptFun = "f_setCellValueByPos(";
            String userId = mpCheck.get("check_userid");
            //如果显示部门印章，如果没有设置印章，则直接退出
            if (colCode.equals("check_sign")) {
            	valHtml = signPicHtml(userId, curUserId, colCode, mpSign);
            	if (valHtml.length() == 0) continue;
            	
            	int[] vpos = getPosition(viewPos);
            	if (vpos.length != 2) {
            		scriptFun = "f_setCellPic(180, 180, 0, 0, ";
            	} else {
            		scriptFun = "f_setCellPic(180, 180, "+ vpos[0] +", "+ vpos[1] +", ";
            	}
            } else if (colCode.equals("check_user")) {
            	valHtml = signPicHtml(userId, curUserId, colCode, mpSign);
            	if (valHtml.length() == 0) {
            		valHtml = mpCheck.get(colCode);
            	} else {
            		int[] vpos = getPosition(viewPos);
                	if (vpos.length != 2) {
                		scriptFun = "f_setCellPic(150, 75, 0, 0, ";
                	} else {
                		scriptFun = "f_setCellPic(150, 75, "+ vpos[0] +", "+ vpos[1] +", ";
                	}
            	}
            } else if (colCode.equals("check_desc")) {
            	valHtml = StringUtil.strForJson(allCheckDesc);
            } else {
            	valHtml = mpCheck.get(colCode);
            	valHtml = convertValue(valHtml, strStyle);
            	valHtml = StringUtil.strForJson(valHtml);
            }
            _log.showDebug("................checkfield={0}; checkvalue={1}; reportpos={2}", colCode, valHtml, colPos);
            
            //设置当前字段内容
            sbRet.append("cellValue = \"" + valHtml + "\";\r\n");
            sbRet.append(scriptFun + "posi ,cellValue ,"+jsTblObj+");\r\n");
        }
        
        return sbRet.toString();
    }
    
    /**
     * 取一个审批环节的重新分配人的审批消息，第一个审批人的时间、人、部门印章输出到其它指定位置
     * @param lsCheck
     * @return
     */
    private static String getCheckDesc(List<Map<String,String>> lsCheck) {
    	if (lsCheck == null || lsCheck.isEmpty()) return "";
    	
    	StringBuilder sbdes = new StringBuilder();
    	for (int i = 0, n = lsCheck.size(); i < n; i++) {
    		Map<String,String> mpCheck = lsCheck.get(i);
    		
    		String check_user = mpCheck.get("check_user");
    		String check_date = mpCheck.get("check_date");
    		String check_desc = mpCheck.get("check_desc");
    		//只取审批日期
    		if (check_date.length() > 0) {
    			check_date = check_date.split(" ")[0];
    		}
    		
    		if (i == 0 && n == 1) {
    			sbdes.append(check_desc);
    		} else {
    			sbdes.append("<br>" + check_date + " " + check_user + " 【" + check_desc + "】");
    		}
    	}
    	
    	return sbdes.toString();
    }
    
    /**
     * 取是否有印章文件
     * @param userId -- 用户ID
     * @param colCode -- 报表字段名
     * @param mpSign -- 是否显示印章的设置信息
     * @return
     */
    private static String signPicHtml(String userId, String curUserId, 
    		String colCode, Map<String,String> mpSign) {
    	if (userId == null || userId.length() == 0 || 
    			mpSign == null || mpSign.isEmpty() ||
    			colCode == null || colCode.length() == 0) return "";
    	
    	if (colCode.equals("check_user")) {
    		//流程节点是否显示个人签名
    		String use = mpSign.get("user_sign");
    		if (use.equals("1")) {
    			return SignPicUtil.getUserSign(userId, curUserId);
    		}
    	} else if (colCode.equals("check_sign")) {
    		//流程节点是否显示部门印章
    		String use = mpSign.get("dept_sign");
    		if (use.equals("1")) {
    			return SignPicUtil.getDeptSign(userId, curUserId);
    		}
    	}
    	
    	return "";
    }
}

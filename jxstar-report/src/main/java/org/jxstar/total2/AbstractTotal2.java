package org.jxstar.total2;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.jxstar.dao.BaseDao;
import org.jxstar.dao.DaoParam;
import org.jxstar.dao.pool.DataSourceConfig;
import org.jxstar.report.ReportException;
import org.jxstar.total.AbstractTotal;
import org.jxstar.total.util.Expression;
import org.jxstar.total.util.TotalDao;
import org.jxstar.total.util.TotalUtil;
import org.jxstar.util.MapUtil;
import org.jxstar.util.StringFormat;
import org.jxstar.util.StringValidator;
import org.jxstar.util.factory.FactoryUtil;
import org.jxstar.util.log.Log;

/**
 * 统计报表实现的抽象类。
 *
 * @author TonyTan
 * @version 1.0, 2011-11-30
 */
public abstract class AbstractTotal2 extends AbstractTotal {
	
	/**
	 * 获取横向分类区域结果集
	 * @param reportId -- 报表定义ID
	 * @return List
	 * @throws ReportException
	 */
	protected List<Map<String,String>> getCrossData(String reportId) throws ReportException {
		List<Map<String,String>> lsData = FactoryUtil.newList();
		List<Map<String,String>> lsArea =  TotalDao.queryTotalArea(reportId, "cross");

		for (int i = 0, n = lsArea.size(); i < n; i++) {
			Map<String,String> mpArea = lsArea.get(i);
			
			lsData = queryAssort(lsData, mpArea);
		}

		return lsData;
	}

	/**
	 * 先根据统计SQL获取统计数据，然后再根据横向分类与纵向分类重新组织数据到新的Map中
	 * 统计SQL定义一般需要Group By：纵向分类ID、横向分类ID，如：
	 * select dept_id, product_id, sum(num) as sum_num, sum(money) as sum_money from ...
	 * @param reportId -- 报表定义ID
	 * @param lsYTypeData -- 统计分类数据
	 * @param lsXTypeData -- 横向分类数据
	 * @return List
	 * @throws ReportException
	 */
	protected List<Map<String,String>> getTotalData(String reportId, 
			List<Map<String,String>> lsYTypeData, 
			List<Map<String,String>> lsXTypeData) throws ReportException {
		List<Map<String,String>> lsRet = null;
		
		List<Map<String,String>> lsArea =  TotalDao.queryTotalArea(reportId, "query");
		if (lsArea.isEmpty() || lsArea.size() > 1) {
			throw new ReportException("二维动态统计报表暂时只支持一个统计区域！");
		}
		
		//取统计区域ID
		Map<String,String> mpArea = lsArea.get(0);
		String areaId = mpArea.get("area_id");
		
		//取横向分类ID字段
		String xTypeField = DealUtil.getTypeField(reportId, "cross");
		
		//取纵向分类ID字段
		String yTypeField = DealUtil.getTypeField(reportId, "assort");
		
		//统计数据
		List<Map<String,String>> lsTotalData = totalArea(mpArea);
		
		//重新组合统计数据
		if (!lsYTypeData.isEmpty() && !lsXTypeData.isEmpty()) {
			if (xTypeField.length() == 0 || yTypeField.length() == 0) {
				throw new ReportException("二维动态统计报表的分类区域中的类型ID字段不能为空！");
			}
			
			DealDataXY dealXY = new DealDataXY(
					areaId, 
					xTypeField, 
					yTypeField, 
					lsTotalData, 
					lsXTypeData, 
					lsYTypeData);
			
			lsRet = dealXY.returnTotalData();
		} else if (!lsYTypeData.isEmpty()) {
			if (yTypeField.length() == 0) {
				throw new ReportException("二维动态统计报表的分类区域中的类型ID字段不能为空！");
			}
			
			DealDataY dealY = new DealDataY(
					areaId, 
					yTypeField, 
					lsTotalData, 
					lsYTypeData);
			
			lsRet = dealY.returnTotalData();
		} else {
			lsRet = lsTotalData;
		}
		

		return lsRet;
	}
	
	/**
	 * 获取一个区域中的一条统计数据，修改为：
	 * 不需要内部统计参数，采用Group By typeId的方式定义统计SQL
	 * 
	 * @param mpArea -- 区域定义信息
	 * @return Map
	 * @throws ReportException
	 */
	private List<Map<String,String>> totalArea(Map<String,String> mpArea)
		throws ReportException {
		List<Map<String,String>> lsRet = null;
		//暂时改为不需要内部统计参数，提高统计效率
		Map<String,String> mpParam = FactoryUtil.newMap();
		
		//获取区域SQL语句
		String areaName = mpArea.get("area_name");
		String strSQL[] = getAreaSQL(mpArea, mpParam);
		_log.showDebug("[" + areaName + "] area sql[0] = " + strSQL[0]);
		_log.showDebug("[" + areaName + "] area sql[1] = " + strSQL[1]);
		_log.showDebug("[" + areaName + "] area sql[2] = " + strSQL[2]);

		//取数据源名称
		String dsName = MapUtil.getValue(mpArea, "ds_name", 
							DataSourceConfig.getDefaultName());

		DaoParam param = _dao.createParam(strSQL[0]);
		param.setDsName(dsName);
		param.setValue(strSQL[1]);
		param.setType(strSQL[2]);
		
		lsRet = _dao.query(param);
		
		//处理统计结果中的0，根据统计字段设置是保留还是去掉
		String areaId = mpArea.get("area_id");
		lsRet = TotalUtil.writeZero(lsRet, areaId);
		
		return lsRet;
	}
	
	/**
	 * 处理各区域中的表达式字段数据:
	 * 增加横向分类动态报表的计算字段处理：
	 * 有多少个动态分类值，就重新构建多少个表达式，需要修改表达值中的字段名
	 * @param reportId -- 报表ID
	 * @param lsData -- 统计数据
	 * @param lsXTypeData -- 横向分类数据
	 * @return
	 */
	protected List<Map<String,String>> calcTotalData(String reportId, 
			List<Map<String,String>> lsData, 
			List<Map<String,String>> lsXTypeData) {
		Map<String,String> mpData = null, mpItem = null;
		String express = null, colcode = null, value = null;
		
		List<Map<String,String>> lsExpress = TotalDao.queryExpress(reportId);
		
		//给表达式与字段名添加分类值：express, col_code
		if (!lsXTypeData.isEmpty()) {
			String xTypeField = DealUtil.getTypeField(reportId, "cross");
			if (xTypeField.length() > 0) {
				DealExpress.dealExpress(xTypeField, lsExpress, lsXTypeData);
			}
		}
		
		for (int i = 0, n = lsData.size(); i < n; i++) {
			mpData = lsData.get(i);

			for (int j = 0, m = lsExpress.size(); j < m; j++) {
				mpItem = lsExpress.get(j);
				express = mpItem.get("express");
				colcode = mpItem.get("col_code");
				
				//计算表达式的值
				value = Expression.calc(mpData, express);
				mpData.put(colcode, value);
			}
		}

		return lsData;
	}

	/**
	 * 处理各区域中的合计字段数据
	 * @param reportId -- 报表ID
	 * @param lsData -- 统计数据
	 * @param typeId -- 横向分类ID值
	 * @return
	 */
	protected List<Map<String,String>> calcSumItem(String reportId, 
			List<Map<String,String>> lsData,
			String typeId) {
		Map<String,String> mpItem = null, mpRet = null;
		String isstat = null, colcode = null, value = null, express = null;
		BigDecimal bdResult = null;

		Map<String,String> mpTotal = FactoryUtil.newMap();
		boolean isTotal = false;

		String sumTitle = "";
		List<Map<String,String>> lsDetail = TotalUtil.queryColumn(reportId);
		for (int i = 0, n = lsDetail.size(); i < n; i++) {
			mpItem = lsDetail.get(i);
			isstat = MapUtil.getValue(mpItem, "is_stat", "0");
			colcode = mpItem.get("col_code");
			
			//添加横向分类ID值，因为横向动态列的字段名不同
			if (isstat.equals("1") && typeId != null && typeId.length() > 0) {
				colcode = DealUtil.fieldFlag(colcode, typeId);
			}

			//第一个显示字段，且不是统计字段显示'合计'
			if (!isstat.equals("1")) {
				String isshow = MapUtil.getValue(mpItem, "is_show", "0");
				if (isshow.equals("1") && sumTitle.length() == 0) {
					sumTitle = "合计";
					mpTotal.put(colcode, sumTitle);
				} else {
					mpTotal.put(colcode, "");
				}
				continue;
			}
			
			//带除法的表达式不能直接求和			
			express = mpItem.get("express");
			if(express.indexOf("/") > 0) continue;

			bdResult = new BigDecimal(0);
			for (int j = 0, m = lsData.size(); j < m; j++) {
				mpRet = lsData.get(j);
				value = mpRet.get(colcode);
				
				if (value == null || value.length() == 0) continue;

				if (!StringValidator
					.validValue(value, StringValidator.DOUBLE_TYPE))
					continue;

				bdResult = bdResult.add(new BigDecimal(value));
				isTotal = true;
			}
			//_log.showDebug("..................bdResult.toString() = " + bdResult.toString());
			mpTotal.put(colcode, bdResult.toString());
		}
		//_log.showDebug("..................mpTotal = " + mpTotal.toString());
		//带除法的表达式按算法求和			
		if (isTotal == true) {
			for (int i = 0, n = lsDetail.size(); i < n; i++) {
				mpItem = lsDetail.get(i);
				express = mpItem.get("express");
				if(express.length() == 0 || express.indexOf("/") <= 0) continue;
				colcode = mpItem.get("col_code");
				
				//给表达式中的字段添加“__类别ID”
				if (typeId != null && typeId.length() == 0) {
					express = DealExpress.pareseExpress(express, typeId);
					colcode = DealUtil.fieldFlag(colcode, typeId);
				}
				
				//计算表达式的值
				value = Expression.calc(mpTotal, express);
				mpTotal.put(colcode, value);
			}
		}
		_log.showDebug(".................mpTotal = " + mpTotal.toString());
		if (isTotal == true) lsData.add(mpTotal);

		return lsData;
	}
}

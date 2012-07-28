package org.jxstar.total2;

import java.util.List;
import java.util.Map;

import org.jxstar.report.ReportException;
import org.jxstar.util.factory.FactoryUtil;

/**
 * 动态二维统计的报表的实现类。
 * 不支持多级分类统计，支持一个统计结果动态纵向分配与动态横向分配数据。
 *
 * @author TonyTan
 * @version 1.0, 2011-11-30
 */
public class ReprotTotal2Imp extends AbstractTotal2 {

	/**
	 * 输出统计数据
	 */
	public List<Map<String,String>> outputTotal() throws ReportException {
		List<Map<String,String>> lsRet = FactoryUtil.newList();
		//返回纵向分类数据
		List<Map<String,String>> lsAssort = getAssortData(_reportId);
		
		//返回横向分类数据
		List<Map<String,String>> lsCross = getCrossData(_reportId); //2 add
		
		//获取各区域统计数据
		lsRet = getTotalData(_reportId, lsAssort, lsCross);

		//处理各区域中的表达式字段数据
		lsRet = calcTotalData(_reportId, lsRet, lsCross); //2 add

		//处理纵向各区域中的合计字段数据
		if (lsCross.isEmpty()) {
			lsRet = calcSumItem(_reportId, lsRet, "");
		} else {//2 add
			for (Map<String,String> mpCross : lsCross) {
				String field = DealUtil.getTypeField(_reportId, "cross");
				String typeId = mpCross.get(field);
				lsRet = calcSumItem(_reportId, lsRet, typeId);
			}
		}
		
		//处理横向分类的合计区域数据 //2 add

		return lsRet;
	}

}

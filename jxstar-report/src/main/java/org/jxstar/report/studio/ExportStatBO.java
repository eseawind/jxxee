/*
 * ExportStatBO.java 2010-12-14
 * 
 * Copyright 2010 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
package org.jxstar.report.studio;

import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.util.CellRangeAddress;


import org.jxstar.control.action.RequestContext;
import org.jxstar.dao.DaoParam;
import org.jxstar.service.BoException;
import org.jxstar.service.BusinessObject;
import org.jxstar.service.studio.GroupStatBO;
import org.jxstar.util.StringUtil;
import org.jxstar.util.factory.FactoryUtil;
import org.jxstar.util.resource.JsMessage;

/**
 * 导出分组统计中的数据xls文件中。
 *
 * @author TonyTan
 * @version 1.0, 2010-12-14
 * @deprecated 暂不使用，统计数据直接在前台保存为csv格式的数据了。
 */
public class ExportStatBO extends BusinessObject {
	private static final long serialVersionUID = 1L;
	//统计对象
	private GroupStatBO statbo = new GroupStatBO();

	public String exportXls(RequestContext request) {
		//取统计数据
		DaoParam param = null;
		try {
			param = statbo.statDaoParam(request);
		} catch (BoException e) {
			_log.showError(e);
			setMessage(e.getMessage());
			return _returnFaild;
		}
		
		List<Map<String,String>> lsData = _dao.query(param);
		_log.showDebug("===============exp file query data size=" + lsData.size());
		
		//构建统计数据表格相关字段
		List<Map<String, String>> lsCol;
		try {
			lsCol = statField(request);
		} catch (BoException e) {
			_log.showError(e);
			setMessage(e.getMessage());
			return _returnFaild;
		}
		
		//设置响应头信息
		request.setRequestValue("ContentType", "application/vnd.ms-excel");
		//"分组统计数据.xls"
		request.setRequestValue("Attachment", JsMessage.getValue("exportstatbo.stat"));
		//返回xls文件对象
		HSSFWorkbook wbRet = writeBook(lsData, lsCol);
		request.setReturnObject(wbRet);
		
		_log.showDebug("---------file output end!");
		
		return _returnSuccess;
	}
	
	/**
	 * 字段数组保存到列表中
	 * @param request -- 请求对象
	 * @return
	 * @throws BoException
	 */
	private List<Map<String,String>> statField(RequestContext request) throws BoException {
		//取分组字段与统计字段
		String charField = request.getRequestValue("charfield");
		String numField = request.getRequestValue("numfield");
		String[] fields = statbo.getFieldCodes(charField, numField);
		
		//取分组字段与统计字段标题
		String charFieldTitle = request.getRequestValue("charfieldTitle");
		String numFieldTitle = request.getRequestValue("numfieldTitle");
		String[] titles = statbo.getFieldTitles(charFieldTitle, numFieldTitle);
		
		if (fields.length != titles.length) {
			throw new BoException(JsMessage.getValue("exportxlsbo.fieldnum.error"));
		}
		
		//字段数组保存到列表中
		List<Map<String,String>> lsField = FactoryUtil.newList();
		for (int i = 0, n = fields.length; i < n; i++) {
			Map<String,String> mpField = FactoryUtil.newMap();
			mpField.put("col_code", fields[i]);
			mpField.put("col_name", titles[i]);
			
			lsField.add(mpField);
		}
		
		return lsField;
	}
	
	/**
	 * 把数据写入workbook中
	 * @param lsData -- 数据内容
	 * @param lsCol -- 字段列表
	 * @return
	 */
	private HSSFWorkbook writeBook(List<Map<String,String>> lsData, List<Map<String,String>> lsCol) {
		//创建excel对象
		HSSFWorkbook wbRet = new HSSFWorkbook();

		//新建一个sheet
		HSSFSheet shSheet = wbRet.createSheet();
		
		//设置sheet页名称
		String title = "分组统计数据";
		wbRet.setSheetName(0, title);
		
		//创建CellFont[一般表格字体]
		HSSFFont cellFont = wbRet.createFont();
		cellFont.setFontName("宋体");
		cellFont.setFontHeightInPoints((short) 9);

		//创建CellStyle[中间对齐]
		HSSFCellStyle cellStyle = wbRet.createCellStyle();
		cellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER_SELECTION);
		cellStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
		cellStyle.setFont(cellFont);
		
		//建标题区域
		shSheet = createTitleArea(title, lsCol, cellStyle, shSheet);
		
		//设置内容对齐方式
		cellStyle.setAlignment(HSSFCellStyle.ALIGN_LEFT);
		for (int i = 0, n = lsData.size(); i < n; i++) {
			Map<String,String> mpData = lsData.get(i);
			
			HSSFRow hfRow = shSheet.createRow(i+3);
			HSSFCell sfCell = hfRow.createCell(0);
			
			for (int j = 0, m = lsCol.size(); j < m; j++) {
				Map<String,String> mpcol = lsCol.get(j);
				String colcode = StringUtil.getNoTableCol(mpcol.get("col_code"));					
				String colvalue = mpData.get(colcode);
				if (colvalue == null) colvalue = "";

				sfCell = hfRow.createCell(j+1);
				sfCell.setCellType(HSSFCell.CELL_TYPE_STRING);
				sfCell.setCellValue(colvalue);
				sfCell.setCellStyle(cellStyle);
			}
		}
		
		return wbRet;
	}
	
	/**
	 * 设置输出文件的头部
	 * @param fileTitle -- 表格标题
	 * @param lsCol -- 字段标题数组
	 * @param titleStyle -- 标题样式
	 * @param cellStyle -- 表头字段样式
	 * @param sheet -- 表格
	 * @return
	 */
	private HSSFSheet createTitleArea(String fileTitle,List<Map<String,String>> lsCol, 
										HSSFCellStyle cellStyle, HSSFSheet sheet) {
		HSSFCell sfCell = null;
		int rsCnt = lsCol.size() + 1;
		
		//创建CellFont[标题字体]
		HSSFFont cellTitleFont = sheet.getWorkbook().createFont();
		cellTitleFont.setFontName("楷体_GB2312");
		cellTitleFont.setFontHeightInPoints((short) 20);
		cellTitleFont.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
		
		//创建CellStyle[标题样式]
		HSSFCellStyle titleStyle = sheet.getWorkbook().createCellStyle();
		titleStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER_SELECTION);
		titleStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
		titleStyle.setFont(cellTitleFont);

		//第一行，空行
		HSSFRow hfRow = sheet.createRow(0);
		hfRow.setHeightInPoints(10);
		for (int i = 0, n = rsCnt; i < n; i++) {
			sfCell = hfRow.createCell(i);
			sheet.setColumnWidth(i, 4000);
		}
		sfCell = hfRow.getCell(0);
		sheet.setColumnWidth(0, 448); //设置第一列的宽度

		//第二行，设置标题栏--------------------------------------------
		hfRow = sheet.createRow(1);
		hfRow.setHeightInPoints(25);
		for (int i = 0, n = rsCnt; i < n; i++) {
			sfCell = hfRow.createCell(i);
		}
		//合并单元格，取中间的6格合并
		int posi = rsCnt / 2;
		int fromCell = (((posi - 2) < 0) ? 0 : (posi - 2));
		int toCell = (((rsCnt - posi) < 0) ? 0 : (rsCnt - posi + 2));
		
		CellRangeAddress range = new CellRangeAddress(1, 1, fromCell, toCell);
		sheet.addMergedRegion(range);

		//设置标题单元格样式和内容
		sfCell = hfRow.getCell(fromCell);
		sfCell.setCellType(HSSFCell.CELL_TYPE_STRING);
		sfCell.setCellValue(fileTitle);
		sfCell.setCellStyle(titleStyle);

		//第三行，设置列表头--------------------------------------------
		hfRow = sheet.createRow(2);
		for (int i = 0, n = rsCnt; i < n; i++) {
			sfCell = hfRow.createCell(i);

			if (i != 0) {
				String colname = lsCol.get(i-1).get("col_name");

				sfCell.setCellType(HSSFCell.CELL_TYPE_STRING);
				sfCell.setCellValue(colname);
				sfCell.setCellStyle(cellStyle);
			}
		}
		
		return sheet;
	}
}

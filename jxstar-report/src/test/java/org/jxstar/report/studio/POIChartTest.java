/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.report.studio;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.jxstar.util.factory.FactoryUtil;

/**
 * POI操作Excel图表示例。
 *
 * @author TonyTan
 * @version 1.0, 2012-4-19
 */
public class POIChartTest {

	public static void main(String[] args) {
		writeData();
	}

	public static void writeData() {
		HSSFWorkbook wb = null;
		try {
			FileInputStream fis = new FileInputStream("d:/TplColumn.xls");
			POIFSFileSystem fs = new POIFSFileSystem(fis);
			fis.close();
			wb = new HSSFWorkbook(fs);
		} catch (Exception e) {
			e.printStackTrace();
			return;
		}
		HSSFSheet sheet = wb.getSheetAt(0);
		
		//取表单中的名称信息
		System.out.println("s1y=" + wb.getName("s1y").getRefersToFormula());
		System.out.println("s2y=" + wb.getName("s2y").getRefersToFormula());
		//s1y=OFFSET(Sheet1!$C$3,0,0,COUNTA(Sheet1!C:C)-1,1)
		//s2y=OFFSET(Sheet1!$B$3,0,0,COUNTA(Sheet1!B:B)-1,1)
		
		String title = "统计结果";
		List<Map<String,String>> lsCol = FactoryUtil.newList();
		Map<String,String> mp1 = FactoryUtil.newMap();
		Map<String,String> mp2 = FactoryUtil.newMap();
		Map<String,String> mp3 = FactoryUtil.newMap();
		mp1.put("col_name", "序号");
		mp2.put("col_name", "部门");
		mp3.put("col_name", "数量");
		lsCol.add(mp1);lsCol.add(mp2);lsCol.add(mp3);
		
		HSSFCell sfCell = null;
		int rsCnt = lsCol.size();
		

		//第二行，设置标题栏
		HSSFRow hfRow = sheet.createRow(0);
		hfRow.setHeightInPoints(22);
		sfCell = hfRow.createCell(0);
		sfCell.setCellType(HSSFCell.CELL_TYPE_STRING);
		sfCell.setCellValue(title);

		//第三行，设置列表头
		hfRow = sheet.createRow(1);
		for (int i = 0, n = rsCnt; i < n; i++) {
			sfCell = hfRow.createCell(i);

			String colname = lsCol.get(i).get("col_name");

			sfCell.setCellType(HSSFCell.CELL_TYPE_STRING);
			sfCell.setCellValue(colname);
			//sfCell.setCellStyle(createHeadStyle(wb));
		}
		
		createRow(2, sheet);
		createRow(3, sheet);
		createRow(4, sheet);
		createRow(5, sheet);
		createRow(6, sheet);

		try {
			FileOutputStream fileOut = new FileOutputStream("d:/workbook.xls");
			wb.write(fileOut);
			fileOut.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		//return sheet;
	}
	
	private static void createRow(int index, HSSFSheet sheet) {
		HSSFCell sfCell = null;
		HSSFRow hfRow = sheet.createRow(index);
		for (int i = 0, n = 3; i < n; i++) {
			sfCell = hfRow.createCell(i);
			sfCell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
			sfCell.setCellValue(20+index);
			//sfCell.setCellStyle(createHeadStyle(wb));
		}
	}
}

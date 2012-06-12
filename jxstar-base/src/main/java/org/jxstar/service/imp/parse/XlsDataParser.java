/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.service.imp.parse;

import java.io.IOException;
import java.io.InputStream;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

/**
 * 解析导入文件XLS中的数据
 *
 * @author TonyTan
 * @version 1.0, 2012-6-11
 */
public class XlsDataParser implements DataParser {
	private int _rowsNum = 0;
	private int _colsNum = 0;
	private int _firstRow = 0;
	private HSSFSheet _sheet = null;
	
	/**
	 * 加载导入数据
	 */
	public void init(InputStream inputStream, int firstRow) {
		HSSFWorkbook wb;
		try {
			wb = new HSSFWorkbook(inputStream);
			_sheet = wb.getSheetAt(0);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		_firstRow = firstRow;
		
		//初始化行数与列数
		if (_sheet != null) {
			_rowsNum = _sheet.getLastRowNum();
			_rowsNum++;
			
			HSSFRow row = _sheet.getRow(_firstRow);
			if (row == null) {
				_colsNum = -1;
			} else {
				_colsNum = row.getLastCellNum();
				_colsNum++;
			}
		}
	}
	
	public int getFirstRow() {
		return _firstRow;
	}
	
	/**
	 * 返回数据总行数，不含标题与表头
	 * @return
	 */
	public int getRowsNum() {
		return _rowsNum;
	}
	
	/**
	 * 返回数据总列数
	 * @return
	 */
	public int getColsNum() {
		return _colsNum;
	}
	
	/**
	 * 返回指定行、列位置的数据，0为起始位置
	 * @param rowIndex
	 * @param colIndex
	 * @return
	 */
	public String getData(int rowIndex, int colIndex) {
		if (_sheet == null) return "";
		if (rowIndex < 0 || rowIndex >= _rowsNum) return "";
		if (colIndex < 0 || colIndex >= _colsNum) return "";
		
		
		HSSFRow row = _sheet.getRow(rowIndex);
		if (row != null) {
			HSSFCell cell = row.getCell(colIndex);
			if (cell != null) {
				int itype = cell.getCellType();
				if (HSSFCell.CELL_TYPE_NUMERIC == itype) {
					return Double.toString(cell.getNumericCellValue());
				} else {
					return cell.getStringCellValue();
				}
			}
		}
		
		return "";
	}
}

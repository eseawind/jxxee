package org.jxstar.report.studio;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;

import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;


import org.jxstar.report.util.ReportXlsUtil;
import org.jxstar.test.AbstractTest;
import org.jxstar.util.FileUtil;
import org.jxstar.util.log.Log;

public class AddImageTest extends AbstractTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {

		Log _log = Log.getInstance();
		_log.showDebug("======debug");
		_log.showWarn("======error1");
		_log.showWarn("======error2");
		_log.showWarn("======error3");
		_log.showWarn("======error4");
		
		String fname = "d:/bb.txt";
		String content = "你好啊实地是大方说的方式打法是大法师的发生的\n";
		try {
			
			
			FileOutputStream fout = new FileOutputStream(fname.toString(), true);
			
			OutputStreamWriter out = new OutputStreamWriter(fout);
			//fout.write(content.getBytes());
			out.write(content);
			
			out.flush();
			out.close();
			//fout.flush();
			//fout.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		//new OutputStreamWriter(output);
		/*
		try {
			FileHandler fh = new FileHandler("d:/bb.txt", 0, 1, true);
			
			
		} catch (SecurityException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}*/
		
		//AddImageTest.copySheetImage1();
	}
	
	public static void copySheetImage1() {
		try {
		     HSSFWorkbook mainbook = ReportXlsUtil.readWorkBook("d:/ff.xls");
		     HSSFWorkbook subbook = ReportXlsUtil.readWorkBook("d:/ff.xls");
		     
		     ReportXlsUtil.appendSheet(mainbook.getSheetAt(0), subbook.getSheetAt(0));
		     
		     FileOutputStream fos = new FileOutputStream("d:/ee1.xls");
		     mainbook.write(fos);
		     fos.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/**
	 * 复制一张含有图片的sheet到另一个xls文件中。
	 */
	/*public static void copySheetAndImgToXls() {
		ReportImageUtil addImage = new ReportImageUtil();
	     double w = 49 / ConvertImageUnits.PIXELS_PER_MILLIMETRES;
	     double h = 44 / ConvertImageUnits.PIXELS_PER_MILLIMETRES;
		
		try {
		     File file = new File("d:/ee.xls");
		     FileInputStream fis = new FileInputStream(file);
		     HSSFWorkbook workbook = new HSSFWorkbook(fis);

		     HSSFSheet sheet = workbook.getSheetAt(0);
		     HSSFPatriarch patr = sheet.getDrawingPatriarch();
		     
		     int x1 = patr.getX1();
		     int y1 = patr.getY1();
		     int x2 = patr.getX2();
		     int y2 = patr.getY2();
		     
		     System.out.println("main: " + x1 + "," + y1 + " " + x2 + "," + y2);
		     
		     HSSFShape s1 = patr.getChildren().get(0);
		     HSSFPicture pic = (HSSFPicture) s1;
		     HSSFClientAnchor anchor = (HSSFClientAnchor)s1.getAnchor();
		     
		     int dx1 = anchor.getDx1();
		     int dy1 = anchor.getDy1();
		     int dx2 = anchor.getDx2();
		     int dy2 = anchor.getDy2();
		     System.out.println("image: " + dx1 + "," + dy1 + " " + dx2 + "," + dy2);
		     
		     List<HSSFPictureData> lspic = workbook.getAllPictures();
		     HSSFPictureData picdata = lspic.get(0);
		     
		     byte[] images = lspic.get(0).getData();
		     
		     addImage.addImageToSheet(7, 7, sheet, images, w, h,
		    		 ReportImageUtil.OVERLAY_ROW_AND_COLUMN);

		     FileOutputStream fos = new FileOutputStream("d:/ee1.xls");
		     workbook.write(fos);
		     fis.close();
		     fos.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}*/

	/**
	 * 添加一张图片到xls文件中，保持原来的尺寸。
	 */
	public static void addImageToXls() {
		try {
		     File file = new File("d:/grid.xls");
		     FileInputStream fis = new FileInputStream(file);
		     HSSFWorkbook workbook = new HSSFWorkbook(fis);
		     HSSFSheet sheet = workbook.getSheetAt(0);
		     sheet.getRow(3).getCell(3).setCellValue("测试数据");
		     
		     ReportXlsUtil.addImageToSheet(sheet.getRow(2).getCell(3), FileUtil.fileToBytes("d:/top.gif"));
		     
		     FileOutputStream fos = new FileOutputStream("d:/ee.xls");
		     workbook.write(fos);
		     fis.close();
		     fos.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}

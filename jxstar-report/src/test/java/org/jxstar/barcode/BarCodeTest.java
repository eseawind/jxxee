/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.barcode;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

import javax.imageio.ImageIO;

import org.krysalis.barcode4j.HumanReadablePlacement;
import org.krysalis.barcode4j.impl.codabar.CodabarBean;
import org.krysalis.barcode4j.impl.code128.Code128Bean;
import org.krysalis.barcode4j.impl.code39.Code39Bean;
import org.krysalis.barcode4j.output.bitmap.BitmapCanvasProvider;

/**
 * 条码打印测试。
 *
 * @author TonyTan
 * @version 1.0, 2012-11-8
 */
public class BarCodeTest {
	
	public static void generateCodabar(File file, String code) {   
		CodabarBean bean = new CodabarBean();
	    final int dpi = 800;   
	       
	    //barcode
		bean.setBarHeight(10);//单位为mm
		bean.setModuleWidth(0.21);//指每个元素的宽度，用mm为单位
		bean.setWideFactor(3);//2|3
		bean.doQuietZone(false);
		bean.setFontSize(2);
	       
	    OutputStream out = null;   
	  
	    try {   
	        out = new FileOutputStream(file);   
	  
	        BitmapCanvasProvider canvas = new BitmapCanvasProvider(out,   
	                "image/jpeg", dpi, BufferedImage.TYPE_BYTE_BINARY, true, 0);   
	        bean.generateBarcode(canvas, code);   
	        canvas.finish();   
	    } catch (Exception e) {   
	        e.printStackTrace();   
	    } finally {   
	        try {   
	            if (out != null)   
	                out.close();   
	        } catch (IOException e) {   
	            e.printStackTrace();   
	        }   
	    }   
	  
	}  

	public static void generateCode128Barcode(File file, String code) {   
	    Code128Bean bean = new Code128Bean();   
	    final int dpi = 800;   
	       
	    //barcode   
	    bean.setModuleWidth(0.16);   
	    bean.setBarHeight(3);   
	    bean.doQuietZone(false);
	    //human-readable   
	    bean.setFontName("Helvetica");   
	    bean.setFontSize(1);   
	    bean.setMsgPosition(HumanReadablePlacement.HRP_BOTTOM);
	       
	    OutputStream out = null;   
	  
	    try {   
	        out = new FileOutputStream(file);   
	  
	        BitmapCanvasProvider canvas = new BitmapCanvasProvider(out,   
	                "image/jpeg", dpi, BufferedImage.TYPE_BYTE_BINARY, true, 0);   
	        bean.generateBarcode(canvas, code);   
	        canvas.finish();   
	    } catch (Exception e) {   
	        e.printStackTrace();   
	    } finally {   
	        try {   
	            if (out != null)   
	                out.close();   
	        } catch (IOException e) {   
	            e.printStackTrace();   
	        }   
	    }   
	  
	}   
	  
	public static void generateCode39Barcode(int mode, File file, String code) {   
	    Code39Bean bean = new Code39Bean();   
	    // Dot Per Inch每英寸所打印的点数或线数，用来表示打印机打印分辨率。   
	    final int dpi = 800;
	    bean.setModuleWidth(0.2);   
	    bean.setHeight(10);   
	  
	    bean.setWideFactor(3);   
	    bean.doQuietZone(false);   
	    bean.setFontSize(2);
	    OutputStream out = null;   
	  
	    try {   
	        out = new FileOutputStream(file);   
	  
	        if (mode == 0) {   
	            BitmapCanvasProvider canvas = new BitmapCanvasProvider(out,   
	                    "image/jpeg", dpi, BufferedImage.TYPE_BYTE_GRAY, false,   
	                    0);   
	  
	            bean.generateBarcode(canvas, code);   
	  
	            canvas.finish();   
	  
	        } else {   
	            BitmapCanvasProvider canvas = new BitmapCanvasProvider(dpi,   
	                    BufferedImage.TYPE_BYTE_GRAY, true, 0);   
	            bean.generateBarcode(canvas, code);   
	            canvas.finish();   
	            BufferedImage barcodeImage = canvas.getBufferedImage();   
	  
	            ImageIO.write(barcodeImage, "jpg", out);   
	        }   
	    } catch (Exception e) {   
	        e.printStackTrace();   
	    } finally {   
	        try {   
	            if (out != null)   
	                out.close();   
	        } catch (IOException e) {   
	            e.printStackTrace();   
	        }   
	    }   
	}

	public static void main(String[] args) {
		File f1 = new File("d://1.jpg");
		File f2 = new File("d://2.jpg");
		File f3 = new File("d://3.jpg");
		File f4 = new File("d://4.jpg");
		
		generateCode128Barcode(f1, "2012110162");
		generateCode39Barcode(0, f2, "2012110162");
		generateCode39Barcode(1, f3, "2012110162");
		generateCodabar(f4, "2012110162");
	}

}

/*
 * Copyright(c) 2012 Donghong Inc.
 */
package org.jxstar.service.imp;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

import org.apache.commons.fileupload.FileItem;
import org.jxstar.control.action.RequestContext;
import org.jxstar.dao.DaoParam;
import org.jxstar.service.BusinessObject;
import org.jxstar.service.imp.parse.DataParser;
import org.jxstar.service.imp.parse.TxtDataParser;
import org.jxstar.service.imp.parse.XlsDataParser;
import org.jxstar.util.MapUtil;
import org.jxstar.util.factory.FactoryUtil;

/**
 * 公共数据导入处理类。
 *
 * @author TonyTan
 * @version 1.0, 2012-6-11
 */
public class DataImpBO extends BusinessObject {
	private static final long serialVersionUID = 1L;

	/**
	 * 根据功能ID找到数据导入定义信息：构建表头数据定义对象、表格数据定义对象、关联关系定义对象、新增数据SQL对象；
	 * 读取请求对象的中xls文件；
	 * 解析xls文件中的数据；
	 * 如果有表头字段：获取模板表头数据集；
	 * 如果有表格字段：获取一行表格数据集；
	 * 如果有关系字段：根据上面两个数据集中的值作为参数，解析关系SQL，获取关联数据集；
	 * 判断必填，如果没有则不导入；
	 * 调用新增SQL，新增一条记录；
	 * 循环所有表格数据新增。
	 * @param request
	 * @return
	 */
	public String onDataImp(RequestContext request) {
		//当前功能ID
		String funId = request.getFunID();
		//上传的导入数据文件
		FileItem impFile = (FileItem) request.getRequestObject("import_file");
		if (impFile == null) {
			setMessage("没有找到上传的数据文件！");
			return _returnFaild;
		}
		InputStream ins;
		try {
			ins = impFile.getInputStream();
		} catch (IOException e) {
			_log.showError(e);
			setMessage("解析上传的数据文件出错：" + e.getMessage());
			return _returnFaild;
		}
		
		//取外键值
		String fkValue = request.getRequestValue("fkValue");
		//当前用户信息
		Map<String,String> userInfo = request.getUserInfo();
		
		//解析数据，执行导入
		return dataImp(ins, funId, fkValue, userInfo);
	}
	
	/**
	 * 执行数据导入，方便测试。
	 * @param ins
	 * @param funId
	 * @param fkValue
	 * @param userInfo
	 * @return
	 */
	public String dataImp(InputStream ins, String funId, String fkValue, Map<String,String> userInfo) {
		Map<String,String> mpImp = queryImp(funId);
		if (mpImp.isEmpty()) {
			setMessage("没有找到【{0}】功能的数据导入定义！", funId);
			return _returnFaild;
		}
		//模板文件类型：xls, csv
		String tplType = mpImp.get("tpl_type");
		//定义ID
		String impId = mpImp.get("imp_id");
		//第一行数据的位置
		int firstRow = ImpUtil.getFirstRow(impId); 
		if (firstRow < 0) {
			setMessage("第一行数据位置为【{0}】，不正确！", firstRow);
			return _returnFaild;
		}
		
		//解析上传的文件
		DataParser parser = null;
		if (tplType.equals("xls")) {
			parser = new XlsDataParser();
		} else if (tplType.equals("txt") || tplType.equals("csv")) {
			parser = new TxtDataParser();
		} else {
			setMessage("没有找到解析上传文件的对象！");
			return _returnFaild;
		}
		parser.init(ins, firstRow);
		
		//新增SQL对象
		String insertSql = mpImp.get("insert_sql");
		
		//解析数据，执行导入
		boolean bret = importData(parser, impId, insertSql, funId, fkValue, userInfo);
		if (!bret) {
			setMessage("执行数据导入操作失败！");
			return _returnFaild;
		}
		
		return _returnSuccess;
	}
	
	/**
	 * 解析数据，根据定义，执行导入
	 * @return
	 */
	private boolean importData(DataParser parser, String impId, String baseSql,
			String funId, String fkValue, Map<String,String> userInfo) {
		//表头定义
		List<Map<String,String>> formField = queryDataField(impId, "2");
		//解析表头中的数据
		Map<String,String> formData = parseForm(parser, formField);
		
		//表格定义
		List<Map<String,String>> lsGfield = queryDataField(impId, "1");
		//解析表格中的数据
		List<Map<String,String>> gridData = parseGrid(parser, lsGfield);
		
		//关系SQL定义
		List<Map<String,String>> lsRelatSql = queryRelatSql(impId);
		//是否有关系数据字段
		boolean hasRelat = hasRelatField(impId);
		
		//新增SQL的参数
		List<Map<String,String>> lsField = queryField(impId);
		
		//开始导入数据
		for (Map<String,String> mpData : gridData) {
			_log.showDebug("--------------------- start import new data ---------------------");
			Map<String,String> relatData = null;
			if (hasRelat) {//取得相关关系数据集
				relatData = ImpUtil.queryRelat(lsRelatSql, formData, mpData);
			}
			
			//解析SQL中的主键、编码、常量
			String sql = ImpUtil.parseInsertSQL(funId, fkValue, baseSql, userInfo);
			_log.showDebug(".........insert sql:" + sql);
			DaoParam param = _dao.createParam(sql);
			param.setUseParse(true);
			
			//取新增SQL的参数：如果是表头数据则从formData取值；如果是表格数据则从gridData取值；如果是关系数据则从relat取值
			for (Map<String,String> mpField : lsField) {
				String value = "";
				String srcType = mpField.get("data_src");
				String field_name = mpField.get("field_name");
				String data_type = mpField.get("data_type");
				String is_must = mpField.get("is_must");
				
				if (srcType.equals("1")) {
					value = MapUtil.getValue(mpData, field_name);
				} else if (srcType.equals("2")) {
					value = MapUtil.getValue(formData, field_name);
				} else if (srcType.equals("3")) {
					if (relatData != null && !relatData.isEmpty()) {
						value = MapUtil.getValue(relatData, field_name);
					}
				}
				_log.showDebug("..........field_name={0}, data_type={1}, data_src={2}, value={3}", field_name, data_type, srcType, value);
				if (is_must.equals("1") && value.length() == 0) {
					_log.showDebug("..........field_name:{0} value is empty!!!", field_name);
					return true;
				}
				
				param.addValue(value);
				param.addType(data_type);
			}
			
			//执行新增操作
			boolean bret = _dao.update(param);
			if (!bret) return false;
		}
		
		return true;
	}
	
	/**
	 * 解析表格中的数据
	 * @param parser
	 * @param lsGfield
	 * @return
	 */
	private List<Map<String,String>> parseGrid(DataParser parser, List<Map<String,String>> lsGfield) {
		List<Map<String,String>> lsData = FactoryUtil.newList();
		
		int rowsNum = parser.getRowsNum();
		int colsNum = parser.getColsNum();
		_log.showDebug("..........rows num: {0}, cols num: {1}", rowsNum, colsNum);
		if (rowsNum < 0 || colsNum < 0) {
			_log.showWarn("parse grid data rowsnum is -1 or colsnum is -1!!");
			return lsData;
		}
		
		for (int i = 0; i < rowsNum; i++) {
			_log.showDebug("..........parse row:" + i);
			
			Map<String,String> mpData = FactoryUtil.newMap();
			//是否有效数据，如果有必填字段没有填写，则不添加
			boolean isValid = true;
			for (Map<String,String> mpField : lsGfield) {
				String fieldPos = mpField.get("field_pos");
				String fieldName = mpField.get("field_name");
				String is_must = mpField.get("is_must");
				
				int[] pos = ImpUtil.getPosition(fieldPos);
				if (pos.length != 2) {
					_log.showWarn("import data position [{0}] is error!!", fieldPos);
					continue;
				}
				
				String value = parser.getData(pos[0]+i, pos[1]);
				if (is_must.equals("1") && value.length() == 0) {
					_log.showDebug("..........parse row fieldname:[{0}] data is empty!!", fieldName);
					isValid = false;
					break;
				}
				
				mpData.put(fieldName, value);
			}
			
			if (isValid) {
				_log.showDebug("..........parse row data:" + mpData);
				lsData.add(mpData);
			} else {
				_log.showDebug("..........parse row data has not valid!!");
			}
		}
		
		return lsData;
	}
	
	/**
	 * 解析表头中的数据
	 * @param parser
	 * @param formField
	 * @return
	 */
	private Map<String,String> parseForm(DataParser parser, List<Map<String,String>> formField) {
		Map<String,String> mpData = FactoryUtil.newMap();
		
		for (Map<String,String> mpField : formField) {
			String fieldPos = mpField.get("field_pos");
			String fieldName = mpField.get("field_name");
			
			int[] pos = ImpUtil.getPosition(fieldPos);
			if (pos.length != 2) {
				_log.showWarn("import data position [{0}] is error!!", fieldPos);
				continue;
			}
			
			String value = parser.getData(pos[0], pos[1]);
			mpData.put(fieldName, value);
		}
		_log.showDebug("..........parse form data:" + mpData);
		
		return mpData;
	}
	
	//取数据导入的SQL
	private Map<String,String> queryImp(String funId) {
		String sql = "select tpl_type, insert_sql, imp_id from imp_list where fun_id = ?";
		
		DaoParam param = _dao.createParam(sql);
		param.addStringValue(funId);
		
		return _dao.queryMap(param);
	}
	
	//取表头字段定义，数据来源类型：1表格、2表头、3关系数据
	private List<Map<String,String>> queryDataField(String impId, String srcType) {
		String sql = "select field_name, field_pos, is_must from imp_field where data_src = ? and imp_id = ?";
		
		DaoParam param = _dao.createParam(sql);
		param.addStringValue(srcType);
		param.addStringValue(impId);
		
		return _dao.query(param);
	}
	
	//是否关系数据字段
	private boolean hasRelatField(String impId) {
		String sql = "select count(*) as cnt from imp_field where data_src = '3' and imp_id = ?";
		
		DaoParam param = _dao.createParam(sql);
		param.addStringValue(impId);
		
		Map<String,String> mpData = _dao.queryMap(param);
		return MapUtil.hasRecord(mpData);
	}
	
	//取关联关系SQL定义
	private List<Map<String,String>> queryRelatSql(String impId) {
		String sql = "select relat_sql from imp_relat where imp_id = ?";
		
		DaoParam param = _dao.createParam(sql);
		param.addStringValue(impId);
		
		return _dao.query(param);
	}
	
	//取新增SQL的参数列表
	private List<Map<String,String>> queryField(String impId) {
		String sql = "select field_name, data_type, data_src, is_must from imp_field where imp_id = ? order by field_no";
		
		DaoParam param = _dao.createParam(sql);
		param.addStringValue(impId);
		
		return _dao.query(param);
	}
}

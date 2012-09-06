package org.jxstar.report.util;

import java.util.Map;

import org.jxstar.dao.BaseDao;
import org.jxstar.dao.DaoParam;
import org.jxstar.util.FileUtil;
import org.jxstar.util.config.SystemVar;

/**
 * 处理个人签名与部门印制的工具类。
 *
 * @author TonyTan
 * @version 1.0, 2011-11-28
 */
public class SignPicUtil {
	private static BaseDao _dao = BaseDao.getInstance();
	
    /**
     * 取当前用户的个人签名的html
     * @param userId -- 输出用户ID
     * @param curUserId -- 当前用户ID
     * @return
     */
	public static String getUserSign(String userId, String curUserId) {
		if (existsAttach(userId, "sys_user")) {
			String url = signURL(userId, "sys_user", "sys_user", curUserId);
			return "<img src='"+ url +"' width='150' />";
		}
		
		return "";
	}
	
    /**
     * 取当前用户所在部门的印章的html
     * @param userId -- 输出用户ID
     * @param curUserId -- 当前用户ID
     * @return
     */
	public static String getDeptSign(String userId, String curUserId) {
    	String deptId = ReportDao.getDeptId(userId);
    	if (existsAttach(deptId, "sys_dept")) {
			String url = signURL(deptId, "sys_dept", "sys_dept", curUserId);
			return "<img src='"+ url +"' />";
		}
    	
    	return "";
	}
	
	//取图片附件的URL
	private static String signURL(String dataId, String tableName, String funId, String curUserId) {
		String uploadType = SystemVar.getValue("upload.server.type", "0");
		String uploadUrl = SystemVar.getValue("upload.server.url");
		String path = ".";
		//支持集中管理附件
		if (uploadType.equals("1")) {
			path = uploadUrl;
		}
		
		StringBuilder sburl = new StringBuilder();
		sburl.append(path + "/fileAction.do?funid=sys_attach&pagetype=editgrid&eventcode=fdown&dataType=byte");
		sburl.append("&attach_field=sign_pic&dataid="+ dataId +"&table_name="+ tableName);
		sburl.append("&datafunid="+ funId +"&user_id="+ curUserId);
		
		return sburl.toString();
	}
	
	//检查是否存在印章图片
	private static boolean existsAttach(String dataId, String tableName) {
		String sql = "select attach_path from sys_attach where attach_field = 'sign_pic' " +
				"and table_name = ? and data_id = ?";
		DaoParam param = _dao.createParam(sql);
		param.addStringValue(tableName);
		param.addStringValue(dataId);
		
		Map<String,String> mpAttach = _dao.queryMap(param);
		if (mpAttach.isEmpty()) return false;
		
		String attachPath = mpAttach.get("attach_path");
		if (attachPath.length() == 0) return false;
		
		//可能附件保存路径改变了，所以要重新构建路径
		String systemPath = SystemVar.getValue("upload.file.path", "D:/ATTACHDOC");
		String fileName = FileUtil.getFileName(attachPath);
		attachPath = systemPath + "/" + tableName + "/" + fileName;
		
		return FileUtil.exists(attachPath);
	}
    /*private static String getUserSign(String userId) {
    	String fileName = SystemVar.REALPATH + "/report/sign/user/" + userId + ".gif";
    	if (FileUtil.exists(fileName)) {
    		String img = "../../sign/user/" + userId + ".gif";
    		return "<img src='"+ img +"' width='150' />";
    	}
    	
    	return "";
    }*/
}

﻿
NodeDefine = {
'sys_dept':{nodeid:'sys_dept', nodetitle:'组织机构', layout:'/public/layout/layout_tree.js', gridpage:'/jxstar/system/grid_sys_dept.js', formpage:'', tablename:'sys_dept', pkcol:'sys_dept__dept_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'sys_dept__dept_name', isarch:'0'},
'sys_dept1':{nodeid:'sys_dept1', nodetitle:'选择部门', layout:'', gridpage:'/jxstar/system/grid_sys_dept1.js', formpage:'', tablename:'sys_dept', pkcol:'sys_dept__dept_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'sys_dept__dept_name', isarch:'0'},
'sys_role':{nodeid:'sys_role', nodetitle:'角色注册', layout:'/public/layout/layout_main_ext.js', gridpage:'/jxstar/system/grid_sys_role.js', formpage:'', tablename:'sys_role', pkcol:'sys_role__role_id', fkcol:'', auditcol:'', subfunid:'sys_role_fun,sys_role_user', showform:'', first:'', isarch:'0'},
'sys_user':{nodeid:'sys_user', nodetitle:'用户注册', layout:'/public/layout/layout_tree.js', gridpage:'/jxstar/system/grid_sys_user.js', formpage:'', tablename:'sys_user', pkcol:'sys_user__user_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'wf_user_def':{nodeid:'wf_user_def', nodetitle:'审批人员配置', layout:'/public/layout/layout_grid_det.js', gridpage:'/jxstar/studio/grid_wfuser_def.js', formpage:'', tablename:'wf_nodeattr', pkcol:'wf_nodeattr__nodeattr_id', fkcol:'', auditcol:'', subfunid:'wf_user', showform:'', first:'wf_process__process_name', isarch:'0'},
'sys_datatype':{nodeid:'sys_datatype', nodetitle:'数据权限类型', layout:'', gridpage:'/jxstar/system/grid_sys_datatype.js', formpage:'', tablename:'sys_datatype', pkcol:'sys_datatype__dtype_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'sys_role_fun':{nodeid:'sys_role_fun', nodetitle:'功能权限', layout:'/public/layout/layout_tree.js', gridpage:'/jxstar/system/grid_sys_role_fun.js', formpage:'', tablename:'sys_role_fun', pkcol:'sys_role_fun__role_fun_id', fkcol:'sys_role_fun__role_id', auditcol:'', subfunid:'sys_role_data', showform:'', first:'', isarch:'0'},
'sys_role_user':{nodeid:'sys_role_user', nodetitle:'授权用户', layout:'', gridpage:'/jxstar/system/grid_sys_role_user.js', formpage:'', tablename:'sys_user_role', pkcol:'sys_user_role__user_role_id', fkcol:'sys_user_role__role_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'sys_role_data':{nodeid:'sys_role_data', nodetitle:'角色数据权限', layout:'', gridpage:'/jxstar/system/grid_sys_role_data.js', formpage:'', tablename:'sys_role_data', pkcol:'sys_role_data__role_data_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'sys_role_event':{nodeid:'sys_role_event', nodetitle:'其它操作权限', layout:'', gridpage:'/jxstar/system/grid_sys_role_event.js', formpage:'', tablename:'sys_role_event', pkcol:'sys_role_event__role_event_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'sys_user_role':{nodeid:'sys_user_role', nodetitle:'所属角色', layout:'', gridpage:'/jxstar/system/grid_sys_user_role.js', formpage:'', tablename:'sys_user_role', pkcol:'sys_user_role__user_role_id', fkcol:'sys_user_role__user_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'sys_user_data':{nodeid:'sys_user_data', nodetitle:'用户数据权限', layout:'', gridpage:'/jxstar/system/grid_sys_user_data.js', formpage:'', tablename:'sys_user_data', pkcol:'sys_user_data__user_data_id', fkcol:'sys_user_data__user_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'sys_user_funx':{nodeid:'sys_user_funx', nodetitle:'指定功能权限', layout:'/public/layout/layout_tree.js', gridpage:'/jxstar/system/grid_sys_user_funx.js', formpage:'/jxstar/system/form_sys_user_funx.js', tablename:'sys_user_funx', pkcol:'sys_user_funx__user_funx_id', fkcol:'sys_user_funx__user_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'sys_udata_del':{nodeid:'sys_udata_del', nodetitle:'批量删除数据权限', layout:'', gridpage:'/jxstar/system/grid_sys_udata_del.js', formpage:'', tablename:'sys_user_data', pkcol:'sys_user_data__user_data_id', fkcol:'sys_user_data__user_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'plet_type':{nodeid:'plet_type', nodetitle:'PORTAL栏目', layout:'', gridpage:'/jxstar/system/grid_plet_type.js', formpage:'', tablename:'plet_type', pkcol:'plet_type__type_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'plet_templet':{nodeid:'plet_templet', nodetitle:'PORTAL模板', layout:'/public/layout/layout_main.js', gridpage:'/jxstar/system/grid_plet_templet.js', formpage:'', tablename:'plet_templet', pkcol:'plet_templet__templet_id', fkcol:'', auditcol:'', subfunid:'plet_portlet', showform:'', first:'', isarch:'0'},
'plet_chart':{nodeid:'plet_chart', nodetitle:'结果集图形定义', layout:'/public/layout/layout_main.js', gridpage:'/jxstar/system/grid_plet_chart.js', formpage:'/jxstar/system/form_plet_chart.js', tablename:'plet_chart', pkcol:'plet_chart__chart_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'plet_kpi':{nodeid:'plet_kpi', nodetitle:'KPI图形定义', layout:'/public/layout/layout_main.js', gridpage:'/jxstar/system/grid_plet_kpi.js', formpage:'/jxstar/system/form_plet_kpi.js', tablename:'plet_kpi', pkcol:'plet_kpi__kpi_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'send_board':{nodeid:'send_board', nodetitle:'公告栏管理', layout:'/public/layout/layout_main.js', gridpage:'/jxstar/system/grid_send_board.js', formpage:'/jxstar/system/form_send_board.js', tablename:'plet_msg', pkcol:'plet_msg__msg_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'sys_doc':{nodeid:'sys_doc', nodetitle:'公共资料文件', layout:'', gridpage:'/jxstar/system/grid_sys_doc.js', formpage:'', tablename:'sys_doc', pkcol:'sys_doc__doc_id', fkcol:'', auditcol:'', subfunid:'', showform:'form', first:'', attachDeled:true, isarch:'0'},
'sys_attach':{nodeid:'sys_attach', nodetitle:'图文附件', layout:'', gridpage:'/jxstar/system/grid_sys_attach.js', formpage:'', tablename:'sys_attach', pkcol:'sys_attach__attach_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'plet_portlet':{nodeid:'plet_portlet', nodetitle:'PORTAL内容', layout:'', gridpage:'/jxstar/system/grid_plet_portlet.js', formpage:'', tablename:'plet_portlet', pkcol:'plet_portlet__portlet_id', fkcol:'plet_portlet__templet_id', auditcol:'', subfunid:'plet_fun', showform:'', first:'', isarch:'0'},
'sel_plettype':{nodeid:'sel_plettype', nodetitle:'选择PORTAL栏目', layout:'', gridpage:'/jxstar/system/grid_sel_plettype.js', formpage:'', tablename:'v_plet_type', pkcol:'v_plet_type__type_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'plet_fun':{nodeid:'plet_fun', nodetitle:'常用功能设置', layout:'', gridpage:'/jxstar/system/grid_plet_fun.js', formpage:'', tablename:'plet_fun', pkcol:'plet_fun__det_id', fkcol:'plet_fun__portlet_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'send_msg':{nodeid:'send_msg', nodetitle:'发件箱', layout:'/public/layout/layout_main.js', gridpage:'/jxstar/system/grid_send_msg.js', formpage:'/jxstar/system/form_send_msg.js', tablename:'plet_msg', pkcol:'plet_msg__msg_id', fkcol:'', auditcol:'plet_msg__msg_state', subfunid:'send_user', showform:'', first:'', showFormSub:true, isarch:'0'},
'get_msg':{nodeid:'get_msg', nodetitle:'收件箱', layout:'/public/layout/layout_main.js', gridpage:'/jxstar/system/grid_get_msg.js', formpage:'/jxstar/system/form_get_msg.js', tablename:'plet_msg', pkcol:'plet_msg__msg_id', fkcol:'', auditcol:'plet_msg__msg_state', subfunid:'', showform:'', first:'', isarch:'0'},
'get_board':{nodeid:'get_board', nodetitle:'已阅公告', layout:'/public/layout/layout_main.js', gridpage:'/jxstar/system/grid_get_board.js', formpage:'/jxstar/system/form_get_board.js', tablename:'plet_msg', pkcol:'plet_msg__msg_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'send_user':{nodeid:'send_user', nodetitle:'消息接收人', layout:'', gridpage:'/jxstar/system/grid_send_user.js', formpage:'', tablename:'plet_msg_user', pkcol:'plet_msg_user__key_id', fkcol:'plet_msg_user__msg_id', auditcol:'', subfunid:'', showform:'form', first:'', isarch:'0'},
'sys_docqry':{nodeid:'sys_docqry', nodetitle:'公共资料及工具', layout:'', gridpage:'/jxstar/system/grid_sys_docqry.js', formpage:'', tablename:'sys_attach', pkcol:'sys_attach__attach_id', fkcol:'', auditcol:'', subfunid:'', showform:'form', first:'', isarch:'0'},
'sys_task':{nodeid:'sys_task', nodetitle:'定时任务', layout:'/public/layout/layout_main.js', gridpage:'/jxstar/system/grid_sys_task.js', formpage:'/jxstar/system/form_sys_task.js', tablename:'task_base', pkcol:'task_base__task_id', fkcol:'', auditcol:'', subfunid:'sys_taskparam,sys_tasklog', showform:'', first:'', isarch:'0'},
'sys_warn':{nodeid:'sys_warn', nodetitle:'上报任务', layout:'/public/layout/layout_main.js', gridpage:'/jxstar/system/grid_sys_warn.js', formpage:'/jxstar/system/form_sys_warn.js', tablename:'warn_base', pkcol:'warn_base__warn_id', fkcol:'', auditcol:'', subfunid:'sys_warnuser,sys_warnlog', showform:'', first:'', isarch:'0'},
'sys_var':{nodeid:'sys_var', nodetitle:'系统变量', layout:'', gridpage:'/jxstar/system/grid_sys_var.js', formpage:'', tablename:'sys_var', pkcol:'sys_var__var_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'sys_proxy':{nodeid:'sys_proxy', nodetitle:'工作代理设置', layout:'/public/layout/layout_main.js', gridpage:'/jxstar/system/grid_sys_proxy.js', formpage:'/jxstar/system/form_sys_proxy.js', tablename:'sys_proxy', pkcol:'sys_proxy__proxy_id', fkcol:'', auditcol:'sys_proxy__auditing', subfunid:'', showform:'form', first:'', isarch:'0'},
'sys_taskparam':{nodeid:'sys_taskparam', nodetitle:'任务参数', layout:'', gridpage:'/jxstar/system/grid_task_param.js', formpage:'', tablename:'task_param', pkcol:'task_param__param_id', fkcol:'task_param__task_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'sys_tasklog':{nodeid:'sys_tasklog', nodetitle:'任务日志', layout:'', gridpage:'/jxstar/system/grid_task_log.js', formpage:'', tablename:'task_log', pkcol:'task_log__log_id', fkcol:'task_log__task_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'sys_warnlog':{nodeid:'sys_warnlog', nodetitle:'上报日志', layout:'', gridpage:'/jxstar/system/grid_warn_log.js', formpage:'', tablename:'warn_log', pkcol:'warn_log__log_id', fkcol:'warn_log__warn_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'sys_warnuser':{nodeid:'sys_warnuser', nodetitle:'通知用户', layout:'', gridpage:'/jxstar/system/grid_warn_user.js', formpage:'', tablename:'warn_user', pkcol:'warn_user__user_detid', fkcol:'warn_user__warn_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'sys_proxy_sel':{nodeid:'sys_proxy_sel', nodetitle:'工作代理选择', layout:'', gridpage:'/jxstar/system/grid_sys_proxy_sel.js', formpage:'', tablename:'sys_proxy', pkcol:'sys_proxy__proxy_id', fkcol:'', auditcol:'sys_proxy__auditing', subfunid:'', showform:'form', first:'', isarch:'0'},
'sys_user_login':{nodeid:'sys_user_login', nodetitle:'在线用户', layout:'', gridpage:'/jxstar/system/grid_user_login.js', formpage:'', tablename:'sys_user_login', pkcol:'sys_user_login__login_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'sys_query':{nodeid:'sys_query', nodetitle:'查询方案', layout:'', gridpage:'/jxstar/system/grid_sys_query.js', formpage:'', tablename:'sys_query', pkcol:'sys_query__query_id', fkcol:'', auditcol:'', subfunid:'sys_qrydet', showform:'', first:'', isarch:'0'},
'sys_qrydet':{nodeid:'sys_qrydet', nodetitle:'查询条件', layout:'', gridpage:'/jxstar/system/grid_sys_qrydet.js', formpage:'', tablename:'sys_query_det', pkcol:'sys_query_det__query_detid', fkcol:'sys_query_det__query_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'sel_fun_col':{nodeid:'sel_fun_col', nodetitle:'选择字段', layout:'', gridpage:'/jxstar/system/grid_sel_funcol.js', formpage:'', tablename:'fun_col', pkcol:'fun_col__col_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'sys_stat':{nodeid:'sys_stat', nodetitle:'统计方案', layout:'', gridpage:'/jxstar/system/grid_sys_stat.js', formpage:'', tablename:'sys_stat', pkcol:'sys_stat__stat_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'que_report':{nodeid:'que_report', nodetitle:'系统问题报告', layout:'/public/layout/layout_main.js', gridpage:'/jxstar/system/grid_que_report.js', formpage:'/jxstar/system/form_que_report.js', tablename:'sys_question', pkcol:'sys_question__que_id', fkcol:'', auditcol:'sys_question__que_status', subfunid:'', showform:'', first:'', isarch:'0'},
'que_done':{nodeid:'que_done', nodetitle:'系统问题处理', layout:'/public/layout/layout_main.js', gridpage:'/jxstar/system/grid_que_done.js', formpage:'/jxstar/system/form_que_done.js', tablename:'sys_question', pkcol:'sys_question__que_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'sys_note':{nodeid:'sys_note', nodetitle:'短信查询', layout:'/public/layout/layout_main.js', gridpage:'/jxstar/system/grid_sys_note.js', formpage:'/jxstar/system/form_sys_note.js', tablename:'sys_note', pkcol:'sys_note__note_id', fkcol:'', auditcol:'sys_note__send_status', subfunid:'', showform:'', first:'sys_note__mob_code', isarch:'0'},
'sys_doing':{nodeid:'sys_doing', nodetitle:'正在操作', layout:'', gridpage:'/jxstar/system/grid_sys_doing.js', formpage:'', tablename:'sys_doing', pkcol:'sys_doing__key_id', fkcol:'', auditcol:'', subfunid:'', showform:'form', first:'', isarch:'0'},
'sys_log':{nodeid:'sys_log', nodetitle:'操作日志', layout:'', gridpage:'/jxstar/system/grid_sys_log.js', formpage:'', tablename:'sys_log', pkcol:'sys_log__log_id', fkcol:'', auditcol:'', subfunid:'', showform:'form', first:'', isarch:'0'},
'sys_log_edit':{nodeid:'sys_log_edit', nodetitle:'数据修改日志', layout:'', gridpage:'/jxstar/system/grid_sys_log_edit.js', formpage:'/jxstar/system/form_sys_log_edit.js', tablename:'sys_log_edit', pkcol:'sys_log_edit__edit_id', fkcol:'', auditcol:'', subfunid:'', showform:'form', first:'', isarch:'0'},
'sys_proxy_log':{nodeid:'sys_proxy_log', nodetitle:'代理操作日志', layout:'', gridpage:'/jxstar/system/grid_sys_proxy_log.js', formpage:'', tablename:'sys_proxy_log', pkcol:'sys_proxy_log__log_id', fkcol:'', auditcol:'', subfunid:'', showform:'form', first:'', isarch:'0'},
'dm_tablecfg':{nodeid:'dm_tablecfg', nodetitle:'数据表设计器', layout:'/public/layout/layout_main.js', gridpage:'/jxstar/studio/grid_tablecfg.js', formpage:'', tablename:'dm_tablecfg', pkcol:'dm_tablecfg__table_id', fkcol:'', auditcol:'', subfunid:'dm_fieldcfg,dm_indexcfg', showform:'', first:'dm_tablecfg__table_name', isarch:'0'},
'dm_tablecfg_rep':{nodeid:'dm_tablecfg_rep', nodetitle:'数据表维护', layout:'/public/layout/layout_main.js', gridpage:'/jxstar/studio/grid_tablecfg_rep.js', formpage:'', tablename:'dm_tablecfg', pkcol:'dm_tablecfg__table_id', fkcol:'', auditcol:'', subfunid:'dm_fieldcfg_rep,dm_indexcfg_rep', showform:'', first:'dm_tablecfg__table_name', isarch:'0'},
'dm_viewcfg':{nodeid:'dm_viewcfg', nodetitle:'视图配置', layout:'/public/layout/layout_main.js', gridpage:'/jxstar/studio/grid_viewcfg.js', formpage:'/jxstar/studio/form_viewcfg.js', tablename:'dm_viewcfg', pkcol:'dm_viewcfg__view_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'dm_fieldcfg_rep':{nodeid:'dm_fieldcfg_rep', nodetitle:'字段配置维护', layout:'', gridpage:'/jxstar/studio/grid_fieldcfg_rep.js', formpage:'/jxstar/studio/form_fieldcfg_rep.js', tablename:'dm_fieldcfg', pkcol:'dm_fieldcfg__field_id', fkcol:'dm_fieldcfg__table_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'dm_fieldcfg':{nodeid:'dm_fieldcfg', nodetitle:'字段配置', layout:'', gridpage:'/jxstar/studio/grid_fieldcfg.js', formpage:'/jxstar/studio/form_fieldcfg.js', tablename:'dm_fieldcfg', pkcol:'dm_fieldcfg__field_id', fkcol:'dm_fieldcfg__table_id', auditcol:'', subfunid:'', showform:'', first:'dm_fieldcfg__field_name', isarch:'0'},
'dm_indexcfg_rep':{nodeid:'dm_indexcfg_rep', nodetitle:'索引配置维护', layout:'', gridpage:'/jxstar/studio/grid_indexcfg_rep.js', formpage:'', tablename:'dm_indexcfg', pkcol:'dm_indexcfg__index_id', fkcol:'dm_indexcfg__table_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'dm_indexcfg':{nodeid:'dm_indexcfg', nodetitle:'索引配置', layout:'', gridpage:'/jxstar/studio/grid_indexcfg.js', formpage:'', tablename:'dm_indexcfg', pkcol:'dm_indexcfg__index_id', fkcol:'dm_indexcfg__table_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'dm_reverse':{nodeid:'dm_reverse', nodetitle:'选择反向表', layout:'', gridpage:'/jxstar/studio/grid_reverse.js', formpage:'', tablename:'v_table_info', pkcol:'v_table_info__table_name', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'sel_table':{nodeid:'sel_table', nodetitle:'选择数据表', layout:'', gridpage:'/jxstar/studio/grid_seltable.js', formpage:'', tablename:'dm_table', pkcol:'dm_table__table_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'sel_field':{nodeid:'sel_field', nodetitle:'选择字段名', layout:'', gridpage:'/jxstar/studio/grid_selfield.js', formpage:'', tablename:'v_field_info', pkcol:'v_field_info__col_code', fkcol:'v_field_info__table_name', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'sel_fieldcfg':{nodeid:'sel_fieldcfg', nodetitle:'字段配置', layout:'', gridpage:'/jxstar/studio/grid_sel_fieldcfg.js', formpage:'', tablename:'dm_fieldcfg', pkcol:'dm_fieldcfg__field_id', fkcol:'dm_fieldcfg__table_id', auditcol:'', subfunid:'', showform:'', first:'dm_tablecfg__table_name', isarch:'0'},
'sys_fun_base':{nodeid:'sys_fun_base', nodetitle:'功能设计器', layout:'/jxstar/studio/pub/layout_function.js', gridpage:'/jxstar/studio/grid_function.js', formpage:'/jxstar/studio/form_function.js', tablename:'fun_base', pkcol:'fun_base__fun_id', fkcol:'', auditcol:'', subfunid:'fun_event,sys_fun_col,rule_route,fun_ext,fun_tree,fun_attrdes', showform:'', first:'', isarch:'0'},
'sys_control':{nodeid:'sys_control', nodetitle:'选项控件定义', layout:'', gridpage:'/jxstar/studio/grid_combo.js', formpage:'', tablename:'funall_control', pkcol:'funall_control__control_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'sys_ctlsel':{nodeid:'sys_ctlsel', nodetitle:'选择窗口定义', layout:'', gridpage:'/jxstar/studio/grid_selwin.js', formpage:'', tablename:'funall_control', pkcol:'funall_control__control_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'rule_sqlm':{nodeid:'rule_sqlm', nodetitle:'SQL规则注册', layout:'/public/layout/layout_main.js', gridpage:'/jxstar/studio/grid_rule_sqlm.js', formpage:'/jxstar/studio/form_rule_sqlm.js', tablename:'fun_rule_sql', pkcol:'fun_rule_sql__rule_id', fkcol:'fun_rule_sql__route_id', auditcol:'', subfunid:'rule_param', showform:'', first:'', isarch:'0'},
'sys_event':{nodeid:'sys_event', nodetitle:'系统事件注册', layout:'', gridpage:'/jxstar/studio/grid_sys_event.js', formpage:'', tablename:'fun_event', pkcol:'fun_event__event_id', fkcol:'', auditcol:'', subfunid:'event_invoke', showform:'', first:'', isarch:'0'},
'event_domain':{nodeid:'event_domain', nodetitle:'事件域注册', layout:'/jxstar/studio/pub/layout_domain.js', gridpage:'/jxstar/studio/grid_event_domain.js', formpage:'', tablename:'funall_domain', pkcol:'funall_domain__domain_id', fkcol:'', auditcol:'', subfunid:'event_domain_det', showform:'', first:'', isarch:'0'},
'sys_module':{nodeid:'sys_module', nodetitle:'模块管理', layout:'/public/layout/layout_tree.js', gridpage:'/jxstar/studio/grid_sys_module.js', formpage:'', tablename:'funall_module', pkcol:'funall_module__module_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'sys_default':{nodeid:'sys_default', nodetitle:'缺省值函数', layout:'', gridpage:'/jxstar/studio/grid_sys_default.js', formpage:'', tablename:'funall_default', pkcol:'funall_default__func_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'fun_attr':{nodeid:'fun_attr', nodetitle:'扩展属性模板', layout:'', gridpage:'/jxstar/studio/grid_fun_attr.js', formpage:'', tablename:'fun_attr', pkcol:'fun_attr__attr_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'fun_layout':{nodeid:'fun_layout', nodetitle:'页面布局', layout:'', gridpage:'/jxstar/studio/grid_fun_layout.js', formpage:'', tablename:'funall_layout', pkcol:'funall_layout__layout_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'fun_text':{nodeid:'fun_text', nodetitle:'文字注册', layout:'/public/layout/layout_tree.js', gridpage:'/jxstar/studio/grid_fun_text.js', formpage:'', tablename:'funall_text', pkcol:'funall_text__prop_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'sys_fun_col':{nodeid:'sys_fun_col', nodetitle:'字段定义', layout:'', gridpage:'/jxstar/studio/grid_column.js', formpage:'', tablename:'fun_col', pkcol:'fun_col__col_id', fkcol:'fun_col__fun_id', auditcol:'', subfunid:'fun_colext', showform:'', first:'', isarch:''},
'fun_colext':{nodeid:'fun_colext', nodetitle:'字段扩展定义', layout:'', gridpage:'/jxstar/studio/grid_col_ext.js', formpage:'/jxstar/studio/form_col_ext.js', tablename:'fun_colext', pkcol:'fun_colext__colext_id', fkcol:'col_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'fun_event':{nodeid:'fun_event', nodetitle:'事件注册', layout:'', gridpage:'/jxstar/studio/grid_event.js', formpage:'', tablename:'fun_event', pkcol:'fun_event__event_id', fkcol:'fun_event__fun_id', auditcol:'', subfunid:'event_invoke', showform:'', first:'', isarch:'0'},
'event_invoke':{nodeid:'event_invoke', nodetitle:'事件调用类', layout:'', gridpage:'/jxstar/studio/grid_event_invoke.js', formpage:'', tablename:'fun_event_invoke', pkcol:'fun_event_invoke__invoke_id', fkcol:'fun_event_invoke__event_id', auditcol:'', subfunid:'event_param', showform:'', first:'', isarch:'0'},
'event_param':{nodeid:'event_param', nodetitle:'事件类参数', layout:'', gridpage:'/jxstar/studio/grid_event_param.js', formpage:'', tablename:'fun_event_param', pkcol:'fun_event_param__param_id', fkcol:'fun_event_param__invoke_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'fun_ext':{nodeid:'fun_ext', nodetitle:'功能扩展页面', layout:'', gridpage:'/jxstar/studio/grid_fun_ext.js', formpage:'/jxstar/studio/form_fun_ext.js', tablename:'fun_ext', pkcol:'fun_ext__ext_id', fkcol:'fun_ext__fun_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'fun_attrdes':{nodeid:'fun_attrdes', nodetitle:'扩展属性设置', layout:'', gridpage:'/jxstar/studio/grid_fun_attrdes.js', formpage:'', tablename:'fun_attr', pkcol:'fun_attr__attr_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'fun_status':{nodeid:'fun_status', nodetitle:'业务状态设置', layout:'', gridpage:'', formpage:'/jxstar/studio/form_fun_status.js', tablename:'fun_status', pkcol:'fun_status__status_id', fkcol:'fun_status__fun_id', auditcol:'', subfunid:'', showform:'form', first:'', isarch:'0'},
'event_domain_det':{nodeid:'event_domain_det', nodetitle:'事件域明细', layout:'', gridpage:'/jxstar/studio/grid_domain_det.js', formpage:'', tablename:'funall_domain_event', pkcol:'funall_domain_event__domain_eid', fkcol:'funall_domain_event__domain_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'fun_tree':{nodeid:'fun_tree', nodetitle:'树形定义', layout:'/public/layout/layout_main.js', gridpage:'/jxstar/studio/grid_fun_tree.js', formpage:'/jxstar/studio/form_fun_tree.js', tablename:'fun_tree', pkcol:'fun_tree__tree_id', fkcol:'fun_tree__fun_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'rule_route':{nodeid:'rule_route', nodetitle:'路由条件', layout:'/public/layout/layout_main.js', gridpage:'/jxstar/studio/grid_rule_route.js', formpage:'/jxstar/studio/form_rule_route.js', tablename:'fun_rule_route', pkcol:'fun_rule_route__route_id', fkcol:'fun_rule_route__fun_id', auditcol:'', subfunid:'rule_sqlm', showform:'', first:'', isarch:'0'},
'sys_coderule':{nodeid:'sys_coderule', nodetitle:'编码规则', layout:'/public/layout/layout_main.js', gridpage:'/jxstar/studio/grid_code_rule.js', formpage:'/jxstar/studio/form_code_rule.js', tablename:'sys_coderule', pkcol:'sys_coderule__rule_id', fkcol:'sys_coderule__fun_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'rule_param':{nodeid:'rule_param', nodetitle:'规则参数', layout:'', gridpage:'/jxstar/studio/grid_rule_param.js', formpage:'', tablename:'fun_rule_param', pkcol:'fun_rule_param__param_id', fkcol:'fun_rule_param__rule_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'sel_combo':{nodeid:'sel_combo', nodetitle:'选择控件', layout:'', gridpage:'/jxstar/studio/grid_select_ctl.js', formpage:'', tablename:'v_combo_control', pkcol:'v_combo_control__control_code', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'sel_combo_value':{nodeid:'sel_combo_value', nodetitle:'选择控件值', layout:'', gridpage:'/jxstar/studio/grid_combo_value.js', formpage:'', tablename:'funall_control', pkcol:'', fkcol:'', auditcol:'', subfunid:'', showform:'form', first:'', isarch:'0'},
'sel_fun':{nodeid:'sel_fun', nodetitle:'选择功能', layout:'/public/layout/layout_tree.js', gridpage:'/jxstar/studio/grid_select_fun.js', formpage:'', tablename:'fun_base', pkcol:'fun_base__fun_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'tree_text':{nodeid:'tree_text', nodetitle:'文字键值', layout:'', gridpage:'', formpage:'', tablename:'v_sys_text', pkcol:'', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'wf_process':{nodeid:'wf_process', nodetitle:'流程设计器', layout:'/jxstar/studio/pub/layout_process.js', gridpage:'/jxstar/studio/grid_wfprocess.js', formpage:'', tablename:'wf_process', pkcol:'wf_process__process_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'wf_instance':{nodeid:'wf_instance', nodetitle:'过程实例管理', layout:'/public/layout/layout_tree.js', gridpage:'/jxstar/studio/grid_wfinstance.js', formpage:'', tablename:'wf_instance', pkcol:'wf_instance__instance_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'wf_task':{nodeid:'wf_task', nodetitle:'任务实例管理', layout:'/public/layout/layout_tree.js', gridpage:'/jxstar/studio/grid_wftask.js', formpage:'', tablename:'wf_task', pkcol:'wf_task__task_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'wfnav_graph':{nodeid:'wfnav_graph', nodetitle:'导航图设计器', layout:'/jxstar/studio/pub/layout_graph.js', gridpage:'/jxstar/studio/grid_wfnav_graph.js', formpage:'', tablename:'wfnav_graph', pkcol:'wfnav_graph__graph_id', fkcol:'', auditcol:'wfnav_graph__auditing', subfunid:'', showform:'form', first:'', isarch:'0'},
'wf_nodeattr':{nodeid:'wf_nodeattr', nodetitle:'任务属性设置', layout:'/jxstar/studio/pub/layout_nodeattr.js', gridpage:'', formpage:'/jxstar/studio/form_wfnodeattr.js', tablename:'wf_nodeattr', pkcol:'wf_nodeattr__nodeattr_id', fkcol:'', auditcol:'', subfunid:'wf_user', showform:'', first:'', isarch:'0'},
'wf_user':{nodeid:'wf_user', nodetitle:'任务分配', layout:'', gridpage:'/jxstar/studio/grid_wfuser.js', formpage:'/jxstar/studio/form_wfuser.js', tablename:'wf_user', pkcol:'wf_user__wfuser_id', fkcol:'wf_user__nodeattr_id', auditcol:'', subfunid:'', showform:'', first:'wf_user__user_name', isarch:'0'},
'wf_subprocess':{nodeid:'wf_subprocess', nodetitle:'子过程设置', layout:'', gridpage:'', formpage:'/jxstar/studio/form_wfsubprocess.js', tablename:'wf_subprocess', pkcol:'wf_subprocess__wfsub_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'wf_condition':{nodeid:'wf_condition', nodetitle:'条件设置', layout:'', gridpage:'', formpage:'/jxstar/studio/form_wfcondition.js', tablename:'wf_condition', pkcol:'wf_condition__condition_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'wf_node':{nodeid:'wf_node', nodetitle:'节点信息', layout:'', gridpage:'/jxstar/studio/grid_wfnode.js', formpage:'', tablename:'wf_node', pkcol:'wf_node__node_id', fkcol:'wf_node__process_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'wf_line':{nodeid:'wf_line', nodetitle:'流转信息', layout:'', gridpage:'/jxstar/studio/grid_wfline.js', formpage:'', tablename:'wf_line', pkcol:'wf_line__line_id', fkcol:'wf_line__process_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'wf_assign':{nodeid:'wf_assign', nodetitle:'待办任务', layout:'', gridpage:'/jxstar/studio/grid_wfassign.js', formpage:'', tablename:'wf_assign', pkcol:'wf_assign__assign_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'wf_assign_num':{nodeid:'wf_assign_num', nodetitle:'待办任务合计', layout:'', gridpage:'/jxstar/studio/grid_wfassign_num.js', formpage:'', tablename:'wf_assign', pkcol:'wf_instance__process_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'wf_taskhis':{nodeid:'wf_taskhis', nodetitle:'查看审批历史', layout:'', gridpage:'/jxstar/studio/grid_wftaskhis.js', formpage:'/jxstar/studio/form_wftaskhis.js', tablename:'wf_taskhis', pkcol:'wf_taskhis__task_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'wf_assignq':{nodeid:'wf_assignq', nodetitle:'查看任务分配', layout:'', gridpage:'/jxstar/studio/grid_wfassignq.js', formpage:'', tablename:'wf_assign', pkcol:'wf_assign__assign_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'wf_assignhis':{nodeid:'wf_assignhis', nodetitle:'已办任务合计', layout:'', gridpage:'/jxstar/studio/grid_wfassign_his.js', formpage:'', tablename:'wf_assignhis', pkcol:'wf_process__process_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'wfnav_node':{nodeid:'wfnav_node', nodetitle:'导航图节点', layout:'', gridpage:'', formpage:'/jxstar/studio/form_wfnav_node.js', tablename:'wfnav_node', pkcol:'wfnav_node__node_detid', fkcol:'wfnav_node__graph_id', auditcol:'', subfunid:'', showform:'form', first:'', isarch:'0'},
'rpt_list':{nodeid:'rpt_list', nodetitle:'报表设计器', layout:'/jxstar/studio/pub/layout_rept.js', gridpage:'/jxstar/studio/grid_rpt_list.js', formpage:'', tablename:'rpt_list', pkcol:'rpt_list__report_id', fkcol:'', auditcol:'', subfunid:'rpt_area,rpt_head', showform:'', first:'', isarch:'0'},
'total_list':{nodeid:'total_list', nodetitle:'统计报表设计', layout:'/public/layout/layout_tree_main.js', gridpage:'/jxstar/studio/grid_total_list.js', formpage:'', tablename:'rpt_list', pkcol:'rpt_list__report_id', fkcol:'', auditcol:'', subfunid:'total_area', showform:'', first:'', isarch:'0'},
'imp_list':{nodeid:'imp_list', nodetitle:'数据导入设计', layout:'/jxstar/studio/pub/layout_import.js', gridpage:'/jxstar/studio/grid_imp_list.js', formpage:'/jxstar/studio/form_imp_list.js', tablename:'imp_list', pkcol:'imp_list__imp_id', fkcol:'', auditcol:'', subfunid:'imp_field,imp_relat', showform:'', first:'', isarch:'0'},
'rpt_wfnode':{nodeid:'rpt_wfnode', nodetitle:'选择审批节点', layout:'', gridpage:'/jxstar/studio/grid_rpt_wfnode.js', formpage:'', tablename:'wf_node', pkcol:'wf_node__wfnode_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'rpt_area':{nodeid:'rpt_area', nodetitle:'报表区域定义', layout:'', gridpage:'/jxstar/studio/grid_rpt_area.js', formpage:'/jxstar/studio/form_rpt_area.js', tablename:'rpt_area', pkcol:'rpt_area__area_id', fkcol:'rpt_area__report_id', auditcol:'', subfunid:'rpt_detail,rpt_param,rpt_detailwf', showform:'', first:'', isarch:'0'},
'total_area':{nodeid:'total_area', nodetitle:'数据区域定义', layout:'', gridpage:'/jxstar/studio/grid_total_area.js', formpage:'/jxstar/studio/form_total_area.js', tablename:'rpt_area', pkcol:'rpt_area__area_id', fkcol:'rpt_area__report_id', auditcol:'', subfunid:'total_detail,rpt_param,rpt_drill', showform:'', first:'', isarch:'0'},
'rpt_detail':{nodeid:'rpt_detail', nodetitle:'报表字段定义', layout:'', gridpage:'/jxstar/studio/grid_rpt_detail.js', formpage:'', tablename:'rpt_detail', pkcol:'rpt_detail__det_id', fkcol:'rpt_detail__area_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'total_detail':{nodeid:'total_detail', nodetitle:'统计字段定义', layout:'', gridpage:'/jxstar/studio/grid_total_detail.js', formpage:'', tablename:'rpt_detail', pkcol:'rpt_detail__det_id', fkcol:'rpt_detail__area_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'rpt_head':{nodeid:'rpt_head', nodetitle:'报表标题定义', layout:'', gridpage:'/jxstar/studio/grid_rpt_head.js', formpage:'', tablename:'rpt_head', pkcol:'rpt_head__head_id', fkcol:'rpt_head__report_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'rpt_detailwf':{nodeid:'rpt_detailwf', nodetitle:'审批字段定义', layout:'', gridpage:'/jxstar/studio/grid_rpt_detailwf.js', formpage:'', tablename:'rpt_detail_wf', pkcol:'rpt_detail_wf__detwf_id', fkcol:'rpt_detail_wf__area_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'rpt_param':{nodeid:'rpt_param', nodetitle:'统计参数定义', layout:'', gridpage:'/jxstar/studio/grid_rpt_param.js', formpage:'', tablename:'rpt_param', pkcol:'rpt_param__param_id', fkcol:'rpt_param__area_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'rpt_drill':{nodeid:'rpt_drill', nodetitle:'数据钻取定义', layout:'', gridpage:'/jxstar/studio/grid_rpt_drill.js', formpage:'/jxstar/studio/form_rpt_drill.js', tablename:'rpt_drill', pkcol:'rpt_drill__drill_id', fkcol:'rpt_drill__area_id', auditcol:'', subfunid:'', showform:'form', first:'', isarch:'0'},
'imp_field':{nodeid:'imp_field', nodetitle:'数据字段定义', layout:'', gridpage:'/jxstar/studio/grid_imp_field.js', formpage:'', tablename:'imp_field', pkcol:'imp_field__field_id', fkcol:'imp_field__imp_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'imp_relat':{nodeid:'imp_relat', nodetitle:'数据关系定义', layout:'', gridpage:'/jxstar/studio/grid_imp_relat.js', formpage:'', tablename:'imp_relat', pkcol:'imp_relat__relat_id', fkcol:'imp_relat__imp_id', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'mat_type':{nodeid:'mat_type', nodetitle:'物资分类', layout:'/public/layout/layout_tree.js', gridpage:'/demo/mat/grid_mat_type.js', formpage:'', tablename:'mat_type', pkcol:'mat_type__type_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'mat_type__type_name', isarch:'0'},
'mat_base':{nodeid:'mat_base', nodetitle:'物资目录', layout:'/public/layout/layout_tree.js', gridpage:'/demo/mat/grid_mat_base.js', formpage:'', tablename:'mat_base', pkcol:'mat_base__mat_id', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'mat_base__mat_name', treeteam:[{'team_title':'物资类别','team_id':'A'},{'team_title':'东宏软件公司','team_id':'B'}], isarch:'0'},
'mat_app':{nodeid:'mat_app', nodetitle:'物资采购申请', layout:'/public/layout/layout_main.js', gridpage:'/demo/mat/grid_mat_app.js', formpage:'/demo/mat/form_mat_app.js', tablename:'mat_app', pkcol:'mat_app__app_id', fkcol:'', auditcol:'mat_app__auditing', subfunid:'mat_appdet', showform:'form', first:'', isarch:'0'},
'mat_app1':{nodeid:'mat_app1', nodetitle:'采购申请', layout:'/public/layout/layout_main.js', gridpage:'/demo/mat/grid_mat_app1.js', formpage:'/demo/mat/form_mat_app1.js', tablename:'mat_app', pkcol:'mat_app__app_id', fkcol:'', auditcol:'mat_app__app_status', subfunid:'', showform:'form', first:'', status:{audit0:'10',audit1:'11',audit2:'12',audit3:'13',audit4:'30',audit_b:'',audit_e:''}, isarch:'0'},
'mat_app2':{nodeid:'mat_app2', nodetitle:'采购反馈', layout:'/public/layout/layout_main.js', gridpage:'/demo/mat/grid_mat_app2.js', formpage:'/demo/mat/form_mat_app2.js', tablename:'mat_app', pkcol:'mat_app__app_id', fkcol:'', auditcol:'mat_app__app_status', subfunid:'', showform:'form', first:'', status:{audit0:'13',audit1:'20',audit2:'',audit3:'',audit4:'',audit_b:'10',audit_e:'30'}, isarch:'0'},
'mat_stat':{nodeid:'mat_stat', nodetitle:'采购申请统计', layout:'/public/layout/layout_total.js', gridpage:'', formpage:'', tablename:'', pkcol:'', fkcol:'', auditcol:'', subfunid:'', showform:'', first:'', isarch:'0'},
'mat_appdet':{nodeid:'mat_appdet', nodetitle:'采购申请明细', layout:'', gridpage:'/demo/mat/grid_mat_appdet.js', formpage:'', tablename:'mat_appdet', pkcol:'mat_appdet__det_id', fkcol:'mat_appdet__app_id', auditcol:'', subfunid:'', showform:'', first:'', subChkEdit:true, isarch:'0'}
};
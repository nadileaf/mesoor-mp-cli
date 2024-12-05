export enum AuthMap {
  /** @description 项目管理-频道管理 */
  /** @description 项目管理-查看 */
  canGetChannel = '101',
  /** @description 项目管理-创建channel */
  canCreateChannel = '133',
  /** @description 项目管理-编辑（含删除）channel */
  canEditChannel = '155',
  /** @description 项目管理-全部权限 */
  canManageAllChannel = '189',

  /** @description 素材库-查看 */
  canGetMaterial = '321',
  /** @description 素材库-创建实体 */
  canCreateMaterial = '354',
  /** @description 素材库-编辑实体（含删除） */
  canEditMaterial = '367',

  /** @description 备注-查看 */
  canGetRemark = '443',
  /** @description 备注-创建 */
  canCreateRemark = '443',
  /** @description 备注-编辑 */
  canEditRemark = '443',

  /** @description 标签-查看 */
  canGetLabel = '501',
  /** @description 标签-创建 */
  canCreateLabel = '578',
  /** @description 标签-编辑 */
  canEditLabel = '590',

  /** @description 自动化任务-查看 */
  canGetAutomaticTask = '640',
  /** @description 自动化任务-创建 */
  canCreateAutomaticTask = '670',
  /** @description 自动化任务-编辑 */
  canEditAutomaticTask = '694',
  /** @description 自动化任务-运行结果记录导出 */
  canExportAutomaticTask = '699',

  /** @description 数据连接器-查看 */
  canGetDataConnector = '711',
  /** @description 数据连接器-创建 */
  canCreateDataConnector = '747',
  /** @description 数据连接器-编辑 */
  canEditDataConnector = '794',

  /** @description 权限管理角色-查看 */
  canGetRoleList = '945',
  /** @description 权限管理角色-创建 */
  canCreateRole = '923',
  /** @description 权限管理角色-操作 */
  canOperateRole = '911',

  /** @description 权限管理用户-邀请 */
  canInviteUser = '967',
  /** @description 权限管理用户-操作 */
  canOperateUser = '983',

  /** @deprecated 频道内列表 (弃用，project权限由space role控制)*/
  canGetProject = '211',
  canCreateProject = '256',
  canEditProject = '288',
  /** @deprecated  创建实体分组 */
  canCreateMaterialGroup = '385',
  /** @deprecated  编辑实体分组 */
  canEditMaterialGroup = '391',
  /** @deprecated  报表中心 */
  canGetStatement = '820',
  canExportStatement = '866'
}

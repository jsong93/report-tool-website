export const screenshots = [
  {id:'designer',title:'报表设计器',caption:'Excel 风格功能区、单元格画布与对象属性，在浏览器中完成报表设计。',alt:'真实报表设计器中的收款情况表，包含公式计算与格式设置',file:'designer.webp'},
  {id:'format',title:'单元格与公式',caption:'按单元格配置公式及显示格式，示例展示实收与应收的比例计算。',alt:'收款情况表的公式栏与单元格属性，显示 IFERROR 公式',file:'formula.webp'},
  {id:'binding',title:'数据集与字段绑定',caption:'将数据集字段绑定到单元格，设置展示位置与动态展开方式。',alt:'项目进度演示报表的字段列表、绑定单元格及属性面板',file:'binding.webp'},
  {id:'preview',title:'报表查询与预览',caption:'发布后的网页报表保留查询与阅读入口，业务人员可直接查看结果。',alt:'真实发布页面显示模拟收款数据及合计结果',file:'preview.webp'},
  {id:'dashboard-designer',title:'图表大屏设计',caption:'在画布中组合指标、柱形图、环形图与文字，配置数据和布局。',alt:'销售驾驶舱设计器，包含指标组件、图表画布和布局面板',file:'dashboard-designer.webp'},
  {id:'dashboard',title:'大屏运行效果',caption:'图表读取已绑定的演示数据，集中展示指标与分类对比。',alt:'销售驾驶舱真实运行效果，显示合成销售数据、柱形图和环形图',file:'dashboard.webp'},
  {id:'fill',title:'网页数据填报',caption:'在授权表格中修改数据，保存前标识变更，保存后重新查询核对。',alt:'项目进度在线填报，修改的进度与说明单元格以颜色提示',file:'fill.webp'},
  {id:'export',title:'导出与打印入口',caption:'按报表开放的能力选择 Excel、CSV、PDF 或打印，保留明确的输出选项。',alt:'网页报表的导出与打印操作以及真实报表内容',file:'export.webp'}
] as const;
export const features = [
  {name:'可视化设计',icon:'grid',kicker:'把报表的样子，交给设计器',title:'熟悉的表格操作，\n清晰的设计过程。',description:'通过 Excel 风格功能区编辑单元格、布局与格式，将文字、字段和公式组织成可复用的报表模板。',points:['单元格选择、合并与行列调整','字体、对齐、数值显示与条件格式','公式编辑、撤销重做与草稿预览'],scene:'适合财务统计、业务台账与固定格式报表。',shot:0,note:'支持范围以产品内的公式目录和格式选项为准。'},
  {name:'数据连接',icon:'database',kicker:'让业务数据进入报表',title:'准备一次数据，\n按需绑定到单元格。',description:'通过数据工作区管理 SQL、手工 / JSON 和 API 数据集。设计时选择字段，配置单元格绑定与动态展开。',points:['数据集字段与报表布局分开管理','按授权数据源查询与配置参数','绑定、预览与保存形成连续工作流'],scene:'适合合同明细、仓储台账与经营统计。',shot:2,note:'具体数据源、查询语法与接入权限需要结合部署环境确认。'},
  {name:'查询与发布',icon:'search',kicker:'把设计结果交给使用者',title:'从设计工作台，\n到可访问的网页报表。',description:'保存模板后预览结果，按需发布为独立网页。草稿修改与发布分开，便于核对内容后再更新。',points:['查询条件与结果查看','独立发布链接与访问权限','报表嵌入现有业务系统'],scene:'适合业务门户、内部管理系统与客户报表。',shot:3,note:'访问报表仍受身份与数据权限约束，嵌入方式需结合目标系统配置。'},
  {name:'图表大屏',icon:'chart',kicker:'让关键指标更容易看见',title:'用图表组织信息，\n用数据理解业务。',description:'在可视化画布中组合指标卡、图表和文字，配置数据绑定与布局，发布后集中查看业务指标。',points:['指标、柱形图、环形图等组件','组件布局、主题与数据绑定','独立发布与可配置刷新'],scene:'适合园区经营、部门看板与可视化分析。',shot:5,note:'图中为合成销售样例；不同图表的导出能力存在差异。'},
  {name:'数据填报',icon:'edit',kicker:'让报表成为业务输入入口',title:'在表格中填写，\n在保存后核对。',description:'为报表配置保存目标、字段映射和校验规则。业务人员可在授权页面新增或编辑记录，完成日常数据维护。',points:['在线编辑与新增记录','必填、字段类型与下拉选项','变更提示、保存与查询回读'],scene:'适合项目进度、业务数据收集与台账维护。',shot:6,note:'需要先配置数据库目标、唯一键和字段规则，并授予相应权限。'},
  {name:'导出与打印',icon:'download',kicker:'让报表走到下一步工作中',title:'在线查看之后，\n继续交付与归档。',description:'根据报表与使用场景选择 Excel、CSV、PDF 或打印。通过输出选项区分原始数据、显示格式与实际支持的导出能力。',points:['Excel 与 CSV 数据导出','PDF 输出与打印设置','保留数值精度的受控输出策略'],scene:'适合文件交付、周期汇报与资料归档。',shot:7,note:'Excel 数值精度和图表输出存在边界，不承诺与 Excel 全功能兼容。'}
];
export const scenes = [
  {icon:'chart',name:'财务统计',text:'收款、支出与汇总分析，让统计口径与结果集中呈现。'},
  {icon:'file',name:'合同管理',text:'组织合同明细、履约进度与相关业务台账。'},
  {icon:'box',name:'仓储管理',text:'按业务数据设计库存、出入库与分类汇总报表。'},
  {icon:'building',name:'园区经营',text:'把经营明细、汇总指标和可视化看板放在一起。'},
  {icon:'edit',name:'数据填报',text:'配置字段与校验，为日常业务建立网页填写入口。'},
  {icon:'pie',name:'可视化分析',text:'组合指标和图表，围绕业务问题组织数据视图。'}
];

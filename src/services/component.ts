/**
 * Represents basic metadata for a component.
 */
export interface Component {
  /**
   * The unique identifier for the component.
   */
  component_id: string;
  /**
   * The name of the component.
   */
  name: string;
  /**
   * The dynasty the component belongs to.
   */
  dynasty: string;
  /**
   * The style of the component.
   */
  style: string;
  /**
   * The material of the component.
   */
  material: string;
  /**
   * The function of the component.
   */
  function: string;
  /**
   * The source of the component.
   */
  source: string; // Could be region
  /**
   * URL of a preview image for the component.
   */
  previewImageUrl: string;
  /**
   * The type of the component
   */
  type: string;
}

const mockComponents: Component[] = [
  {
    component_id: '1',
    name: '斗拱 (Dou Gong)',
    dynasty: '唐朝',
    style: '雄大简练',
    material: '木材 (松木)',
    function: '支撑屋檐，结构件',
    source: '山西省',
    previewImageUrl: 'https://picsum.photos/seed/dougong/300/200',
    type: '斗拱组合'
  },
  {
    component_id: '2',
    name: '梁 (Liang)',
    dynasty: '明朝',
    style: '规整华丽',
    material: '木材 (楠木)',
    function: '支撑屋顶，跨越开口',
    source: '北京故宫',
    previewImageUrl: 'https://picsum.photos/seed/liang/300/200',
    type: '梁'
  },
  {
    component_id: '3',
    name: '雀替 (Que Ti)',
    dynasty: '清朝',
    style: '繁复精细',
    material: '木材 (榆木)',
    function: '加强连接，装饰',
    source: '苏州园林',
    previewImageUrl: 'https://picsum.photos/seed/queti/300/200',
    type: '雀替'
  },
  {
    component_id: '4',
    name: '柱础 (Zhu Chu)',
    dynasty: '宋朝',
    style: '古朴厚重',
    material: '石材 (花岗岩)',
    function: '支撑柱子，防止腐朽',
    source: '福建土楼',
    previewImageUrl: 'https://picsum.photos/seed/zhuchu/300/200',
    type: '柱础'
  },
  {
    component_id: '5',
    name: '椽子 (Chuan Zi)',
    dynasty: '汉朝',
    style: '古朴实用',
    material: '木材 (杨木)',
    function: '支撑屋瓦',
    source: '乡村住宅',
    previewImageUrl: 'https://picsum.photos/seed/chuanzi/300/200',
    type: '椽子'
  },
  {
    component_id: '6',
    name: '月梁 (Yue Liang)',
    dynasty: '宋朝',
    style: '曲线优美',
    material: '木材 (樟木)',
    function: '支撑屋顶，美观',
    source: '江南地区',
    previewImageUrl: 'https://picsum.photos/seed/yueliang/300/200',
    type: '月梁'
  },
  {
    component_id: '7',
    name: '昂 (Ang)',
    dynasty: '唐朝',
    style: '出跳深远',
    material: '木材 (松木)',
    function: '斗拱中的杠杆件',
    source: '主要寺庙',
    previewImageUrl: 'https://picsum.photos/seed/ang/300/200',
    type: '昂 (斗拱)'
  },
  {
    component_id: '8',
    name: '挂落 (Gua Luo)',
    dynasty: '清朝',
    style: '玲珑剔透',
    material: '木材 (黄杨木)',
    function: '装饰，界定空间',
    source: '民居庭院',
    previewImageUrl: 'https://picsum.photos/seed/gualuo/300/200',
    type: '挂落'
  },
];


/**
 * Asynchronously retrieves a list of components.
 * @param query The query to filter components by. (Not implemented in mock)
 * @returns A promise that resolves to an array of Component objects.
 */
export async function getComponents(query?: string): Promise<Component[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  if (query) {
    const lowerQuery = query.toLowerCase();
    return mockComponents.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) ||
      c.dynasty.toLowerCase().includes(lowerQuery) ||
      c.type.toLowerCase().includes(lowerQuery) ||
      c.material.toLowerCase().includes(lowerQuery)
    );
  }
  return mockComponents;
}

/**
 * Asynchronously retrieves a component by its ID.
 * @param id The ID of the component to retrieve.
 * @returns A promise that resolves to a Component object or null if not found.
 */
export async function getComponent(id: string): Promise<Component | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const component = mockComponents.find(c => c.component_id === id);
  return component || null;
}

export interface GeometryParams {
  component_id: string;
  dimensions: string;
  structureDescription: string;
  tenonType: string;
  explodedViewUrl: string;
}

/**
 * Retrieves geometry parameters for a given component ID.
 * @param componentId The ID of the component.
 * @returns Geometry parameters for the component.
 */
export async function getGeometryParams(componentId: string): Promise<GeometryParams | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const component = mockComponents.find(c => c.component_id === componentId);
  if (!component) return null;

  // Mock data based on component type
  if (component.type === '斗拱组合') {
    return {
      component_id: componentId,
      dimensions: '尺寸不定，典型组合 60厘米 x 40厘米 x 50厘米',
      structureDescription: '复杂的斗（块）和拱（臂）的联锁系统。层数和复杂性因等级和时期而异。',
      tenonType: '榫卯结合，穿插卯',
      explodedViewUrl: 'https://picsum.photos/seed/dougong_exploded/600/400',
    };
  }
  if (component.type === '梁') {
     return {
      component_id: componentId,
      dimensions: '长度可达10米，横截面30厘米 x 40厘米',
      structureDescription: '主要水平承重构件，常有雕刻或彩绘。可以是直梁或微弯的月梁。',
      tenonType: '燕尾榫（用于与柱连接）',
      explodedViewUrl: 'https://picsum.photos/seed/liang_exploded/600/400',
    };
  }
  return { // Default mock
    component_id: componentId,
    dimensions: '约 30厘米 x 20厘米 x 15厘米',
    structureDescription: '构件的详细结构组成，突出关键节点和组装方法。',
    tenonType: '常见榫卯',
    explodedViewUrl: `https://picsum.photos/seed/${componentId}_exploded/600/400`,
  };
}

export interface DigitalModels {
  component_id: string;
  modelUrl: string; // .gltf file URL
  previewImageUrl: string;
  modelingMethod: string;
  copyrightInfo: string;
}

/**
 * Retrieves digital models for a given component ID.
 * @param componentId The ID of the component.
 * @returns Digital models for the component.
 */
export async function getDigitalModels(componentId: string): Promise<DigitalModels | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const component = mockComponents.find(c => c.component_id === componentId);
  if (!component) return null;

  const modelFile = componentId === '1' ? '/models/dougong_sample.gltf' : '/models/default_component.gltf';
  
  return {
    component_id: componentId,
    modelUrl: modelFile, 
    previewImageUrl: `https://picsum.photos/seed/${componentId}_model_preview/400/300`,
    modelingMethod: '摄影测量与CAD建模',
    copyrightInfo: 'CC BY-NC 4.0, 建筑遗产研究院',
  };
}

export interface SemanticTags {
  component_id: string;
  ifcClassification: string;
  semanticStructure: string; // e.g., JSON-LD, XML
  aiTags: string[];
}

/**
 * Retrieves semantic tags for a given component ID.
 * @param componentId The ID of the component.
 * @returns Semantic tags for the component.
 */
export async function getSemanticTags(componentId: string): Promise<SemanticTags | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const component = mockComponents.find(c => c.component_id === componentId);
  if (!component) return null;

  const tagsMap: Record<string, string[]> = {
    '斗拱组合': ['斗拱', '榫卯', '承重', '挑檐', '唐代风格'],
    '梁': ['梁', '主梁', '承重结构', '木材', '明代建筑'],
    '雀替': ['雀替', '加固', '装饰', '清代园林', '柱梁连接'],
    '柱础': ['柱础', '石材', '防潮', '宋代遗存', '柱子基础'],
    '椽子': ['椽子', '屋顶', '瓦片支撑', '汉代民居', '小料'],
    '月梁': ['月梁', '弧形梁', '江南建筑', '美学', '宋式结构'],
    '昂 (斗拱)': ['昂', '杠杆', '斗拱组成', '唐代寺庙', '结构力学'],
    '挂落': ['挂落', '檐下装饰', '木雕', '清代民宅', '通风采光'],
  };

  return {
    component_id: componentId,
    ifcClassification: `IfcBuildingElementProxy (类型: ${component.type.replace(/\s+/g, '_')})`,
    semanticStructure: 'JSON-LD (链接数据)',
    aiTags: tagsMap[component.type] || ['古建筑', '木构件', component.dynasty, component.material],
  };
}

export interface VisualAssets {
  component_id: string;
  images: string[]; // URLs of high-res photos
  drawings: string[]; // URLs of architectural drawings (plans, sections, elevations)
  structuralDiagrams: { url: string; type: string; description: string }[];
}

/**
 * Retrieves visual assets for a given component ID.
 * @param componentId The ID of the component.
 * @returns Visual assets for the component.
 */
export async function getVisualAssets(componentId: string): Promise<VisualAssets | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const component = mockComponents.find(c => c.component_id === componentId);
  if (!component) return null;
  
  return {
    component_id: componentId,
    images: [
      `https://picsum.photos/seed/${componentId}_image1/800/600`,
      `https://picsum.photos/seed/${componentId}_image2/800/600`,
      `https://picsum.photos/seed/${componentId}_image3/800/600`,
    ],
    drawings: [
      `https://picsum.photos/seed/${componentId}_drawing_plan/800/600`,
      `https://picsum.photos/seed/${componentId}_drawing_section/800/600`,
    ],
    structuralDiagrams: [
      { url: `https://picsum.photos/seed/${componentId}_struct_diag1/800/600`, type: '荷载路径分析', description: '显示构件荷载分布的图表。' },
      { url: `https://picsum.photos/seed/${componentId}_struct_diag2/800/600`, type: '节点详图', description: '榫卯连接的特写。' },
    ],
  };
}

export interface AccessPolicies {
  component_id: string;
  dataOpenStatus: string; // e.g., Open, Restricted, Closed
  citationFormat: string; // e.g., APA, MLA, Chicago
  uploaderInfo: string;
}

/**
 * Retrieves access policies for a given component ID.
 * @param componentId The ID of the component.
 * @returns Access policies for the component.
 */
export async function getAccessPolicies(componentId: string): Promise<AccessPolicies | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const component = mockComponents.find(c => c.component_id === componentId);
  if (!component) return null;

  return {
    component_id: componentId,
    dataOpenStatus: '开放用于非商业研究和教育目的。',
    citationFormat: `木构浏览器。(年份). "${component.name}". 构件ID: ${componentId}. 检索自 [URL]`,
    uploaderInfo: '清华大学数字遗产实验室。',
  };
}

// Helper to get distinct values for filters
export async function getDistinctFilterValues(): Promise<{ dynasties: string[], types: string[], materials: string[], sources: string[] }> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const dynasties = Array.from(new Set(mockComponents.map(c => c.dynasty))).sort();
  const types = Array.from(new Set(mockComponents.map(c => c.type))).sort();
  const materials = Array.from(new Set(mockComponents.map(c => c.material))).sort();
  const sources = Array.from(new Set(mockComponents.map(c => c.source))).sort(); 
  return { dynasties, types, materials, sources };
}


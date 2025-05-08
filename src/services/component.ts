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
    dynasty: 'Tang Dynasty',
    style: '雄大简练 (Majestic & Concise)',
    material: 'Wood (Pine)',
    function: 'Support roof eaves, Structural',
    source: 'Shanxi Province',
    previewImageUrl: 'https://picsum.photos/seed/dougong/300/200',
    type: 'Bracket Set'
  },
  {
    component_id: '2',
    name: '梁 (Liang)',
    dynasty: 'Ming Dynasty',
    style: '规整华丽 (Orderly & Ornate)',
    material: 'Wood (Nanmu)',
    function: 'Support roof, Span opening',
    source: 'Beijing Imperial Palace',
    previewImageUrl: 'https://picsum.photos/seed/liang/300/200',
    type: 'Beam'
  },
  {
    component_id: '3',
    name: '雀替 (Que Ti)',
    dynasty: 'Qing Dynasty',
    style: '繁复精细 (Complex & Delicate)',
    material: 'Wood (Elm)',
    function: 'Strengthen connection, Decorative',
    source: 'Suzhou Gardens',
    previewImageUrl: 'https://picsum.photos/seed/queti/300/200',
    type: 'Angle Brace'
  },
  {
    component_id: '4',
    name: '柱础 (Zhu Chu)',
    dynasty: 'Song Dynasty',
    style: '古朴厚重 (Simple & Massive)',
    material: 'Stone (Granite)', // Changed material for variety
    function: 'Support column, Prevent decay',
    source: 'Fujian Tulou',
    previewImageUrl: 'https://picsum.photos/seed/zhuchu/300/200',
    type: 'Plinth'
  },
  {
    component_id: '5',
    name: '椽子 (Chuan Zi)',
    dynasty: 'Han Dynasty',
    style: '古朴实用 (Archaic & Practical)',
    material: 'Wood (Poplar)',
    function: 'Support roof tiles',
    source: 'Rural Dwellings',
    previewImageUrl: 'https://picsum.photos/seed/chuanzi/300/200',
    type: 'Rafter'
  },
  {
    component_id: '6',
    name: '月梁 (Yue Liang)',
    dynasty: 'Song Dynasty',
    style: '曲线优美 (Graceful Curve)',
    material: 'Wood (Camphor)',
    function: 'Support roof, Aesthetic',
    source: 'Jiangnan Region',
    previewImageUrl: 'https://picsum.photos/seed/yueliang/300/200',
    type: 'Curved Beam'
  },
  {
    component_id: '7',
    name: '昂 (Ang)',
    dynasty: 'Tang Dynasty',
    style: '出跳深远 (Deep Projection)',
    material: 'Wood (Pine)',
    function: 'Leverage in Dou Gong',
    source: 'Major Temples',
    previewImageUrl: 'https://picsum.photos/seed/ang/300/200',
    type: 'Lever Arm (Dou Gong)'
  },
  {
    component_id: '8',
    name: '挂落 (Gua Luo)',
    dynasty: 'Qing Dynasty',
    style: '玲珑剔透 (Exquisite & Translucent)',
    material: 'Wood (Boxwood)',
    function: 'Decorative, Define space',
    source: 'Residential Courtyards',
    previewImageUrl: 'https://picsum.photos/seed/gualuo/300/200',
    type: 'Frieze Ornament'
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
  if (component.type === 'Bracket Set') {
    return {
      component_id: componentId,
      dimensions: 'Varies, typical assembly 60cm x 40cm x 50cm',
      structureDescription: 'Complex interlocking system of dou (blocks) and gong (arms). The number of tiers and complexity varies by rank and period.',
      tenonType: '榫卯结合 (Mortise and Tenon), 穿插卯 (Interpenetrating Tenon)',
      explodedViewUrl: 'https://picsum.photos/seed/dougong_exploded/600/400',
    };
  }
  if (component.type === 'Beam') {
     return {
      component_id: componentId,
      dimensions: 'Length up to 10m, Cross-section 30cm x 40cm',
      structureDescription: 'Main horizontal load-bearing member, often carved or painted. Can be straight or slightly curved (月梁).',
      tenonType: '燕尾榫 (Dovetail Tenon) for connections to columns',
      explodedViewUrl: 'https://picsum.photos/seed/liang_exploded/600/400',
    };
  }
  return { // Default mock
    component_id: componentId,
    dimensions: 'Approx. 30cm x 20cm x 15cm',
    structureDescription: 'Detailed structural composition of the component, highlighting key joints and assembly methods.',
    tenonType: '常见榫卯 (Common Mortise and Tenon)',
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

  // For demonstration, only component_id '1' (Dou Gong) has a specific model.
  // Replace with actual model URLs if available.
  const modelFile = componentId === '1' ? '/models/dougong_sample.gltf' : '/models/default_component.gltf';
  
  return {
    component_id: componentId,
    modelUrl: modelFile, // Placeholder for actual glTF model path
    previewImageUrl: `https://picsum.photos/seed/${componentId}_model_preview/400/300`,
    modelingMethod: 'Photogrammetry and CAD modeling',
    copyrightInfo: 'CC BY-NC 4.0, Research Institute of Architectural Heritage',
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
    'Bracket Set': ['斗拱', '榫卯', '承重', '挑檐', '唐代风格'],
    'Beam': ['梁', '主梁', '承重结构', '木材', '明代建筑'],
    'Angle Brace': ['雀替', '加固', '装饰', '清代园林', '柱梁连接'],
    'Plinth': ['柱础', '石材', '防潮', '宋代遗存', '柱子基础'],
    'Rafter': ['椽子', '屋顶', '瓦片支撑', '汉代民居', '小料'],
    'Curved Beam': ['月梁', '弧形梁', '江南建筑', '美学', '宋式结构'],
    'Lever Arm (Dou Gong)': ['昂', '杠杆', '斗拱组成', '唐代寺庙', '结构力学'],
    'Frieze Ornament': ['挂落', '檐下装饰', '木雕', '清代民宅', '通风采光'],
  }

  return {
    component_id: componentId,
    ifcClassification: `IfcBuildingElementProxy (Type: ${component.type.replace(/\s+/g, '_')})`,
    semanticStructure: 'JSON-LD (Linked Data)',
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
      { url: `https://picsum.photos/seed/${componentId}_struct_diag1/800/600`, type: 'Load Path Analysis', description: 'Diagram showing load distribution through the component.' },
      { url: `https://picsum.photos/seed/${componentId}_struct_diag2/800/600`, type: 'Joint Detail', description: 'Close-up of tenon connections.' },
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
    dataOpenStatus: 'Open for non-commercial research and education purposes.',
    citationFormat: `WoodCraft Explorer. (Year). "${component.name}". Component ID: ${componentId}. Retrieved from [URL]`,
    uploaderInfo: 'Digital Heritage Lab, Tsinghua University.',
  };
}

// Helper to get distinct values for filters
export async function getDistinctFilterValues(): Promise<{ dynasties: string[], types: string[], materials: string[], sources: string[] }> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const dynasties = Array.from(new Set(mockComponents.map(c => c.dynasty))).sort();
  const types = Array.from(new Set(mockComponents.map(c => c.type))).sort();
  const materials = Array.from(new Set(mockComponents.map(c => c.material))).sort();
  const sources = Array.from(new Set(mockComponents.map(c => c.source))).sort(); // 'source' is used for region here
  return { dynasties, types, materials, sources };
}


import ModelViewer from '@/components/model-viewer';
import { 
  getComponent,
  getComponents, // Changed from getAllComponents
  getGeometryParams, 
  getDigitalModels, 
  getSemanticTags, 
  getVisualAssets, 
  getAccessPolicies,
  type Component,
  type GeometryParams,
  type DigitalModels,
  type SemanticTags,
  type VisualAssets,
  type AccessPolicies
} from '@/services/component';
import { locales } from '@/app/i18n/settings';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Download, Image as ImageIcon, Info, TagsIcon, Landmark, SearchCode, DatabaseZap, HardHat, Building, HelpCircle } from 'lucide-react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Image from 'next/image';
import TagList from '@/components/tag-list';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

type ComponentDetailPageProps = {
  params: { id: string; locale: string };
};

interface DetailSectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const DetailSection: React.FC<DetailSectionProps> = ({ title, icon: Icon, children, defaultOpen = false }) => (
  <AccordionItem value={title.toLowerCase().replace(/\s+/g, '-')}>
    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        {title}
      </div>
    </AccordionTrigger>
    <AccordionContent className="pt-2">
      {children}
    </AccordionContent>
  </AccordionItem>
);


export default async function ComponentDetailPage({ params }: ComponentDetailPageProps) {
  const componentId = params.id;

  const [
    component,
    geometryParams,
    digitalModels,
    semanticTags,
    visualAssets,
    accessPolicies
  ] = await Promise.all([
    getComponent(componentId),
    getGeometryParams(componentId),
    getDigitalModels(componentId),
    getSemanticTags(componentId),
    getVisualAssets(componentId),
    getAccessPolicies(componentId),
  ]);

  if (!component || !digitalModels) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: 3D Model Viewer & Basic Info */}
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="p-0">
              <div className="aspect-[16/12] w-full bg-muted">
                <ModelViewer modelUrl={digitalModels.modelUrl} />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <CardTitle className="text-3xl font-bold mb-2 text-primary">{component.name}</CardTitle>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="text-sm">{component.dynasty}</Badge>
                <Badge variant="secondary" className="text-sm">{component.type}</Badge>
                <Badge variant="outline" className="text-sm">{component.material}</Badge>
                <Badge variant="outline" className="text-sm">{component.source}</Badge>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                这是一个关于 {component.name} 的简要介绍。它是一个源自 {component.dynasty} 的 {component.type}，主要由 {component.material} 制成，常见于 {component.source}地区。
              </p>
            </CardContent>
          </Card>

          {visualAssets && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  视觉资料
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full whitespace-nowrap rounded-md">
                  <div className="flex space-x-4 pb-4">
                    {visualAssets.images.map((src, index) => (
                      <div key={`img-${index}`} className="overflow-hidden rounded-md shadow-md flex-shrink-0">
                        <Image
                          src={src}
                          alt={`${component.name} 图片 ${index + 1}`}
                          width={250}
                          height={180}
                          className="object-cover w-[250px] h-[180px] hover:scale-105 transition-transform duration-300"
                          data-ai-hint={`${component.type} photo architecture`}
                        />
                      </div>
                    ))}
                    {visualAssets.drawings.map((src, index) => (
                      <div key={`drawing-${index}`} className="overflow-hidden rounded-md shadow-md flex-shrink-0">
                        <Image
                          src={src}
                          alt={`${component.name} 图纸 ${index + 1}`}
                          width={250}
                          height={180}
                          className="object-cover w-[250px] h-[180px] hover:scale-105 transition-transform duration-300"
                          data-ai-hint={`${component.type} drawing blueprint`}
                        />
                      </div>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
                {visualAssets.structuralDiagrams.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2 text-muted-foreground">结构图:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {visualAssets.structuralDiagrams.map((diag, index) => (
                       <div key={`diag-${index}`} className="border rounded-lg p-3 bg-card/50">
                         <Image src={diag.url} alt={diag.type} width={300} height={200} className="w-full h-auto rounded-md mb-2 object-contain max-h-48" data-ai-hint={`${component.type} diagram structure`} />
                         <p className="text-sm font-medium">{diag.type}</p>
                         <p className="text-xs text-muted-foreground">{diag.description}</p>
                       </div>
                    ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

        </div>

        {/* Right Column: Detailed Information Accordion */}
        <div className="space-y-6">
          <Card className="shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl">详细信息</CardTitle>
              <CardDescription>关于此构件的更多技术和背景数据。</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" defaultValue={['基本信息']} className="w-full">
                <DetailSection title="基本信息" icon={Info} defaultOpen>
                  <Table>
                    <TableBody>
                      <TableRow><TableCell className="font-semibold w-1/3">名称</TableCell><TableCell>{component.name}</TableCell></TableRow>
                      <TableRow><TableCell className="font-semibold">朝代</TableCell><TableCell>{component.dynasty}</TableCell></TableRow>
                      <TableRow><TableCell className="font-semibold">风格</TableCell><TableCell>{component.style}</TableCell></TableRow>
                      <TableRow><TableCell className="font-semibold">材质</TableCell><TableCell>{component.material}</TableCell></TableRow>
                      <TableRow><TableCell className="font-semibold">功能</TableCell><TableCell>{component.function}</TableCell></TableRow>
                      <TableRow><TableCell className="font-semibold">来源/地区</TableCell><TableCell>{component.source}</TableCell></TableRow>
                      <TableRow><TableCell className="font-semibold">类型</TableCell><TableCell>{component.type}</TableCell></TableRow>
                    </TableBody>
                  </Table>
                </DetailSection>

                {geometryParams && (
                  <DetailSection title="几何参数" icon={HardHat}>
                    <Table>
                      <TableBody>
                        <TableRow><TableCell className="font-semibold w-1/3">尺寸</TableCell><TableCell>{geometryParams.dimensions}</TableCell></TableRow>
                        <TableRow><TableCell className="font-semibold">结构描述</TableCell><TableCell>{geometryParams.structureDescription}</TableCell></TableRow>
                        <TableRow><TableCell className="font-semibold">榫卯类型</TableCell><TableCell>{geometryParams.tenonType}</TableCell></TableRow>
                        {geometryParams.explodedViewUrl && (
                          <TableRow>
                            <TableCell className="font-semibold">分解图</TableCell>
                            <TableCell>
                              <Image src={geometryParams.explodedViewUrl} alt={`${component.name} 分解图`} width={200} height={150} className="rounded-md border" data-ai-hint="exploded diagram" />
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </DetailSection>
                )}

                {digitalModels && (
                   <DetailSection title="数字模型信息" icon={Download}>
                    <Table>
                      <TableBody>
                        <TableRow><TableCell className="font-semibold w-1/3">建模方法</TableCell><TableCell>{digitalModels.modelingMethod}</TableCell></TableRow>
                        <TableRow><TableCell className="font-semibold">版权信息</TableCell><TableCell>{digitalModels.copyrightInfo}</TableCell></TableRow>
                        <TableRow><TableCell className="font-semibold">预览图</TableCell><TableCell>
                          <Image src={digitalModels.previewImageUrl} alt={`${component.name} 模型预览`} width={200} height={150} className="rounded-md border" data-ai-hint="3d model render"/>
                        </TableCell></TableRow>
                      </TableBody>
                    </Table>
                  </DetailSection>
                )}

                {semanticTags && (
                  <DetailSection title="语义标签" icon={TagsIcon}>
                    <Table>
                      <TableBody>
                        <TableRow><TableCell className="font-semibold w-1/3">IFC分类</TableCell><TableCell>{semanticTags.ifcClassification}</TableCell></TableRow>
                        <TableRow><TableCell className="font-semibold">语义结构</TableCell><TableCell>{semanticTags.semanticStructure}</TableCell></TableRow>
                        <TableRow>
                          <TableCell className="font-semibold align-top">AI标签</TableCell>
                          <TableCell>
                            <TagList tags={semanticTags.aiTags} />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </DetailSection>
                )}
                
                {accessPolicies && (
                  <DetailSection title="访问策略" icon={DatabaseZap}>
                     <Table>
                      <TableBody>
                        <TableRow><TableCell className="font-semibold w-1/3">数据开放状态</TableCell><TableCell>{accessPolicies.dataOpenStatus}</TableCell></TableRow>
                        <TableRow><TableCell className="font-semibold">引用格式</TableCell><TableCell><pre className="whitespace-pre-wrap text-xs bg-muted p-2 rounded-md">{accessPolicies.citationFormat}</pre></TableCell></TableRow>
                        <TableRow><TableCell className="font-semibold">上传者信息</TableCell><TableCell>{accessPolicies.uploaderInfo}</TableCell></TableRow>
                      </TableBody>
                    </Table>
                  </DetailSection>
                )}
                 <DetailSection title="相关构件" icon={Building}>
                    {/* This section can be populated with related components logic later */}
                    <p className="text-muted-foreground">暂无相关构件信息。</p>
                </DetailSection>
                <DetailSection title="构件溯源" icon={Landmark}>
                     {/* This section can be populated with component origin/history logic later */}
                    <p className="text-muted-foreground">构件历史溯源信息正在整理中。</p>
                </DetailSection>
                <DetailSection title="参数化查询" icon={SearchCode}>
                     {/* This section can be populated with parametric search logic later */}
                    <p className="text-muted-foreground">参数化查询功能即将推出。</p>
                </DetailSection>
                 <DetailSection title="模拟建造" icon={HelpCircle}>
                    <p className="text-muted-foreground">模拟建造信息正在开发中。</p>
                </DetailSection>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


export async function generateStaticParams() {
  const components = await getComponents(); // Changed from getAllComponents
  return locales.flatMap((locale) => {
    return components.map((component) => ({
      id: component.component_id,
      locale,
    }));
  });
}


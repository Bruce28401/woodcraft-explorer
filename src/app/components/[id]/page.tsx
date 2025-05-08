
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
  getComponent,
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
  type AccessPolicies,
} from '@/services/component';

import ModelViewer from '@/components/model-viewer';
import TagList from '@/components/tag-list';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Download, Image as ImageIcon, SquareKanban, Info, Tags, Landmark } from 'lucide-react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type ComponentDetailPageProps = {
  params: { id: string };
};

export async function generateMetadata({ params }: ComponentDetailPageProps): Promise<Metadata> {
  const component = await getComponent(params.id);
  if (!component) {
    return { title: '未找到构件' };
  }
  return {
    title: `${component.name} | 木构浏览器`,
    description: `关于${component.name}（来自${component.dynasty}的传统中国木构建筑构件）的详细信息。`,
  };
}

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <TableRow>
    <TableCell className="font-semibold text-muted-foreground w-1/3">{label}</TableCell>
    <TableCell>{value || '暂无信息'}</TableCell>
  </TableRow>
);

export default async function ComponentDetailPage({ params }: ComponentDetailPageProps) {
  const componentData = await Promise.all([
    getComponent(params.id),
    getGeometryParams(params.id),
    getDigitalModels(params.id),
    getSemanticTags(params.id),
    getVisualAssets(params.id),
    getAccessPolicies(params.id),
  ]);

  const [
    component,
    geometryParams,
    digitalModels,
    semanticTags,
    visualAssets,
    accessPolicies,
  ] = componentData as [
    Component | null,
    GeometryParams | null,
    DigitalModels | null,
    SemanticTags | null,
    VisualAssets | null,
    AccessPolicies | null
  ];

  if (!component) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8 overflow-hidden shadow-xl">
        <div className="md:flex">
          <div className="md:w-1/3 relative">
            <Image
              src={component.previewImageUrl}
              alt={`${component.name} 的图片`}
              width={400}
              height={300}
              className="object-cover w-full h-full min-h-[250px]"
              data-ai-hint={`${component.type} large ${component.dynasty}`}
              priority
            />
          </div>
          <div className="md:w-2/3 p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-3xl font-bold text-primary">{component.name}</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">{component.type} - {component.dynasty}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  <DetailRow label="样式" value={component.style} />
                  <DetailRow label="材质" value={component.material} />
                  <DetailRow label="功能" value={component.function} />
                  <DetailRow label="来源/地区" value={component.source} />
                </TableBody>
              </Table>
            </CardContent>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-6">
          <TabsTrigger value="details"><SquareKanban className="mr-2 h-4 w-4" />几何参数</TabsTrigger>
          <TabsTrigger value="model"><Landmark className="mr-2 h-4 w-4" />3D模型</TabsTrigger>
          <TabsTrigger value="visuals"><ImageIcon className="mr-2 h-4 w-4" />视觉资料</TabsTrigger>
          <TabsTrigger value="semantic"><Tags className="mr-2 h-4 w-4" />语义信息</TabsTrigger>
          <TabsTrigger value="access"><Info className="mr-2 h-4 w-4" />数据访问</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>几何与结构参数</CardTitle>
            </CardHeader>
            <CardContent>
              {geometryParams ? (
                <Table>
                  <TableBody>
                    <DetailRow label="尺寸" value={geometryParams.dimensions} />
                    <DetailRow label="结构描述" value={geometryParams.structureDescription} />
                    <DetailRow label="榫卯类型" value={geometryParams.tenonType} />
                    {geometryParams.explodedViewUrl && (
                       <TableRow>
                        <TableCell className="font-semibold text-muted-foreground">爆炸视图</TableCell>
                        <TableCell>
                           <Image
                            src={geometryParams.explodedViewUrl}
                            alt="爆炸视图示意图"
                            width={500}
                            height={350}
                            className="rounded-md border object-contain"
                            data-ai-hint="exploded diagram blueprint"
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              ) : <p>暂无几何参数信息。</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="model">
          <Card>
            <CardHeader>
              <CardTitle>3D模型查看器</CardTitle>
            </CardHeader>
            <CardContent>
              {digitalModels && digitalModels.modelUrl ? (
                <>
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden border mb-4">
                    <ModelViewer modelUrl={digitalModels.modelUrl} />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                      <p><strong>建模方法:</strong> {digitalModels.modelingMethod}</p>
                      <p><strong>版权信息:</strong> {digitalModels.copyrightInfo}</p>
                    </div>
                    <Button asChild variant="default" size="lg">
                      <a href={digitalModels.modelUrl} download>
                        <Download className="mr-2 h-5 w-5" /> 下载模型
                      </a>
                    </Button>
                  </div>
                </>
              ) : <p>暂无3D模型信息。</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visuals">
          <Card>
            <CardHeader>
              <CardTitle>视觉资料：图像与图纸</CardTitle>
            </CardHeader>
            <CardContent>
              {visualAssets ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">图像</h3>
                    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                      <div className="flex space-x-4 p-4">
                        {visualAssets.images.map((img, idx) => (
                          <Image
                            key={idx}
                            src={img}
                            alt={`${component.name} - 图像 ${idx + 1}`}
                            width={250}
                            height={180}
                            className="h-48 w-auto rounded-md object-cover border"
                            data-ai-hint={`${component.type} photograph architecture`}
                          />
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">图纸</h3>
                     <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                      <div className="flex space-x-4 p-4">
                        {visualAssets.drawings.map((drawing, idx) => (
                          <Image
                            key={idx}
                            src={drawing}
                            alt={`${component.name} - 图纸 ${idx + 1}`}
                            width={250}
                            height={180}
                            className="h-48 w-auto rounded-md object-cover border bg-white" 
                            data-ai-hint="architectural drawing blueprint"
                          />
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">结构示意图</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {visualAssets.structuralDiagrams.map((diag, idx) => (
                        <Card key={idx}>
                          <CardHeader className="p-2">
                             <Image
                              src={diag.url}
                              alt={diag.description}
                              width={300}
                              height={200}
                              className="w-full h-auto rounded-md object-contain border bg-white"
                              data-ai-hint="structural diagram analysis"
                            />
                          </CardHeader>
                          <CardContent className="p-3 pt-0">
                            <p className="font-medium">{diag.type}</p>
                            <p className="text-sm text-muted-foreground">{diag.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              ) : <p>暂无视觉资料。</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="semantic">
          <Card>
            <CardHeader>
              <CardTitle>语义标签与IFC分类</CardTitle>
            </CardHeader>
            <CardContent>
              {semanticTags ? (
                <div className="space-y-4">
                  <DetailRow label="IFC分类" value={semanticTags.ifcClassification} />
                  <DetailRow label="语义结构" value={semanticTags.semanticStructure} />
                  <div>
                    <h4 className="font-semibold text-muted-foreground mb-1">AI生成标签:</h4>
                    <TagList tags={semanticTags.aiTags} />
                  </div>
                </div>
              ) : <p>暂无语义标签信息。</p>}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="access">
          <Card>
            <CardHeader>
              <CardTitle>数据访问与引用</CardTitle>
            </CardHeader>
            <CardContent>
              {accessPolicies ? (
                <Table>
                  <TableBody>
                    <DetailRow label="数据开放状态" value={accessPolicies.dataOpenStatus} />
                    <DetailRow label="推荐引用格式" value={<pre className="whitespace-pre-wrap text-sm bg-muted p-2 rounded-md">{accessPolicies.citationFormat}</pre>} />
                    <DetailRow label="上传者/策展人" value={accessPolicies.uploaderInfo} />
                  </TableBody>
                </Table>
              ) : <p>暂无访问政策信息。</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


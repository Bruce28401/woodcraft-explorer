
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
    return { title: 'Component Not Found' };
  }
  return {
    title: `${component.name} | WoodCraft Explorer`,
    description: `Details for ${component.name}, a traditional Chinese architectural component from the ${component.dynasty}.`,
  };
}

// Helper to render detail rows
const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <TableRow>
    <TableCell className="font-semibold text-muted-foreground w-1/3">{label}</TableCell>
    <TableCell>{value || 'N/A'}</TableCell>
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
              alt={`Image of ${component.name}`}
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
                  <DetailRow label="Style" value={component.style} />
                  <DetailRow label="Material" value={component.material} />
                  <DetailRow label="Function" value={component.function} />
                  <DetailRow label="Source/Region" value={component.source} />
                </TableBody>
              </Table>
            </CardContent>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-6">
          <TabsTrigger value="details"><SquareKanban className="mr-2 h-4 w-4" />Geometry</TabsTrigger>
          <TabsTrigger value="model"><Landmark className="mr-2 h-4 w-4" />3D Model</TabsTrigger>
          <TabsTrigger value="visuals"><ImageIcon className="mr-2 h-4 w-4" />Visuals</TabsTrigger>
          <TabsTrigger value="semantic"><Tags className="mr-2 h-4 w-4" />Semantics</TabsTrigger>
          <TabsTrigger value="access"><Info className="mr-2 h-4 w-4" />Access</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Geometric & Structural Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              {geometryParams ? (
                <Table>
                  <TableBody>
                    <DetailRow label="Dimensions" value={geometryParams.dimensions} />
                    <DetailRow label="Structural Description" value={geometryParams.structureDescription} />
                    <DetailRow label="Tenon Type (榫卯类型)" value={geometryParams.tenonType} />
                    {geometryParams.explodedViewUrl && (
                       <TableRow>
                        <TableCell className="font-semibold text-muted-foreground">Exploded View</TableCell>
                        <TableCell>
                           <Image
                            src={geometryParams.explodedViewUrl}
                            alt="Exploded view diagram"
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
              ) : <p>No geometric parameters available.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="model">
          <Card>
            <CardHeader>
              <CardTitle>3D Model Viewer</CardTitle>
            </CardHeader>
            <CardContent>
              {digitalModels && digitalModels.modelUrl ? (
                <>
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden border mb-4">
                    <ModelViewer modelUrl={digitalModels.modelUrl} />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                      <p><strong>Modeling Method:</strong> {digitalModels.modelingMethod}</p>
                      <p><strong>Copyright:</strong> {digitalModels.copyrightInfo}</p>
                    </div>
                    <Button asChild variant="default" size="lg">
                      <a href={digitalModels.modelUrl} download>
                        <Download className="mr-2 h-5 w-5" /> Download Model
                      </a>
                    </Button>
                  </div>
                </>
              ) : <p>No 3D model available.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visuals">
          <Card>
            <CardHeader>
              <CardTitle>Visual Assets: Images & Drawings</CardTitle>
            </CardHeader>
            <CardContent>
              {visualAssets ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Images</h3>
                    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                      <div className="flex space-x-4 p-4">
                        {visualAssets.images.map((img, idx) => (
                          <Image
                            key={idx}
                            src={img}
                            alt={`${component.name} - Image ${idx + 1}`}
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
                    <h3 className="text-xl font-semibold mb-2">Drawings</h3>
                     <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                      <div className="flex space-x-4 p-4">
                        {visualAssets.drawings.map((drawing, idx) => (
                          <Image
                            key={idx}
                            src={drawing}
                            alt={`${component.name} - Drawing ${idx + 1}`}
                            width={250}
                            height={180}
                            className="h-48 w-auto rounded-md object-cover border bg-white" // bg-white for drawings
                            data-ai-hint="architectural drawing blueprint"
                          />
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Structural Diagrams</h3>
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
              ) : <p>No visual assets available.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="semantic">
          <Card>
            <CardHeader>
              <CardTitle>Semantic Tags & IFC Classification</CardTitle>
            </CardHeader>
            <CardContent>
              {semanticTags ? (
                <div className="space-y-4">
                  <DetailRow label="IFC Classification" value={semanticTags.ifcClassification} />
                  <DetailRow label="Semantic Structure" value={semanticTags.semanticStructure} />
                  <div>
                    <h4 className="font-semibold text-muted-foreground mb-1">AI Generated Tags:</h4>
                    <TagList tags={semanticTags.aiTags} />
                  </div>
                </div>
              ) : <p>No semantic tags available.</p>}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="access">
          <Card>
            <CardHeader>
              <CardTitle>Data Access & Citation</CardTitle>
            </CardHeader>
            <CardContent>
              {accessPolicies ? (
                <Table>
                  <TableBody>
                    <DetailRow label="Data Open Status" value={accessPolicies.dataOpenStatus} />
                    <DetailRow label="Recommended Citation" value={<pre className="whitespace-pre-wrap text-sm bg-muted p-2 rounded-md">{accessPolicies.citationFormat}</pre>} />
                    <DetailRow label="Uploader/Curator" value={accessPolicies.uploaderInfo} />
                  </TableBody>
                </Table>
              ) : <p>No access policy information available.</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


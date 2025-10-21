import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Play, CheckCircle2, Circle, Clock, User, Loader, Globe, Youtube, FileText, Music, BookOpen, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { ContentDisplay } from "@/components/ContentDisplay";

interface Material {
  id: string;
  type: "video" | "audio" | "pdf" | "powerpoint" | "iframe" | "webpage";
  name: string;
  url?: string;
  iframeCode?: string;
  uploadedAt: string;
}

export default function Course() {
  const { data: modules = [], isLoading } = trpc.modules.list.useQuery();
  const [currentModuleId, setCurrentModuleId] = useState(1);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  const currentModule = modules.find(m => m.id === currentModuleId);
  const totalDuration = modules.reduce((acc, m) => {
    const minutes = parseInt(m.duration);
    return acc + minutes;
  }, 0);
  const completedMinutes = completedModules.reduce((acc, id) => {
    const module = modules.find(m => m.id === id);
    return acc + (module ? parseInt(module.duration) : 0);
  }, 0);
  const progressPercentage = totalDuration > 0 ? Math.round((completedMinutes / totalDuration) * 100) : 0;

  useEffect(() => {
    if (modules.length > 0 && !currentModule) {
      setCurrentModuleId(modules[0].id);
    }
    // Set first material as selected by default
    if (currentModule && currentModule.files && currentModule.files.length > 0 && !selectedMaterial) {
      setSelectedMaterial(currentModule.files[0]);
    }
  }, [modules, currentModule, selectedMaterial]);

  const toggleModuleCompletion = (moduleId: number) => {
    setCompletedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleNextModule = () => {
    if (currentModuleId < modules.length) {
      setCurrentModuleId(currentModuleId + 1);
      setSelectedMaterial(null);
    }
  };

  const getMaterialIcon = (type: string) => {
    switch(type) {
      case "webpage": return <Globe className="w-5 h-5" />;
      case "video": return <Youtube className="w-5 h-5" />;
      case "pdf": return <FileText className="w-5 h-5" />;
      case "audio": return <Music className="w-5 h-5" />;
      case "powerpoint": return <FileText className="w-5 h-5" />;
      case "iframe": return <BookOpen className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getMaterialTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      webpage: "Página Web",
      video: "Vídeo",
      pdf: "PDF",
      audio: "Áudio",
      powerpoint: "PowerPoint",
      iframe: "Conteúdo Embutido"
    };
    return labels[type] || type;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 text-purple-500 animate-spin" />
          <p className="text-slate-300">Carregando módulos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <ChevronRight className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">Eduqly Academy</span>
            </a>
          </div>
          <a href="/">
            <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
              Voltar
            </Button>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-6">
            {currentModule && (
              <>
                {/* Module Title */}
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-white">{currentModule.title}</h1>
                  <div className="flex items-center gap-4 text-slate-400">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{currentModule.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{currentModule.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Content Display Area */}
                <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                  <CardContent className="p-0">
                    <ContentDisplay material={selectedMaterial} />
                  </CardContent>
                </Card>

                {/* Description */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Sobre esta aula</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 leading-relaxed">{currentModule.description}</p>
                  </CardContent>
                </Card>

                {/* Materials Section */}
                {currentModule.files && currentModule.files.length > 0 && (
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Materiais e Recursos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {currentModule.files.map((material: Material) => (
                        <div
                          key={material.id}
                          onClick={() => setSelectedMaterial(material)}
                          className={`flex items-center justify-between p-4 rounded-lg border transition group cursor-pointer ${
                            selectedMaterial?.id === material.id
                              ? "bg-purple-600/20 border-purple-500"
                              : "bg-slate-900/50 border-slate-700 hover:border-purple-500"
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="text-purple-400 bg-slate-800 p-2 rounded">
                              {getMaterialIcon(material.type)}
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium">{material.name}</p>
                              <p className="text-slate-500 text-sm">{getMaterialTypeLabel(material.type)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded text-sm transition opacity-0 group-hover:opacity-100 flex items-center gap-2">
                              <Play className="w-4 h-4" />
                              Visualizar
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => toggleModuleCompletion(currentModule.id)}
                    className={completedModules.includes(currentModule.id) ? "bg-green-600 hover:bg-green-700 flex-1" : "bg-purple-600 hover:bg-purple-700 flex-1"}
                  >
                    {completedModules.includes(currentModule.id) ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Concluído
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4 mr-2" />
                        Marcar como Concluído
                      </>
                    )}
                  </Button>
                  {currentModuleId < modules.length && (
                    <Button
                      onClick={handleNextModule}
                      className="bg-slate-700 hover:bg-slate-600 flex-1"
                    >
                      Próximo Módulo
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Progress Card (moved and resized) */}
            <Card className="bg-slate-800/50 border-slate-700 mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center justify-between text-lg">
                  <span>Seu Progresso</span>
                  <span className="text-xl font-bold text-purple-400">{progressPercentage}%</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2 pb-4">
                <Progress value={progressPercentage} className="h-1.5" />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>{completedMinutes} de {totalDuration} minutos concluídos</span>
                </div>
              </CardContent>
            </Card>

            {/* Modules List (moved up) */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Módulos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {modules.map((module: any) => (
                  <button
                    key={module.id}
                    onClick={() => {
                      setCurrentModuleId(module.id);
                      setSelectedMaterial(null);
                    }}
                    className={`w-full text-left p-3 rounded border transition ${
                      currentModuleId === module.id
                        ? "bg-purple-600/20 border-purple-500"
                        : "bg-slate-900/50 border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {completedModules.includes(module.id) ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">Módulo {module.id}</p>
                        <p className="text-xs text-slate-400 line-clamp-2">{module.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{module.duration}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Support Section */}
            <Card className="bg-slate-800/50 border-slate-700 mt-6">
              <CardHeader>
                <CardTitle className="text-white text-base">Precisa de ajuda?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contato
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


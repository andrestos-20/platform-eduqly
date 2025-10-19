import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Play, CheckCircle2, Circle, Clock, User, Volume2, Download, Share2, MessageCircle, Loader, Globe, Youtube, FileText, Music, ExternalLink } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function Course() {
  const { data: modules = [], isLoading } = trpc.modules.list.useQuery();
  const [currentModuleId, setCurrentModuleId] = useState(1);
  const [completedModules, setCompletedModules] = useState<number[]>([]);

  const currentModule = modules.find(m => m.id === currentModuleId);
  const totalDuration = modules.reduce((acc, m) => {
    const minutes = parseInt(m.duration);
    return acc + minutes;
  }, 0);
  const completedMinutes = completedModules.reduce((acc, id) => {
    const module = modules.find(m => m.id === id);
    return acc + (module ? parseInt(module.duration) : 0);
  }, 0);
  const progressPercentage = Math.round((completedMinutes / totalDuration) * 100);

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
    }
  };

  const getMaterialIcon = (type: string) => {
    switch(type) {
      case "webpage": return <Globe className="w-5 h-5" />;
      case "youtube": return <Youtube className="w-5 h-5" />;
      case "file": return <FileText className="w-5 h-5" />;
      case "audio": return <Music className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getMaterialTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      webpage: "Página Web",
      youtube: "Vídeo YouTube",
      file: "Arquivo",
      audio: "Áudio"
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
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <ChevronRight className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">PowerBI Academy</span>
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
                  <h1 className="text-4xl font-bold text-white">{currentModule.title}</h1>
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

                {/* Progress */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>Seu Progresso</span>
                      <span className="text-2xl font-bold text-purple-400">{progressPercentage}%</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Progress value={progressPercentage} className="h-2" />
                    <div className="flex justify-between text-sm text-slate-400">
                      <span>{completedMinutes} de {totalDuration} minutos concluídos</span>
                    </div>
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
                      {currentModule.files.map((material: any) => (
                        <div
                          key={material.id}
                          className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-purple-500 transition group"
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
                          {material.url && (
                            <a
                              href={material.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded text-sm transition opacity-0 group-hover:opacity-100"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Acessar
                            </a>
                          )}
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
            {/* Course Info Card */}
            <Card className="bg-slate-800/50 border-slate-700 mb-6">
              <CardHeader>
                <CardTitle className="text-white">Informações do Curso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-slate-500 text-sm">Duração Total</p>
                  <p className="text-white font-semibold">{totalDuration} minutos</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Módulos</p>
                  <p className="text-white font-semibold">{modules.length} módulos</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Progresso</p>
                  <p className="text-white font-semibold">{progressPercentage}%</p>
                </div>
              </CardContent>
            </Card>

            {/* Modules List */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Módulos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {modules.map((module: any) => (
                  <button
                    key={module.id}
                    onClick={() => setCurrentModuleId(module.id)}
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

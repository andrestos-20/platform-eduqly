import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, Play, CheckCircle2, Circle, Clock, User, Volume2, Download, Share2, MessageCircle, Loader } from "lucide-react";
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
                <ChevronLeft className="w-5 h-5 text-white" />
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
        <div className="grid md:grid-cols-3 gap-4">
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-4">
            {currentModule && (
              <>
                {/* Module Title */}
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-white">{currentModule.title}</h1>
                  <div className="flex items-center gap-3 text-slate-400 text-sm">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span className="text-xs">{currentModule.instructor}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">{currentModule.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Module Content */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Conteúdo do Módulo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Video/Audio Player */}
                    <div className="bg-slate-900 rounded-lg p-4 flex items-center justify-center min-h-96">
                      <div className="text-center space-y-4">
                        <Play className="w-16 h-16 text-purple-500 mx-auto" />
                        <p className="text-slate-400">Player de mídia</p>
                        <p className="text-sm text-slate-500">Formato: {currentModule.format}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-white">Sobre esta aula</h3>
                      <p className="text-xs text-slate-400">{currentModule.description}</p>
                    </div>

                    {/* Files */}
                    {currentModule.files && currentModule.files.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-white">Recursos</h3>
                        {currentModule.files.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-700">
                            <div className="flex items-center gap-3">
                              <Download className="w-4 h-4 text-purple-400" />
                              <div>
                                <p className="text-white text-sm">{file.name}</p>
                                <p className="text-slate-500 text-xs">{file.type}</p>
                              </div>
                            </div>
                            <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300">
                              Baixar
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={() => toggleModuleCompletion(currentModule.id)}
                        className={completedModules.includes(currentModule.id) ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"}
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
                      <Button onClick={handleNextModule} variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
                        Próximo Módulo
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Progress - Reduzido */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">Progresso</span>
                      <span className="text-sm font-bold text-purple-400">{progressPercentage}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-1" />
                    <p className="text-slate-400 text-xs">{completedMinutes} de {totalDuration} min</p>
                  </CardContent>
                </Card>

                {/* Contact Section */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Dúvidas?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-300">Entre em contato conosco para suporte.</p>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Enviar Mensagem
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Sidebar - Module List */}
          <div className="space-y-4 order-first md:order-last">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Módulos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {modules.map((module) => (
                  <button
                    key={module.id}
                    onClick={() => setCurrentModuleId(module.id)}
                    className={`w-full text-left p-3 rounded border transition ${
                      currentModuleId === module.id
                        ? "bg-purple-600/20 border-purple-500"
                        : "bg-slate-900/50 border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {completedModules.includes(module.id) ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">Módulo {module.id}</p>
                        <p className="text-xs text-slate-400 line-clamp-2">{module.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{module.files?.length || 0} arquivo(s)</p>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Course Info */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Sobre o Curso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-400">Carga horária</p>
                  <p className="text-white font-semibold">{totalDuration} minutos</p>
                </div>
                <div>
                  <p className="text-slate-400">Modalidade</p>
                  <p className="text-white font-semibold">Online</p>
                </div>
                <div>
                  <p className="text-slate-400">Tecnologia</p>
                  <p className="text-white font-semibold">Power BI</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Play, CheckCircle2, Circle, Clock, User, Volume2, Download, Share2, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useModules } from "@/contexts/ModulesContext";

export default function Course() {
  const { modules } = useModules();
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
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm">Módulo {currentModuleId} de {modules.length}</span>
            <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
              Sair
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Module Content */}
          <div className="lg:col-span-2 space-y-6">
            {currentModule && (
              <>
                {/* Module Header */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-purple-400 font-semibold text-sm">Módulo {currentModule.id}</p>
                    <h1 className="text-4xl font-bold text-white">{currentModule.title}</h1>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-slate-400">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{currentModule.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{currentModule.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-slate-800 px-3 py-1 rounded-full">
                        {currentModule.format}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Module Image */}
                <div className="relative overflow-hidden rounded-xl aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                  <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center">
                    <Play className="w-16 h-16 text-slate-400" />
                  </div>
                </div>

                {/* Audio Player */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-purple-400" />
                      Áudio da Aula
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <button className="w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition">
                          <Play className="w-5 h-5 text-white fill-white" />
                        </button>
                        <div className="flex-1">
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full w-0 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                          </div>
                        </div>
                        <span className="text-sm text-slate-400">0:00 / 0:00</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition">
                          <Download className="w-4 h-4 text-slate-400" />
                        </button>
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition">
                          <Share2 className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Module Description */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Sobre esta aula</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 leading-relaxed">{currentModule.description}</p>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className={`flex-1 ${
                      completedModules.includes(currentModuleId)
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    } text-white`}
                    onClick={() => toggleModuleCompletion(currentModuleId)}
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    {completedModules.includes(currentModuleId)
                      ? "Marcar como Incompleto"
                      : "Marcar como Concluído"}
                  </Button>
                  {currentModuleId < modules.length && (
                    <Button
                      size="lg"
                      variant="outline"
                      className="flex-1 border-slate-600 text-white hover:bg-slate-800"
                      onClick={handleNextModule}
                    >
                      Próximo Módulo
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  )}
                </div>

                {/* Contact Section */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-purple-400" />
                      Dúvidas?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 mb-4">
                      Tem alguma dúvida sobre este módulo? Entre em contato conosco!
                    </p>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      Fale Conosco
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Right Panel - Course Content */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Progress Card */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Seu Progresso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 text-sm font-medium">Conclusão</span>
                      <span className="text-purple-400 font-bold">{progressPercentage}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                  <div className="text-sm text-slate-400">
                    <p>{completedModules.length} de {modules.length} módulos concluídos</p>
                    <p>{completedMinutes} de {totalDuration} minutos assistidos</p>
                  </div>
                </CardContent>
              </Card>

              {/* Modules List */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Conteúdo do Curso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {modules.map((module) => (
                    <button
                      key={module.id}
                      onClick={() => setCurrentModuleId(module.id)}
                      className={`w-full text-left p-4 rounded-lg transition border-2 ${
                        currentModuleId === module.id
                          ? "bg-slate-700/50 border-purple-500"
                          : "bg-slate-700/20 border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {completedModules.includes(module.id) ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {module.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">{module.duration}</p>
                        </div>
                        {currentModuleId === module.id && (
                          <ChevronRight className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Course Info */}
              <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Informações do Curso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="text-slate-400">Duração Total</p>
                    <p className="text-white font-semibold">{totalDuration} minutos</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Certificado</p>
                    <p className="text-white font-semibold">Simbólico (70% acertos)</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Plataforma</p>
                    <p className="text-white font-semibold">Google Classroom</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


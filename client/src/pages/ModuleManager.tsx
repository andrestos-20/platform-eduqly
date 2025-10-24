import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Trash2, Eye, Plus, Loader, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

export default function ModuleManager() {
  const { data: modules = [], isLoading, refetch } = trpc.modules.list.useQuery();
  const updateModuleMutation = trpc.modules.update.useMutation();
  const [selectedModuleId, setSelectedModuleId] = useState(modules[0]?.id || 1);
  const [isEditing, setIsEditing] = useState(false);
  const [previewFile, setPreviewFile] = useState<any>(null);
  
  // Estado local para edição
  const [editData, setEditData] = useState({
    title: "",
    instructor: "",
    duration: "",
    format: "",
    description: "",
  });

  const selectedModule = modules.find(m => m.id === selectedModuleId);

  // Atualizar editData quando o módulo selecionado muda
  useEffect(() => {
    if (selectedModule) {
      setEditData({
        title: selectedModule.title || "",
        instructor: selectedModule.instructor || "",
        duration: selectedModule.duration || "",
        format: selectedModule.format || "",
        description: selectedModule.description || "",
      });
    }
  }, [selectedModule]);

  const handleSaveModule = async () => {
    if (!selectedModule) return;
    
    try {
      await updateModuleMutation.mutateAsync({
        id: selectedModule.id,
        title: editData.title,
        instructor: editData.instructor,
        duration: editData.duration,
        format: editData.format,
        description: editData.description,
      });
      
      // Refetch para atualizar os dados
      await refetch();
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar módulo:", error);
      alert("Erro ao salvar módulo. Tente novamente.");
    }
  };

  const handleCancelEdit = () => {
    // Restaurar dados originais
    if (selectedModule) {
      setEditData({
        title: selectedModule.title,
        instructor: selectedModule.instructor,
        duration: selectedModule.duration,
        format: selectedModule.format,
        description: selectedModule.description,
      });
    }
    setIsEditing(false);
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!selectedModule) return;
    
    const updatedFiles = selectedModule.files.filter(f => f.id !== fileId);
    try {
      await updateModuleMutation.mutateAsync({
        id: selectedModule.id,
        files: updatedFiles,
      });
      await refetch();
    } catch (error) {
      console.error("Erro ao deletar arquivo:", error);
    }
  };

  const handleAddFile = async (type: string) => {
    if (!selectedModule) return;
    
    const newFile = {
      id: `file-${Date.now()}`,
      type: type as any,
      name: `Novo ${type}`,
      url: "",
      uploadedAt: new Date().toISOString(),
    };
    
    const updatedFiles = [...selectedModule.files, newFile];
    try {
      await updateModuleMutation.mutateAsync({
        id: selectedModule.id,
        files: updatedFiles,
      });
      await refetch();
    } catch (error) {
      console.error("Erro ao adicionar arquivo:", error);
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
      {/* Header */}
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
          <div className="flex gap-2">
            <a href="/admin/alunos">
              <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
                👥 Alunos
              </Button>
            </a>
            <a href="/">
              <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
                Voltar
              </Button>
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Module List */}
          <div className="md:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Módulos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {modules.map((module) => (
                  <button
                    key={module.id}
                    onClick={() => {
                      setSelectedModuleId(module.id);
                      setIsEditing(false);
                    }}
                    className={`w-full text-left p-3 rounded border transition ${
                      selectedModuleId === module.id
                        ? "bg-purple-600/20 border-purple-500"
                        : "bg-slate-900/50 border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <p className="text-sm font-semibold text-white">Módulo {module.id}</p>
                    <p className="text-xs text-slate-400 line-clamp-2">{module.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{module.files.length} arquivo(s)</p>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Module Details */}
          <div className="md:col-span-3 space-y-6">
            {selectedModule && (
              <>
                {/* Module Header */}
                <div className="flex items-center justify-between gap-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    Módulo {selectedModule.id}: {editData.title || selectedModule.title}
                  </h1>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          onClick={handleSaveModule}
                          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Salvar
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outline"
                          className="border-slate-600 text-white hover:bg-slate-800 flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        ✏️ Editar Módulo
                      </Button>
                    )}
                  </div>
                </div>

                {/* Module Info */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Informações do Módulo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Título</label>
                      <Input
                        disabled={!isEditing}
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        className="bg-slate-900 border-slate-700 text-white disabled:opacity-50"
                        placeholder="Digite o título do módulo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Instrutor(a)</label>
                      <Input
                        disabled={!isEditing}
                        value={editData.instructor}
                        onChange={(e) => setEditData({ ...editData, instructor: e.target.value })}
                        className="bg-slate-900 border-slate-700 text-white disabled:opacity-50"
                        placeholder="Digite o nome do instrutor"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Duração</label>
                        <Input
                          disabled={!isEditing}
                          value={editData.duration}
                          onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
                          className="bg-slate-900 border-slate-700 text-white disabled:opacity-50"
                          placeholder="Ex: 5 min"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Formato</label>
                        <Input
                          disabled={!isEditing}
                          value={editData.format}
                          onChange={(e) => setEditData({ ...editData, format: e.target.value })}
                          className="bg-slate-900 border-slate-700 text-white disabled:opacity-50"
                          placeholder="Ex: Vídeo introdutório"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Descrição "Sobre esta aula"</label>
                      <Textarea
                        disabled={!isEditing}
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        className="bg-slate-900 border-slate-700 text-white min-h-24 disabled:opacity-50"
                        placeholder="Digite a descrição da aula"
                      />
                    </div>
                    {isEditing && (
                      <p className="text-xs text-slate-400 mt-4">
                        💡 Todos os campos acima são editáveis. Clique em "Salvar" para confirmar as alterações.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Files Section */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Arquivos e Recursos ({selectedModule.files.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* File List */}
                    {selectedModule.files.length > 0 && (
                      <div className="space-y-2">
                        {selectedModule.files.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-700">
                            <div>
                              <p className="text-white text-sm font-medium">{file.name}</p>
                              <p className="text-slate-500 text-xs">{file.type}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setPreviewFile(file)}
                                className="text-blue-400 hover:text-blue-300"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {isEditing && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteFile(file.id)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Files */}
                    {isEditing && (
                      <div className="space-y-2 pt-4 border-t border-slate-700">
                        <p className="text-sm text-slate-300 font-medium">Adicionar Arquivo</p>
                        <div className="grid grid-cols-2 gap-2">
                          {["video", "audio", "pdf", "powerpoint", "iframe"].map((type) => (
                            <Button
                              key={type}
                              size="sm"
                              variant="outline"
                              onClick={() => handleAddFile(type)}
                              className="border-slate-600 text-slate-300 hover:bg-slate-800"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-slate-800 border-slate-700 max-w-2xl w-full">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-white">{previewFile.name}</CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setPreviewFile(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 rounded p-8 text-center text-slate-400">
                <p>Preview de {previewFile.type}</p>
                {previewFile.url && <p className="text-sm mt-2">{previewFile.url}</p>}
                {previewFile.iframeCode && (
                  <div className="mt-4 text-left bg-slate-800 p-4 rounded text-xs font-mono overflow-auto max-h-48">
                    {previewFile.iframeCode}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


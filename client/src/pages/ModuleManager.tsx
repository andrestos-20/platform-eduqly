import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Trash2, Eye, Plus, Loader, X, Globe, Youtube, FileText, Music } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function ModuleManager() {
  const { data: modules = [], isLoading } = trpc.modules.list.useQuery();
  const updateModuleMutation = trpc.modules.update.useMutation();
  const [selectedModuleId, setSelectedModuleId] = useState(modules[0]?.id || 1);
  const [isEditing, setIsEditing] = useState(false);
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [newMaterialType, setNewMaterialType] = useState("");
  const [newMaterialData, setNewMaterialData] = useState({ name: "", url: "", file: null as File | null });

  const selectedModule = modules.find(m => m.id === selectedModuleId);

  const handleSaveModule = async (updates: any) => {
    if (!selectedModule) return;
    
    try {
      await updateModuleMutation.mutateAsync({
        id: selectedModule.id,
        ...updates,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar módulo:", error);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!selectedModule) return;
    
    const updatedFiles = selectedModule.files.filter(f => f.id !== fileId);
    await handleSaveModule({ files: updatedFiles });
  };

  const handleAddMaterial = async () => {
    if (!selectedModule || !newMaterialType || !newMaterialData.name) return;
    
    const newMaterial = {
      id: `material-${Date.now()}`,
      type: newMaterialType,
      name: newMaterialData.name,
      url: newMaterialData.url || null,
      uploadedAt: new Date().toISOString(),
    };
    
    const updatedFiles = [...selectedModule.files, newMaterial];
    await handleSaveModule({ files: updatedFiles });
    
    setNewMaterialType("");
    setNewMaterialData({ name: "", url: "", file: null });
    setShowAddMaterial(false);
  };

  const getMaterialIcon = (type: string) => {
    switch(type) {
      case "webpage": return <Globe className="w-4 h-4" />;
      case "youtube": return <Youtube className="w-4 h-4" />;
      case "file": return <FileText className="w-4 h-4" />;
      case "audio": return <Music className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
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
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <ChevronLeft className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">PowerBI Academy</span>
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
                    <p className="text-xs text-slate-500 mt-1">{module.files.length} material(is)</p>
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
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-white">Módulo {selectedModule.id}: {selectedModule.title}</h1>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    className={isEditing ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"}
                  >
                    {isEditing ? "Salvar Alterações" : "Editar Módulo"}
                  </Button>
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
                        defaultValue={selectedModule.title}
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Instrutor(a)</label>
                      <Input
                        disabled={!isEditing}
                        defaultValue={selectedModule.instructor}
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Duração</label>
                        <Input
                          disabled={!isEditing}
                          defaultValue={selectedModule.duration}
                          className="bg-slate-900 border-slate-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Formato</label>
                        <Input
                          disabled={!isEditing}
                          defaultValue={selectedModule.format}
                          className="bg-slate-900 border-slate-700 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Descrição "Sobre esta aula"</label>
                      <Textarea
                        disabled={!isEditing}
                        defaultValue={selectedModule.description}
                        className="bg-slate-900 border-slate-700 text-white min-h-24"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Materials Section */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Materiais e Recursos ({selectedModule.files.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Material List */}
                    {selectedModule.files.length > 0 && (
                      <div className="space-y-2">
                        {selectedModule.files.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-700 hover:border-slate-600 transition">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="text-purple-400">
                                {getMaterialIcon(file.type)}
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">{file.name}</p>
                                <p className="text-slate-500 text-xs">{getMaterialTypeLabel(file.type)}</p>
                                {file.url && <p className="text-slate-600 text-xs truncate">{file.url}</p>}
                              </div>
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

                    {/* Add Material Section */}
                    {isEditing && (
                      <div className="pt-4 border-t border-slate-700">
                        {!showAddMaterial ? (
                          <Button
                            onClick={() => setShowAddMaterial(true)}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Material
                          </Button>
                        ) : (
                          <div className="space-y-4 p-4 bg-slate-900 rounded border border-slate-700">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-white font-semibold">Novo Material</h3>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowAddMaterial(false)}
                                className="text-slate-400 hover:text-white"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Material Type Selection */}
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">Tipo de Material</label>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  { id: "webpage", label: "Página Web", icon: Globe },
                                  { id: "youtube", label: "Vídeo YouTube", icon: Youtube },
                                  { id: "file", label: "Arquivo", icon: FileText },
                                  { id: "audio", label: "Áudio", icon: Music }
                                ].map((type) => (
                                  <button
                                    key={type.id}
                                    onClick={() => setNewMaterialType(type.id)}
                                    className={`p-3 rounded border transition flex items-center gap-2 ${
                                      newMaterialType === type.id
                                        ? "bg-purple-600/20 border-purple-500 text-purple-300"
                                        : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600"
                                    }`}
                                  >
                                    <type.icon className="w-4 h-4" />
                                    <span className="text-sm">{type.label}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Material Details */}
                            {newMaterialType && (
                              <>
                                <div>
                                  <label className="block text-sm font-medium text-slate-300 mb-2">Nome do Material</label>
                                  <Input
                                    placeholder="Ex: Introdução ao Power BI"
                                    value={newMaterialData.name}
                                    onChange={(e) => setNewMaterialData({ ...newMaterialData, name: e.target.value })}
                                    className="bg-slate-800 border-slate-700 text-white"
                                  />
                                </div>

                                {(newMaterialType === "webpage" || newMaterialType === "youtube") && (
                                  <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                      {newMaterialType === "youtube" ? "URL do Vídeo YouTube" : "URL da Página"}
                                    </label>
                                    <Input
                                      placeholder={newMaterialType === "youtube" ? "https://youtube.com/watch?v=..." : "https://..."}
                                      value={newMaterialData.url}
                                      onChange={(e) => setNewMaterialData({ ...newMaterialData, url: e.target.value })}
                                      className="bg-slate-800 border-slate-700 text-white"
                                    />
                                  </div>
                                )}

                                {(newMaterialType === "file" || newMaterialType === "audio") && (
                                  <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                      {newMaterialType === "audio" ? "Arquivo de Áudio" : "Arquivo"}
                                    </label>
                                    <Input
                                      type="file"
                                      onChange={(e) => setNewMaterialData({ ...newMaterialData, file: e.target.files?.[0] || null })}
                                      className="bg-slate-800 border-slate-700 text-white"
                                    />
                                  </div>
                                )}

                                <div className="flex gap-2 pt-2">
                                  <Button
                                    onClick={handleAddMaterial}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                  >
                                    Adicionar
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setShowAddMaterial(false);
                                      setNewMaterialType("");
                                      setNewMaterialData({ name: "", url: "", file: null });
                                    }}
                                    variant="outline"
                                    className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
                                  >
                                    Cancelar
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
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
                <div className="flex justify-center mb-4">
                  {getMaterialIcon(previewFile.type)}
                </div>
                <p className="font-semibold text-white mb-2">{getMaterialTypeLabel(previewFile.type)}</p>
                <p>{previewFile.name}</p>
                {previewFile.url && (
                  <div className="mt-4">
                    <p className="text-sm text-slate-300 mb-2">URL:</p>
                    <p className="text-xs break-all bg-slate-800 p-2 rounded">{previewFile.url}</p>
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

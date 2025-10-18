import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronRight,
  Upload,
  Trash2,
  Plus,
  FileText,
  Music,
  Video,
  FileJson,
  Eye,
  X,
  Save,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { useModules, ModuleFile } from "@/contexts/ModulesContext";

export default function ModuleManager() {
  const { modules, updateModule } = useModules();
  const [selectedModuleId, setSelectedModuleId] = useState(1);

  const [editingModule, setEditingModule] = useState<any>(null);
  const [uploadingFileType, setUploadingFileType] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<ModuleFile | null>(null);

interface Module {
  id: number;
  title: string;
  instructor: string;
  duration: string;
  format: string;
  description: string;
  files: ModuleFile[];
}

  const currentModule = modules.find((m) => m.id === selectedModuleId);

  const handleModuleChange = (field: string, value: string) => {
    if (editingModule) {
      setEditingModule({ ...editingModule, [field]: value });
    }
  };

  const handleSaveModule = () => {
    if (editingModule) {
      updateModule(editingModule);
      setEditingModule(null);
    }
  };

  const handleDeleteFile = (fileId: string) => {
    if (editingModule) {
      const updatedModule = {
        ...editingModule,
        files: editingModule.files.filter((f: any) => f.id !== fileId),
      };
      setEditingModule(updatedModule);
    }
  };

  const handleAddFile = (fileType: "video" | "audio" | "pdf" | "powerpoint" | "iframe") => {
    if (editingModule) {
      const newFile: any = {
        id: `${editingModule.id}-${Date.now()}`,
        type: fileType,
        name: `novo_${fileType}.${getFileExtension(fileType)}`,
        url: fileType === "iframe" ? undefined : "#",
        iframeCode: fileType === "iframe" ? "<iframe></iframe>" : undefined,
        uploadedAt: new Date().toISOString().split("T")[0],
      };
      setEditingModule({
        ...editingModule,
        files: [...editingModule.files, newFile],
      });
    }
  };

  const getFileExtension = (type: string): string => {
    switch (type) {
      case "video":
        return "mp4";
      case "audio":
        return "mp3";
      case "pdf":
        return "pdf";
      case "powerpoint":
        return "pptx";
      default:
        return "file";
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "audio":
        return <Music className="w-4 h-4" />;
      case "pdf":
        return <FileText className="w-4 h-4" />;
      case "powerpoint":
        return <FileText className="w-4 h-4" />;
      case "iframe":
        return <FileJson className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getFileTypeLabel = (type: string): string => {
    switch (type) {
      case "video":
        return "Vídeo";
      case "audio":
        return "Áudio";
      case "pdf":
        return "PDF";
      case "powerpoint":
        return "PowerPoint";
      case "iframe":
        return "iFrame";
      default:
        return type;
    }
  };

  if (!currentModule) {
    return <div className="text-white">Módulo não encontrado</div>;
  }

  const displayModule = editingModule || currentModule;

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
            <span className="text-slate-400 text-sm">Gerenciador de Módulos</span>
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
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Panel - Modules List */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700 sticky top-24">
              <CardHeader>
                <CardTitle className="text-white">Módulos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {modules.map((module) => (
                  <button
                    key={module.id}
                    onClick={() => {
                      setSelectedModuleId(module.id);
                      setEditingModule(null);
                      setPreviewFile(null);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition border-2 ${
                      selectedModuleId === module.id
                        ? "bg-slate-700/50 border-purple-500"
                        : "bg-slate-700/20 border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <p className="text-sm font-medium text-white truncate">
                      Módulo {module.id}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {module.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {module.files.length} arquivo(s)
                    </p>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Module Editor */}
          <div className="lg:col-span-3 space-y-6">
            {/* Module Header */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">
                    Módulo {displayModule.id}: {displayModule.title}
                  </CardTitle>
                  {editingModule ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-white hover:bg-slate-800"
                        onClick={() => setEditingModule(null)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        onClick={handleSaveModule}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Alterações
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      onClick={() => setEditingModule(JSON.parse(JSON.stringify(currentModule)))}
                    >
                      Editar Módulo
                    </Button>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Module Details */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Informações do Módulo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Título</label>
                    <Input
                      value={displayModule.title}
                      onChange={(e) => handleModuleChange("title", e.target.value)}
                      disabled={!editingModule}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Instrutor(a)</label>
                    <Input
                      value={displayModule.instructor}
                      onChange={(e) => handleModuleChange("instructor", e.target.value)}
                      disabled={!editingModule}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Duração</label>
                    <Input
                      value={displayModule.duration}
                      onChange={(e) => handleModuleChange("duration", e.target.value)}
                      disabled={!editingModule}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Formato</label>
                    <Input
                      value={displayModule.format}
                      onChange={(e) => handleModuleChange("format", e.target.value)}
                      disabled={!editingModule}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-400 block mb-2">Descrição "Sobre esta aula"</label>
                  <Textarea
                    value={displayModule.description}
                    onChange={(e) => handleModuleChange("description", e.target.value)}
                    disabled={!editingModule}
                    className="bg-slate-700/50 border-slate-600 text-white min-h-24"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Files Management */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">
                    Arquivos e Recursos ({displayModule.files.length})
                  </CardTitle>
                  {editingModule && (
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-white hover:bg-slate-800 text-xs"
                        onClick={() => handleAddFile("video")}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Vídeo
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-white hover:bg-slate-800 text-xs"
                        onClick={() => handleAddFile("audio")}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Áudio
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-white hover:bg-slate-800 text-xs"
                        onClick={() => handleAddFile("pdf")}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        PDF
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-white hover:bg-slate-800 text-xs"
                        onClick={() => handleAddFile("powerpoint")}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        PowerPoint
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-white hover:bg-slate-800 text-xs"
                        onClick={() => handleAddFile("iframe")}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        iFrame
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {displayModule.files.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-slate-400">Nenhum arquivo adicionado ainda</p>
                    {editingModule && (
                      <p className="text-slate-500 text-sm mt-2">
                        Clique em um botão acima para adicionar arquivos
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {displayModule.files.map((file: ModuleFile) => (
                      <div
                        key={file.id}
                        className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 flex items-start justify-between hover:bg-slate-700/50 transition"
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="mt-1 text-purple-400">{getFileIcon(file.type as string)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-white">
                                {file.name}
                              </span>
                              <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">
                                {getFileTypeLabel(file.type)}
                              </span>
                            </div>
                            {file.type === "iframe" ? (
                              <p className="text-xs text-slate-400 mt-1 truncate">
                                Código iFrame
                              </p>
                            ) : (
                              <p className="text-xs text-slate-400 mt-1 truncate">
                                {file.url}
                              </p>
                            )}
                            <p className="text-xs text-slate-500 mt-1">
                              Adicionado em: {file.uploadedAt}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-2 flex-shrink-0">
                          <button
                            onClick={() => setPreviewFile(file)}
                            className="p-2 hover:bg-slate-600 rounded transition"
                            title="Visualizar"
                          >
                            <Eye className="w-4 h-4 text-slate-400" />
                          </button>
                          {editingModule && (
                            <button
                              onClick={() => handleDeleteFile(file.id)}
                              className="p-2 hover:bg-red-600/20 rounded transition"
                              title="Deletar"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upload Area */}
            {editingModule && (
              <Card className="bg-slate-800/50 border-slate-700 border-dashed">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Upload de Arquivos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-purple-500 transition cursor-pointer">
                    <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-white font-medium mb-2">
                      Arraste arquivos aqui ou clique para selecionar
                    </p>
                    <p className="text-sm text-slate-400">
                      Suporta: Vídeos (MP4), Áudios (MP3), PDFs, PowerPoints (PPTX)
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept=".mp4,.mp3,.pdf,.pptx,.ppt"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <Card className="bg-slate-800 border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-white">{previewFile.name}</CardTitle>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1 hover:bg-slate-700 rounded"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </CardHeader>
            <CardContent>
              {previewFile.type === "iframe" ? (
                <div className="bg-slate-700/50 rounded-lg overflow-hidden">
                  <div
                    dangerouslySetInnerHTML={{ __html: previewFile.iframeCode || "" }}
                  />
                </div>
              ) : previewFile.type === "video" ? (
                <video
                  src={previewFile.url}
                  controls
                  className="w-full rounded-lg bg-black"
                />
              ) : previewFile.type === "audio" ? (
                <audio
                  src={previewFile.url}
                  controls
                  className="w-full"
                />
              ) : (
                <div className="bg-slate-700/50 rounded-lg p-8 text-center">
                  <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-300 mb-4">
                    Arquivo: {previewFile.name}
                  </p>
                  <a
                    href={previewFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300"
                  >
                    Abrir arquivo →
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


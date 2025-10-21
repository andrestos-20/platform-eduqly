import { Download, ExternalLink, Volume2 } from "lucide-react";

interface Material {
  id: string;
  type: "video" | "audio" | "pdf" | "powerpoint" | "iframe" | "webpage";
  name: string;
  url?: string;
  iframeCode?: string;
  uploadedAt: string;
}

interface ContentDisplayProps {
  material: Material | null;
}

export function ContentDisplay({ material }: ContentDisplayProps) {
  if (!material) {
    return (
      <div className="flex items-center justify-center h-[400px] text-slate-400">
        <p>Selecione um material para visualizar</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (material.type) {
      case "video":
        if (material.url?.includes("youtube.com") || material.url?.includes("youtu.be")) {
          // Extract YouTube video ID
          const youtubeId = material.url.includes("youtu.be")
            ? material.url.split("/").pop()
            : new URL(material.url).searchParams.get("v");
          return (
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={material.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          );
        } else if (material.url?.endsWith(".mp4") || material.url?.endsWith(".webm") || material.url?.endsWith(".mov") || material.url?.endsWith(".avi")) {
          return (
            <video
              width="100%"
              height="400"
              controls
              className="rounded-lg bg-black"
            >
              <source src={material.url} type={material.url.endsWith(".mp4") ? "video/mp4" : material.url.endsWith(".webm") ? "video/webm" : material.url.endsWith(".mov") ? "video/quicktime" : "video/x-msvideo"} />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          );
        }
        break;

      case "audio":
        // Support both audio files (mp3, wav) and video files with audio (mp4, webm)
        const isAudioFile = material.url?.endsWith(".mp3") || material.url?.endsWith(".wav") || material.url?.endsWith(".m4a");
        const isVideoWithAudio = material.url?.endsWith(".mp4") || material.url?.endsWith(".webm") || material.url?.endsWith(".mov");
        
        if (isVideoWithAudio) {
          // If it's a video file, render as video player (which can play audio-only videos)
          return (
            <video
              width="100%"
              height="400"
              controls
              className="rounded-lg bg-black"
            >
              <source src={material.url || ""} type={material.url?.endsWith(".mp4") ? "video/mp4" : material.url?.endsWith(".webm") ? "video/webm" : "video/quicktime"} />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          );
        }
        
        // Otherwise render as audio player
        return (
          <div className="flex flex-col items-center justify-center p-8 bg-slate-800/50 rounded-lg border border-slate-700 h-[400px]">
            <div className="mb-6 p-4 bg-purple-600/20 rounded-full">
              <Volume2 className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">{material.name}</h3>
            <audio
              controls
              className="w-full max-w-md"
            >
              <source src={material.url} type={material.url?.endsWith(".wav") ? "audio/wav" : material.url?.endsWith(".m4a") ? "audio/mp4" : "audio/mpeg"} />
              Seu navegador não suporta o elemento de áudio.
            </audio>
          </div>
        );

      case "pdf":
        return (
          <div className="flex flex-col gap-4">
            <iframe
              src={`${material.url}#toolbar=1&navpanes=0&scrollbar=1`}
              width="100%"
              height="400"
              title={material.name}
              className="rounded-lg border border-slate-700"
            ></iframe>
            {material.url && (
              <a
                href={material.url}
                download
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition w-full"
              >
                <Download className="w-4 h-4" />
                Baixar PDF
              </a>
            )}
          </div>
        );

      case "powerpoint":
        return (
          <div className="flex flex-col gap-4">
            {material.url?.endsWith(".pptx") || material.url?.endsWith(".ppt") ? (
              <>
                <iframe
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(material.url)}`}
                  width="100%"
                  height="400"
                  title={material.name}
                  className="rounded-lg border border-slate-700"
                ></iframe>
                <a
                  href={material.url}
                  download
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition w-full"
                >
                  <Download className="w-4 h-4" />
                  Baixar PowerPoint
                </a>
              </>
            ) : (
              <div className="p-8 bg-slate-800/50 rounded-lg border border-slate-700 text-center h-[400px] flex items-center justify-center">
                <div>
                  <p className="text-slate-300 mb-4">PowerPoint não pode ser visualizado diretamente</p>
                  <a
                    href={material.url}
                    download
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition"
                  >
                    <Download className="w-4 h-4" />
                    Baixar PowerPoint
                  </a>
                </div>
              </div>
            )}
          </div>
        );

      case "iframe":
        return (
          <div className="flex flex-col gap-4">
            {material.iframeCode ? (
              <div
                className="rounded-lg border border-slate-700 overflow-hidden h-[400px]"
                dangerouslySetInnerHTML={{ __html: material.iframeCode }}
              ></div>
            ) : material.url ? (
              <iframe
                src={material.url}
                width="100%"
                height="400"
                title={material.name}
                className="rounded-lg border border-slate-700"
              ></iframe>
            ) : (
              <div className="p-8 bg-slate-800/50 rounded-lg border border-slate-700 text-center h-[400px] flex items-center justify-center">
                <p className="text-slate-300">Conteúdo não disponível</p>
              </div>
            )}
          </div>
        );

      case "webpage":
        return (
          <div className="flex flex-col gap-4">
            <iframe
              src={material.url}
              width="100%"
              height="400"
              title={material.name}
              className="rounded-lg border border-slate-700"
            ></iframe>
            {material.url && (
              <a
                href={material.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition w-full"
              >
                <ExternalLink className="w-4 h-4" />
                Abrir em Nova Aba
              </a>
            )}
          </div>
        );

      default:
        return (
          <div className="p-8 bg-slate-800/50 rounded-lg border border-slate-700 text-center h-[400px] flex items-center justify-center">
            <p className="text-slate-300">Tipo de conteúdo não suportado: {material.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  );
}


import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, CheckCircle2, BarChart3, Zap, Users, Award, Settings, Loader } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  // Buscar módulos do banco de dados
  const { data: modules = [], isLoading: modulesLoading } = trpc.modules.list.useQuery();

  const benefits = [
    {
      icon: BarChart3,
      title: "Entender a importância da análise de dados",
      description: "Aprenda por que dados são fundamentais para decisões estratégicas"
    },
    {
      icon: Zap,
      title: "Aplicar pensamento analítico",
      description: "Desenvolva a habilidade de transformar informações em insights"
    },
    {
      icon: CheckCircle2,
      title: "Tratar e visualizar dados no Power BI",
      description: "Domine as ferramentas práticas de análise e visualização"
    },
    {
      icon: Award,
      title: "Tomar decisões baseadas em indicadores reais",
      description: "Substitua achismos por dados concretos e mensuráveis"
    },
    {
      icon: Users,
      title: "Transformar negócios com tecnologia",
      description: "Use o poder dos dados para impulsionar resultados"
    }
  ];

  const courseInfo = [
    { label: "Carga horária", value: "1h30" },
    { label: "Modalidade", value: "Online" },
    { label: "Tecnologia", value: "Power BI" },
    { label: "Disciplina", value: "Administração" },
    { label: "Plataforma", value: "Google Classroom" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-lg">Eduqly Academy</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#estrutura" className="text-slate-300 hover:text-white transition">Estrutura</a>
            <a href="#beneficios" className="text-slate-300 hover:text-white transition">Beneficios</a>
            <a href="#inscricao" className="text-slate-300 hover:text-white transition">Inscricao</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="/admin/login">
              <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </a>
            <a href="/login">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Acessar Curso
              </Button>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block bg-slate-800/50 border border-slate-700 rounded-full px-4 py-2">
              <p className="text-sm text-slate-300">
                Curso criado por alunos da Universidade UNINOVE
              </p>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Transforme dados em <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">decisões inteligentes</span>
            </h1>
            <p className="text-xl text-slate-300">
              Aprenda Power BI aplicado a Restaurantes e Negócios. Do achismo à decisão baseada em dados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
            <a href="/login">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                Quero Aprender Agora
              </Button>
            </a>
              <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
                Saiba Mais
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">{modules.length}</span>
                <span className="text-slate-400">módulos práticos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">1h30</span>
                <span className="text-slate-400">de conteúdo</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-8 backdrop-blur">
              <div className="bg-slate-800 rounded-lg p-6 space-y-4">
          <img src="/data-analysis.png" alt="Pessoa analisando dados" className="h-40 w-full object-cover rounded" />
                <div className="space-y-2">
                  <div className="h-3 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Info */}
      <section className="bg-slate-800/50 border-y border-slate-700 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {courseInfo.map((info, idx) => (
              <div key={idx} className="text-center">
                <p className="text-slate-400 text-sm mb-2">{info.label}</p>
                <p className="text-white font-semibold text-lg">{info.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="estrutura" className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white">Estrutura do Curso</h2>
            <p className="text-xl text-slate-400">{modules.length} módulos práticos e interativos</p>
          </div>

          {modulesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {modules.map((module) => (
                <Card
                  key={module.id}
                  className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition cursor-pointer"
                  onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Módulo {module.id}
                          </span>
                          <span className="text-sm bg-slate-700 text-slate-300 px-3 py-1 rounded-full">
                            {module.duration}
                          </span>
                        </div>
                        <CardTitle className="text-white text-xl">{module.title}</CardTitle>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition ${
                          expandedModule === module.id ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </CardHeader>
                  {expandedModule === module.id && (
                    <CardContent className="space-y-4 border-t border-slate-700 pt-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-slate-400 text-sm mb-1">Formato</p>
                          <p className="text-white">{module.format}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm mb-1">Instrutor(a)</p>
                          <p className="text-white">{module.instructor}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Descrição</p>
                        <p className="text-slate-300">{module.description}</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="bg-slate-800/50 border-y border-slate-700 py-12">
        <div className="container mx-auto px-4 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white">O que você vai aprender</h2>
            <p className="text-xl text-slate-400">Mais do que aprender Power BI, você vai aprender a enxergar oportunidades nos números</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <Card key={idx} className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Icon className="w-6 h-6 text-purple-400" />
                      </div>
                    </div>
                    <CardTitle className="text-white text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-700 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">Eduqly Academy</h3>
              <p className="text-slate-400 text-sm">Transformando dados em decisões inteligentes</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Navegação</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#estrutura" className="hover:text-white transition">Estrutura</a></li>
                <li><a href="#beneficios" className="hover:text-white transition">Benefícios</a></li>
                <li><a href="#inscricao" className="hover:text-white transition">Inscrição</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Suporte</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Contato</a></li>
                <li><a href="#" className="hover:text-white transition">Documentação</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition">Termos</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400">
            <p>&copy; 2025 Eduqly Academy. Todos os direitos reservados. Criado com ❤️ por alunos da UNINOVE.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}


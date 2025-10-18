const mysql = require('mysql2/promise');

async function seedModules() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  const modules = [
    {
      title: "Introdução ao tema: Por que analisar dados?",
      instructor: "Isabela",
      duration: "5 min",
      format: "Vídeo introdutório",
      description: "Entenda a importância fundamental da análise de dados para decisões estratégicas.",
      files: JSON.stringify([])
    },
    {
      title: "Conceitos e Fundamentos do Power BI",
      instructor: "Julia",
      duration: "15 min",
      format: "Slides narrados / e-book",
      description: "Aprenda os conceitos essenciais e a interface do Power BI.",
      files: JSON.stringify([])
    },
    {
      title: "Aplicações Práticas na Administração e Restaurantes",
      instructor: "Melissa, Ellen",
      duration: "20 min",
      format: "Estudo de caso",
      description: "Veja exemplos reais de como usar Power BI em negócios.",
      files: JSON.stringify([])
    },
    {
      title: "Tutorial Passo a Passo no Power BI",
      instructor: "André, Alexandre",
      duration: "30 min",
      format: "Screencast / guia prático",
      description: "Aprenda na prática como criar dashboards e visualizações.",
      files: JSON.stringify([])
    },
    {
      title: "Atividade Interativa (Quiz)",
      instructor: "Nathalia",
      duration: "10 min",
      format: "Kahoot / Google Forms",
      description: "Teste seus conhecimentos com perguntas interativas.",
      files: JSON.stringify([])
    }
  ];

  for (const module of modules) {
    await connection.execute(
      'INSERT INTO modules (title, instructor, duration, format, description, files) VALUES (?, ?, ?, ?, ?, ?)',
      [module.title, module.instructor, module.duration, module.format, module.description, module.files]
    );
  }

  await connection.end();
  console.log('Modules seeded successfully!');
}

seedModules().catch(console.error);

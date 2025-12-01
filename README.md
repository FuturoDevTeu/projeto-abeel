# Sistema de gerenciamento de elevador
Um sistema completo para gestão de empresas, prédios, elevadores e componentes, desenvolvido com Spring Boot (back-end) e Angular (front-end). O objetivo é oferecer um fluxo simples e organizado para cadastro e acompanhamento das informações, além da geração de relatórios em PDF.
## Tecnologias Usadas:
- Spring Boot
   - Spring Web
   - Spring Security (JWT)
   - Spring JPA
- Angular
- MySQL

## Requesitos: 
  - Ter o Java (SDK) 17+ instalado
  - Ter o npm insatalado
  - Ter o MySQL instalado
  - Ter uma IDE (IntelliJ, Eclipse, VS Code, etc.)
## Como rodar:
1. clona o repositorio
  ~~~~
  git clone https://github.com/FuturoDevTeu/projeto-abeel
  ~~~~
2. Crie o banco de dados com nome ria ou aponte para o banco que você possui
  1. Siga este caminho: abeel/src/main/resources/application-local.properties
  2. Altere está linha:
     ~~~~
     spring.datasource.url=jdbc:mysql://localhost:3306/{Altere_aqui}
     ~~~~
4. Rode a aplicação Spring indo em: abeel/src/main/java/br/com/abeel/abeel/AbeelApplication.java
5. Abra a pasta do front-end: appElevador
6. Faça o seguinte comando
   ~~~~~~
   npm install
   ~~~~~~
7. Depois faça um
   ~~~~~~
   npm start
   ~~~~~~
8. Abra o navegador e coloque a url: https://localhost:4200

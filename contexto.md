# SALMORIZE

> Memorize os Salmos. Transforme a Palavra em memória.

---

# Visão do Produto

Salmorize é um webapp de memorização dos Salmos da Bíblia Católica.

Mais do que um aplicativo de estudos, o produto propõe uma jornada espiritual gamificada, inspirada em conceitos de repetição espaçada, contemplação e constância diária.

O usuário não apenas aprende textos bíblicos, mas constrói uma rotina de oração e aproximação com Deus.

## Inspirações

* Duolingo (gamificação)
* Headspace (calma e contemplação)
* Notion (simplicidade)
* Airbnb 3D Icons (personagens)

---

# Filosofia do Produto

O Salmorize não é:

* Um curso bíblico
* Um aplicativo de produtividade
* Um aplicativo de leitura da Bíblia

O Salmorize é:

* Uma jornada espiritual
* Um companheiro de oração
* Um sistema de memorização contemplativa
* Um hábito diário

---

# MVP

## Objetivo

Validar a hipótese:

> Pessoas desejam memorizar os Salmos através de uma experiência espiritual e gamificada.

## Funcionalidades

* Login
* Onboarding
* Escada Espiritual
* Sessão de Memorização
* Sistema de Revisão
* Streak diária
* Perfil do usuário

---

# Jornada dos Salmos

A progressão acontece em ordem.

```
Salmo 1
↓
Salmo 2
↓
Salmo 3
↓
...
↓
Salmo 150
```

Não existe escolha livre no MVP.

A ideia é criar uma verdadeira peregrinação espiritual.

---

# Escada Espiritual

Substitui o mapa tradicional do Duolingo.

Cada degrau representa um Salmo.

Estados:

* Bloqueado
* Em progresso
* Concluído
* Revisão necessária

Conceito:

> Cada Salmo memorizado é um novo passo na vida espiritual.

---

# Fluxo de Memorização

Cada sessão segue a estrutura:

## 1. Escutar

Áudio narrado.

## 2. Ler

Leitura guiada.

## 3. Completar

Exemplo:

"O Senhor é meu _____"

## 4. Digitar

Recitar de memória.

## 5. Revisar

Repetição espaçada.

## 6. Refletir

Pequena meditação sobre o Salmo.

---

# Sistema de Revisão

Implementar Spaced Repetition simples.

Se errar:

* aumentar frequência.

Se acertar:

* diminuir frequência.

---

# Home

Exibir:

* Continuar Jornada
* Degrau atual
* Streak
* Progresso geral
* Última atividade

---

# Perfil

Exibir:

* Salmos concluídos
* Dias consecutivos
* Tempo estudado
* Progresso total

---

# Onboarding

## Tela 1

### Título

Memorize os Salmos.
Transforme a Palavra em memória.

### Texto

Uma jornada diária de oração, contemplação e constância.

Botão:

Começar Jornada

---

## Tela 2

### Título

Cada Salmo é um novo degrau.

### Texto

Avance passo a passo, fortalecendo sua vida espiritual.

Botão:

Continuar

---

## Tela 3 (Tutorial Interativo)

O usuário experimenta o produto antes do cadastro.

### Fluxo

Davi:

"Vou dizer o nome do primeiro Salmo."

🔊 Áudio:

"Salmo 1"

Usuário digita:

```
______________
```

Botão:

Verificar

Se acertar:

"Excelente!
Você acaba de dar o primeiro passo da sua jornada."

Em seguida:

Tela de Login.

Objetivo:

Salvar o progresso.

---

# Fluxo do Aplicativo

```
Splash

↓

Tela 1

↓

Tela 2

↓

Tutorial Prático

↓

Login

↓

Escada Espiritual

↓

Salmo 1

↓

Sessão de Memorização
```

---

# Mascotes

## Rei Davi

Papel:

* Guia
* Pastor
* Mentor
* Companheiro

Personalidade:

* Sábio
* Acolhedor
* Humilde
* Inspirador

Características:

* Ruivo
* Barba cheia
* Coroa simples
* Harpa
* Capa azul
* Roupa clara
* Estilo 3D inspirado em Airbnb Icons

---

## A Ovelha

Representa o usuário.

Conceito:

> Davi é o pastor.
> O usuário é sua ovelha.

Personalidade:

* Curiosa
* Dedicada
* Sincera
* Perseverante

Visual:

* Pequena
* Fofa
* Lã volumosa
* Cachecol azul
* Medalhão dourado

A ovelha evolui visualmente conforme o progresso.

---

# Estados do Rei Davi

## Idle

Uso:
Home.

---

## Speaking

Uso:
Onboarding.

---

## Listening

Uso:
Exercícios de áudio.

---

## Thinking

Uso:
Usuário digitando.

---

## Happy

Uso:
Resposta correta.

---

## Celebrating

Uso:
Novo degrau conquistado.

---

## Praying

Uso:
Reflexão.

---

## Waiting

Uso:
Usuário ausente.

---

# Sistema de Animação

Arquitetura recomendada:

* PNG em camadas
* React
* Framer Motion

Partes animáveis:

* Olhos
* Boca
* Braços
* Harpa
* Cabeça
* Capa

Micro animações:

* Piscar
* Respirar
* Pequeno balanço
* Movimento da cabeça

Evitar modelos 3D completos no MVP.

---

# UX Writing

Evitar linguagem gamer.

Não usar:

* Level
* Coins
* Gems
* Missão

Usar:

* Jornada
* Degrau
* Constância
* Fidelidade
* Progresso Espiritual

---

# Design System

## Estilo

* Minimalista
* Premium
* Contemplativo
* Espiritual

## Paleta

* Off White
* Creme
* Azul Profundo
* Dourado Suave
* Cinza Quente

## Tipografia

Títulos:
Serif elegante.

Interface:
Sans-serif moderna.

---

# Stack Tecnológica

## Frontend

* Next.js
* React
* TypeScript
* TailwindCSS
* Framer Motion

## Backend

Supabase

### Banco

* users
* psalms
* progress
* reviews
* streaks

---

# Estrutura Inicial

```
/app
    /login
    /onboarding
    /home
    /journey
    /session
    /profile
    /settings

/components
    DavidMascot
    SheepMascot
    SpiritualStaircase
    PsalmCard
    AudioPlayer
    ReflectionCard
    ProgressBar
```

---

# Visão de Longo Prazo

O Salmorize deve fazer o usuário sentir que:

> "Estou subindo, um Salmo por vez, na minha caminhada com Deus."

A memorização é apenas o meio.

O verdadeiro produto é a construção de um hábito espiritual diário.

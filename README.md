<div align="center">

# Harzourou

**Langage de programmation moderne — data science, flux de données, ML**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/harzourou/harzourou/releases)
[![Licence](https://img.shields.io/badge/licence-MIT-green.svg)](LICENSE)
[![Plateforme](https://img.shields.io/badge/plateforme-Windows%20%7C%20Linux%20%7C%20macOS-lightgrey.svg)](docs/)
[![C++](https://img.shields.io/badge/runtime-C++17-orange.svg)](CMakeLists.txt)
[![Rust](https://img.shields.io/badge/aiki-Rust-red.svg)](https://github.com/harzourou/aiki)

*Développé C. Aboulaye — filière*

</div>

---

## Table des matières

- [Présentation](#présentation)
- [Démarrage rapide](#démarrage-rapide)
- [Le langage](#le-langage)
  - [Variables](#variables)
  - [Fonctions](#fonctions)
  - [Contrôle de flux](#contrôle-de-flux)
  - [Collections & Pipe](#collections--pipe)
  - [Modules](#modules)
  - [Gestion des erreurs](#gestion-des-erreurs)
- [Compiler et exécuter](#compiler-et-exécuter)
  - [Build depuis les sources](#build-depuis-les-sources)
  - [Options du compilateur](#options-du-compilateur)
  - [REPL interactif](#repl-interactif)
- [Aiki — Gestionnaire de paquets](#aiki--gestionnaire-de-paquets)
  - [Installation d'Aiki](#installation-daiki)
  - [Commandes Aiki](#commandes-aiki)
  - [Manifeste Aiki.toml](#manifeste-aikitoml)
- [Bibliothèque standard](#bibliothèque-standard)
  - [Modules natifs C++](#modules-natifs-c)
  - [Modules stdlib Harzourou](#modules-stdlib-harzourou)
- [HarzMind — IA embarquée](#harzmind--ia-embarquée)
- [Architecture du compilateur](#architecture-du-compilateur)
- [Structure du projet](#structure-du-projet)
- [Extensions de fichiers](#extensions-de-fichiers)
- [Environnement](#environnement)
- [Documentation](#documentation)
- [Contribuer](#contribuer)
- [Licence](#licence)

---

## Présentation

Harzourou est un langage de programmation compilé et interprété, conçu pour la **programmation par flux de données**, le **calcul scientifique** et le **scripting généraliste**. Le compilateur et le runtime sont écrits en C++17 et ciblent une machine virtuelle à registres.

**Philosophie :**

- Variables déclarées avec `flow` — le flux de données est au cœur du langage
- Données persistantes — les collections ne sont jamais mutées, toute opération retourne une nouvelle valeur
- Fonctionnel-first — `map`, `filter`, `fold`, pipe `|>`, composition `>>`, closures
- Modules natifs riches — math, strings, listes, I/O, réseau, JSON, tenseurs, visualisation
- Gestionnaire de paquets officiel — **Aiki** (v1.0.0)

---

## Démarrage rapide

### 1. Compiler le runtime

```bash
git clone https://github.com/harzourou/harzourou
cd harzourou
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build --config Release -j$(nproc)
sudo cp build/harz /usr/local/bin/harz
export HARZOUROU_PATH="$(pwd)/HarzourouModules"
```

### 2. Premier programme

```harzourou
// hello.harz
fprintln("Bonjour, Harzourou !")

flow nums = [1..=10]
    |> filter(fun(n){ return n % 2 == 0 })
    |> map(fun(n){ return n * n })
    |> fold(0, fun(acc, n){ return acc + n })

fprintln("Somme des carrés pairs : " ~ str(nums))   // 220
```

```bash
harz hello.harz
```

### 3. Créer un projet avec Aiki

```bash
aiki init mon-projet
cd mon-projet
aiki add math
aiki run start
```

---

## Le langage

### Variables

Toutes les variables sont déclarées avec `flow`. Le typage est optionnel (inféré sinon) :

```harzourou
flow age    : int     = 25
flow pi     : float   = 3.14159
flow actif  : bool    = true
flow prénom : string  = "Amine"
flow vide                          // null implicite
```

**Types numériques précis** (data science / ML) :

| Entiers signés | Entiers non signés | Flottants |
|---|---|---|
| `int8` `int16` `int32` `int64` | `uint8` `uint16` `uint32` `uint64` | `float16` `bfloat16` `float32` `float64` |

```harzourou
flow poids  : float32  = 0.5
flow pixels : uint8    = 255
flow grad   : bfloat16 = 1.0e-3
```

**Listes et ranges :**

```harzourou
flow r1 = 1..10      // [1, 2, …, 9]    exclusif
flow r2 = 1..=10     // [1, 2, …, 10]   inclusif
flow v  = [10, 20, 30]
fprintln(v[0])        // 10
fprintln(v[-1])       // 30  (index négatif = depuis la fin)
```

**Concaténation de chaînes** avec `~` :

```harzourou
flow msg = "Bonjour, " ~ "Harzourou" ~ " !"
```

---

### Fonctions

```harzourou
fun factorielle(n : int) : int {
    if n <= 1 { return 1 }
    return n * factorielle(n - 1)
}

// Valeurs par défaut
fun saluer(nom : string, salut : string = "Bonjour") : string {
    return salut ~ ", " ~ nom ~ "!"
}

// Closure
fun multiplicateur(n : int) {
    return fun(x : int) { return x * n }
}
flow fois3 = multiplicateur(3)
fprintln(fois3(7))   // 21

// Application partielle
flow double = partial(fun(a, b){ return a * b }, 2)
fprintln(double(10))  // 20
```

**Fonctions d'ordre supérieur natives :**

```harzourou
flow nums = [1, 2, 3, 4, 5, 6]

flow carrés = map(nums, fun(x){ return x * x })     // [1, 4, 9, 16, 25, 36]
flow pairs  = filter(nums, fun(x){ return x % 2 == 0 }) // [2, 4, 6]
flow somme  = fold(nums, 0, fun(acc, x){ return acc + x }) // 21
```

---

### Contrôle de flux

```harzourou
// Conditions
if score >= 90 { fprintln("Excellent") }
else if score >= 75 { fprintln("Bien") }
else { fprintln("Passable") }

// Boucle
flow i = 0
while i < 10 {
    if i % 2 == 0 { saut }   // continue
    if i > 7      { break }
    fprintln(str(i))
    i += 1
}

// Pattern matching
match code {
    200 : fprintln("OK")
    404 : fprintln("Non trouvé")
    500 : fprintln("Erreur serveur")
    default : fprintln("Code : " ~ str(code))
}
```

---

### Collections & Pipe

Le type collection fondamental est le `PersistentVector` — **immuable** :

```harzourou
// Opérateur pipe |>  — insère à gauche comme 1er argument
flow résultat = [1..=100]
    |> filter(fun(x){ return x % 2 == 0 })   // pairs
    |> map(fun(x){ return x * x })            // carrés
    |> fold(0, fun(acc, x){ return acc + x }) // somme
// → 171700

// Composition >>
flow pipeline = (fun(x){ return x + 1 }) >> (fun(x){ return x * x })
fprintln(pipeline(4))   // 25

// HOF avancées
flow data = [3, 1, 4, 1, 5, 9, 2, 6, 5]

sort_by(data, fun(x){ return x })
group_by(data, fun(x){ return x % 2 == 0 ? "pair" : "impair" })
zip_with([1,2,3], [10,20,30], fun(a,b){ return a * b })  // [10, 40, 90]
flat_map([1,2,3], fun(x){ return [x, x*10] })             // [1,10,2,20,3,30]
take_while(data, fun(x){ return x < 5 })
```

---

### Modules

```harzourou
import math                          // module natif
import string as str_mod             // avec alias
from math import {sqrt, pi, sin}     // import sélectif

// Définir un module — fichier geometrie.mharz
module geometrie

fun aire_cercle(r : float) : float {
    import math
    return math.pi * r * r
}
```

```harzourou
// Utiliser le module
import geometrie
fprintln(geometrie.aire_cercle(5.0))   // 78.539…
```

Résolution dans l'ordre :

1. Dossier du fichier courant
2. `HARZOUROU_PKG_PATH` (paquets installés par Aiki)
3. `HARZOUROU_PATH` (bibliothèque standard)

---

### Gestion des erreurs

```harzourou
fun safe_div(a : float, b : float) : float {
    if b == 0.0 { throw "Division par zéro" }
    return a / b
}

try {
    fprintln(safe_div(10.0, 2.0))   // 5.0
    fprintln(safe_div(10.0, 0.0))   // throw
} catch e {
    fprintln("Erreur : " ~ e)
} finally {
    fprintln("Terminé")
}
```

---

## Compiler et exécuter

### Build depuis les sources

**Prérequis :** CMake ≥ 3.20, C++17 (GCC 11 / Clang 14 / MSVC 2022)

```bash
# Linux / macOS
git clone https://github.com/harzourou/harzourou
cd harzourou
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j$(nproc)
sudo cp build/harz /usr/local/bin/harz

# Windows (PowerShell)
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build --config Release
Copy-Item build\Release\harz.exe "$env:USERPROFILE\.local\bin\harz.exe"
```

Configurer la bibliothèque standard :

```bash
# Linux / macOS — ajouter à ~/.bashrc ou ~/.zshrc
export HARZOUROU_PATH="/usr/local/lib/HarzourouModules"

# ou pointer vers le dossier cloné
export HARZOUROU_PATH="$HOME/harzourou/HarzourouModules"
```

### Options du compilateur

```
Usage:
  harz                          REPL interactif
  harz <fichier.harz>           Exécuter un programme
  harz <module.mharz>           Exécuter un module

Options d'exécution:
  --interpret, -i     Utiliser l'interpréteur tree-walking (défaut : VM)

Optimiseurs:
  --no-opt            Désactiver l'optimiseur HIR
  --no-opt-bc         Désactiver l'optimiseur bytecode
  --stats             Afficher les statistiques d'optimisation

Génération de code:
  --emit-ll           Générer LLVM IR
  --ll-out <fichier>  Fichier de sortie LLVM IR (défaut : output.ll)

Dumps de debug:
  --tokens  [fichier] Afficher les tokens
  --ast     [fichier] Afficher l'AST
  --hir     [fichier] Afficher le HIR typé
  --mir     [fichier] Afficher le MIR (3-Address Code)
  --bc      [fichier] Afficher le bytecode désassemblé

Autres:
  --watch <fichier>   Mode watch — réexécute à chaque modification (Linux/macOS)
  --version, -v       Version du compilateur
  --help              Cette aide
```

**Exemples :**

```bash
harz main.harz                          # exécution normale (VM)
harz main.harz --interpret              # interpréteur tree-walking
harz main.harz --no-opt --stats         # sans optim, avec stats
harz main.harz --bc                     # dump bytecode désassemblé
harz main.harz --mir mir.txt            # dump MIR dans un fichier
harz main.harz --emit-ll --ll-out a.ll  # générer LLVM IR
harz --watch main.harz                  # mode watch (Linux/macOS)
harz                                    # REPL interactif
```

### REPL interactif

```bash
harz
```

```
Harzourou v1.0.0 — REPL interactif
Tape `exit` ou Ctrl+D pour quitter.

>>> flow x = 42
>>> fprintln(x * 2)
84
>>> import math
>>> math.sqrt(2.0)
1.4142135623730951
```

---

## Aiki — Gestionnaire de paquets

**Aiki** (_"travail"_ en haoussa) est le gestionnaire de paquets officiel de l'écosystème Harzourou, écrit en Rust.

### Installation d'Aiki

```bash
# Prérequis : Rust ≥ 1.75
git clone https://github.com/harzourou/aiki
cd aiki
cargo build --release
sudo cp target/release/aiki /usr/local/bin/aiki  # Linux/macOS
```

```powershell
# Windows
cargo build --release
Copy-Item target\release\aiki.exe "$env:USERPROFILE\.local\bin\aiki.exe"
```

Vérifier :

```bash
aiki version     # aiki 1.0.0
aiki doctor      # diagnostic de l'environnement
```

### Commandes Aiki

| Commande | Description |
|----------|-------------|
| `aiki init` | Initialise un projet (crée `Aiki.toml`, `main.harz`, `.aiki/`) |
| `aiki install` | Installe toutes les dépendances de `Aiki.toml` |
| `aiki add <pkg>` | Ajoute une dépendance (ex. `aiki add math`) |
| `aiki add <pkg>@<ver>` | Version précise (ex. `aiki add math@1.0.0`) |
| `aiki add <pkg> -D` | Dépendance de développement |
| `aiki remove <pkg>` | Retire une dépendance |
| `aiki update` | Met à jour toutes les dépendances |
| `aiki update <pkg>` | Met à jour un seul paquet |
| `aiki run <script>` | Exécute un script de `[scripts]` |
| `aiki run <script> --interpret` | Avec l'interpréteur tree-walking |
| `aiki run <script> --no-opt` | Sans optimiseur HIR |
| `aiki run <script> --no-opt-bc` | Sans optimiseur bytecode |
| `aiki run <script> --stats` | Avec stats d'optimisation |
| `aiki build` | Compile le projet (`harz <entry>`) |
| `aiki build --release` | Mode release |
| `aiki clean` | Supprime les artefacts |
| `aiki clean --lockfile` | Supprime aussi `Aiki.lock` |
| `aiki search <query>` | Recherche dans le registre |
| `aiki info` | Liste les dépendances installées |
| `aiki info <pkg>` | Détails d'un paquet |
| `aiki doctor` | Vérifie l'environnement complet |
| `aiki version` | Version d'Aiki |

**Flag global :** `--verbose` / `-v` — disponible sur toutes les commandes.

### Manifeste Aiki.toml

```toml
[package]
name        = "mon-projet"
version     = "0.1.0"
description = "Un projet Harzourou"
authors     = ["Votre Nom <vous@exemple.com>"]
license     = "MIT"
entry       = "main.harz"        # point d'entrée (défaut : main.harz)

[dependencies]
math = "1.0.0"                   # version exacte
fmt  = "^1.0"                    # compatible 1.x
algo = "latest"                  # dernière version

[dev_dependencies]
assert = "1.0.0"

[scripts]
start = "harz main.harz"
test  = "harz test.harz"
bench = "harz bench.harz --stats"

[build]
output = ".aiki/build"
flags  = []                      # flags harz toujours actifs au build

[harzourou]
# compiler     = "/usr/local/bin/harz"
# modules_path = "/usr/local/lib/HarzourouModules"
```

**Structure d'un projet :**

```
mon-projet/
├── Aiki.toml       ← manifeste  (à committer)
├── Aiki.lock       ← lockfile   (à committer)
├── main.harz       ← point d'entrée
├── .gitignore
└── .aiki/          ← géré par Aiki (ne pas éditer)
    ├── packages/   ← paquets installés
    ├── cache/      ← cache de téléchargement
    └── build/      ← artefacts de compilation
```

**Workflow type :**

```bash
aiki init mon-projet && cd mon-projet
aiki add math
aiki add assert -D
aiki run start
aiki run test
aiki build --release
aiki doctor
```

---

## Bibliothèque standard

### Modules natifs C++

Chargés dynamiquement via `import` :

| Module | Description |
|--------|-------------|
| `math` | Fonctions mathématiques, constantes (π, e, τ), trig, log, arrondi |
| `string` | Upper/lower, trim, split, join, replace, substr, to_int… |
| `list` | len, get, push, pop, sort, slice, flatten, unique, sum, min, max… |
| `func` | head, tail, zip, enumerate, chunks, flatten, repeat, range… |
| `io` | read_file, write_file, append_file, read_lines, mkdir, list_dir… |
| `json` | parse, stringify, pretty |
| `net` | HTTP GET/POST, TCP connect/send/recv |
| `time` | now(), date(), year/month/day/hour, sleep, timestamp_to_date… |
| `random` | rand, rand_int, rand_float, choice, shuffle, seed |
| `path` | Manipulation de chemins de fichiers |
| `csv` | Lecture / écriture CSV |
| `kern` | Exécution de processus et commandes shell |
| `flare` | Visualisation — génération de graphiques HTML (ECharts) |
| `fluxnet` | Client HTTP builder |
| `tensor` | Tenseurs multidimensionnels et algèbre linéaire |

### Modules stdlib Harzourou

Fichiers `.mharz` dans `HarzourouModules/` :

| Fichier | Description |
|---------|-------------|
| `arithmetic.mharz` | is_prime, pgcd, ppcm, factorielle, combinaisons |
| `algo.mharz` | HOF avancées, tri, recherche |
| `collections.mharz` | Stack, Queue, Deque, Pair |
| `dstats.mharz` | Statistiques descriptives (variance, std, médiane, quartiles) |
| `geometry.mharz` | Points, vecteurs, polygones, distances 2D/3D |
| `conv.mharz` | Conversions de types |
| `fmt.mharz` | Formatage de texte, tableaux ASCII |
| `str_utils.mharz` | Utilitaires de chaînes avancés |
| `json.mharz` | Constructeur JSON fluent |
| `datetime.mharz` | Calculs de dates, durées, fuseaux horaires |
| `math_ext.mharz` | Fonctions mathématiques étendues |
| `assert.mharz` | Framework de tests unitaires (ok, eq, neq, suite) |
| `fluxnet.mharz` | Client HTTP déclaratif |

**Exemple `assert` :**

```harzourou
import assert

assert.suite("Arithmétique")
assert.eq("addition", 2 + 3, 5)
assert.eq("modulo",   10 % 3, 1)
assert.ok("positif",  42 > 0)

assert.report()
```

---

## HarzMind — IA embarquée

**HarzMind** est la bibliothèque d'IA embarquée de Harzourou — modules C++ purs, zéro dépendance externe.

```harzourou
import nsmg

// Graphe de connaissances neuro-symbolique
flow g = nsmg.new(128)
flow a = nsmg.add(g, "concept_A")
flow b = nsmg.add(g, "concept_B")
nsmg.link(g, a, b, 0.8, 2)

nsmg.activate(g, a, 1.0)
nsmg.spread(g, a)

fprintln(nsmg.activation(g, b))

// Persistance
nsmg.save(g, "knowledge.aidb")
```

| Module | Description |
|--------|-------------|
| `nsmg` | NeuroSymbolic Memory Graph — graphe de connaissances avec propagation d'activation et SGD |
| `ael` | Adaptive Execution Lattice — treillis de décision avec Q-learning et UCT |
| `qsf` | Quantum Semantic Field — champ sémantique quantique (amplitudes complexes, superposition) |
| `qnsg` | Quantum NeuroSymbolic Graph — fusion NSMG + QSF avec interférence quantique |

Format de persistance : `.aidb` (AI DataBase binaire).

---

## Architecture du compilateur

```
Source (.harz)
    │
    ▼
┌─────────┐       ┌──────────┐      ┌──────────┐       ┌────────────┐
│  Lexer  │─────▶│  Parser  │─────▶│  HIR     │─────▶│ TypeInfer  │
│ Tokenize│       │ AST      │      │ Builder  │       │            │
└─────────┘       └──────────┘      └──────────┘       └────────────┘
                                                           │
                                                    ┌──────▼──────┐
                                                    │ HirOptimizer│
                                                    └──────┬──────┘
                                                           │
                                                    ┌──────▼──────┐
                                                    │ MirBuilder  │
                                                    │ (TAC / 3AC) │
                                                    └──────┬──────┘
                                                           │
                                                    ┌──────▼──────┐
                                                    │  Bytecode   │
                                                    │  Compiler   │
                                                    └──────┬──────┘
                                                           │
                                                    ┌──────▼──────┐
                                                    │  Optimizer  │
                                                    │ (folds,copy │
                                                    │  prop, jump)│
                                                    └──────┬──────┘
                                                           │
                                             ┌─────────────▼──────────────┐
                                             │                            │
                                      ┌──────▼──────┐             ┌───────▼──────┐
                                      │     VM      │             │  Interpreter │
                                      │  (défaut)   │             │  (--interpret│
                                      │  Registres  │             │  tree-walk)  │
                                      └─────────────┘             └──────────────┘
```

**Pipeline en 7 étapes :**

1. **Lexer** — tokenisation, support UTF-8, BOM stripping
2. **Parser** — descente récursive → AST
3. **HIR Builder** — résolution des symboles, construction du HIR typé
4. **TypeInfer** — inférence de types, vérification des annotations
5. **HirOptimizer** — optimisations sur le HIR (si `--no-opt` absent)
6. **MirBuilder** — lowering HIR → MIR 3-adresses (TAC)
7. **BytecodeCompiler** — MIR → bytecode pour VM à registres
   - **Optimizer** — constant folding, copy propagation, jump chain collapsing

**Deux backends d'exécution :**

- **VM à registres** (défaut) — performance maximale
- **Interpréteur tree-walking** (`--interpret`) — référence, utile pour le debug

---

## Structure du projet

```
harzourou/
├── src/
│   ├── HARZOUROU.cpp           Point d'entrée (CLI, runner, REPL)
│   ├── backend/
│   │   ├── TypeInfer.cpp       Inférence de types
│   │   ├── MirBuilder.cpp      HIR → MIR (3-address code)
│   │   ├── BytecodeCompiler.cpp MIR → bytecode
│   │   ├── Optimizer.cpp       Optimiseur bytecode (3 passes)
│   │   ├── vm.cpp              VM à registres
│   │   ├── Interp.cpp          Interpréteur tree-walking
│   │   ├── Repl.cpp            REPL interactif
│   │   └── Flam_runtime.cpp    Système de valeurs runtime
│   ├── lexer/
│   │   └── Lexer.cpp           Tokeniseur
│   ├── parser/
│   │   ├── Parser.cpp          Parser récursif descendant
│   │   └── hir.cpp             HIR (High-level IR)
│   ├── compiller/
│   │   └── BytecodeCompiler.cpp
│   └── utils/
│       ├── harzourou_stdlib.cpp Binding de la stdlib
│       └── harzourou_helpers.cpp
├── include/                    Headers (miroirs de src/)
├── modules/                    Modules natifs C++
│   ├── f_math.cpp              math
│   ├── f_string.cpp            string
│   ├── f_list.cpp              list
│   ├── f_io.cpp                io
│   ├── f_net.cpp               net (HTTP/TCP)
│   ├── f_json.cpp              json
│   ├── f_time.cpp              time
│   ├── f_random.cpp            random
│   ├── f_csv.cpp               csv
│   ├── f_path.cpp              path
│   ├── f_kern.cpp              kern (process)
│   ├── f_fluxnet.cpp           fluxnet (HTTP builder)
│   ├── f_flare/                flare (visualisation HTML)
│   ├── f_tensor.cpp            tensor
│   ├── NativeModules.cpp       Registre des modules natifs
│   └── Modulemanager.cpp       Chargement et résolution
├── HarzourouModules/           Stdlib écrite en Harzourou
│   ├── arithmetic.mharz
│   ├── algo.mharz
│   ├── collections.mharz
│   ├── dstats.mharz
│   ├── geometry.mharz
│   ├── fmt.mharz
│   ├── str_utils.mharz
│   ├── json.mharz
│   ├── datetime.mharz
│   ├── math_ext.mharz
│   ├── assert.mharz
│   └── .harzourou_stdlib       Marqueur de la bibliothèque standard
├── tests/                      Programmes de test
│   ├── test.harz
│   └── regression_*.harz
├── infos/
│   ├── harzourou.grammar       Grammaire formelle EBNF
│   └── Tokens                  Énumération des tokens
├── debug/                      Utilitaires de debug
├── CMakeLists.txt
└── README.md
```

---

## Extensions de fichiers

| Extension | Rôle |
|-----------|------|
| `.harz` | Fichier programme principal |
| `.mharz` | Fichier module (Module Harzourou Source File) |
| `.aidb` | Base de données IA (HarzMind) |

---

## Environnement

| Variable | Rôle |
|----------|------|
| `HARZOUROU_PATH` | Chemin vers `HarzourouModules/` (bibliothèque standard) |
| `HARZOUROU_PKG_PATH` | Chemins des paquets installés par Aiki (injecté automatiquement) |

**Résolution du binaire `harz` par Aiki :**

1. `[harzourou].compiler` dans `Aiki.toml`
2. `harz_binary` dans `~/.aiki/config.toml`
3. `harz` sur le `PATH`
4. `harzourou` sur le `PATH` (nom alternatif)

---

## Documentation

| Ressource | Description |
|-----------|-------------|
| [docs.harzourou.dev](https://docs.harzourou.dev) | Documentation officielle en ligne |
| [`/docs`](docs/) | Documentation locale |
| [aiki/README.md](https://github.com/harzourou/aiki) | Documentation d'Aiki |
| [aiki/ARCHITECTURE.md](https://github.com/harzourou/aiki/blob/main/ARCHITECTURE.md) | Architecture interne d'Aiki |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Guide de contribution |

---

## Contribuer

Les contributions sont les bienvenues !

```bash
# Fork + clone
git clone https://github.com/<vous>/harzourou
cd harzourou

# Build debug
cmake -S . -B build-debug -DCMAKE_BUILD_TYPE=Debug
cmake --build build-debug

# Tester
./build-debug/harz tests/test.harz
```

**Avant de soumettre une PR :**

- [ ] Le code compile sans warnings (`-Wall -Wextra`)
- [ ] Les tests existants passent
- [ ] Le nouveau code est commenté
- [ ] Le style suit les conventions du projet (C++17 idiomatique)

Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour les détails.

---

## Licence

MIT — voir [LICENSE](LICENSE).

---

<div align="center">

**Harzourou** — Développé à l'ENSAM Meknès, filière IATD-SI  
*C. Aboulaye*

</div>

# Idearchi

Design d'intérieur par IA — soumet un brief, reçois 3 propositions visuelles, vote pour ton préférée.

## Stack
- **Frontend** : HTML/CSS/JS vanilla (index.html)
- **Proxy API** : Vercel Serverless Functions (api/)
- **Base de données** : Airtable (table Idearchi_Projets)
- **IA texte** : Claude (Anthropic)
- **IA image** : DALL-E 3 (OpenAI)

## Déploiement Vercel

### Variables d'environnement à configurer sur Vercel :
| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Clé API Anthropic (claude.ai → API) |
| `OPENAI_API_KEY` | Clé API OpenAI (platform.openai.com) |

### Étapes :
1. Fork ou push ce repo sur GitHub
2. Connecter le repo sur vercel.com → "New Project"
3. Ajouter les 2 variables d'environnement dans Settings → Environment Variables
4. Déployer
5. Dans l'app en ligne, cliquer ⚙ et entrer le token Airtable

## Structure
```
idearchi/
├── index.html          # App complète
├── api/
│   ├── claude.js       # Proxy → api.anthropic.com
│   └── image.js        # Proxy → api.openai.com/images
├── vercel.json         # Config routing
└── .gitignore
```

## Airtable
- Base ID : appj0Zvin0JBfzjnd
- Table : Idearchi_Projets (tblsTurZ4IMP4UCQx)
- Token nécessaire : scopes data.records:read, data.records:write, schema.bases:read

# Frontend Migration Plan – 2025

## Scope
Upgrade ShareUpTime frontend to latest stack while preserving UI, UX, and logic.

## Non-Goals
- No redesign of UI/UX
- No business logic changes
- No removal of legacy code unless required

## Tooling Targets
- React 18.x
- React Router v6
- Node.js LTS (20.x)
- CRA upgrade or migrate to Vite
- Upgrade axios, ESLint, Prettier, Babel, Webpack configs
- Keep jQuery/mmenu temporarily

## Risk Controls
- Full backup and snapshot tags
- Work isolated in `frontend-migration-2025`
- Incremental upgrades with testing
- No UI/UX/logic changes

## Next Steps Checklist
1. Confirm Node.js, React, and build tool versions
2. Upgrade backend separately
3. Upgrade frontend dependencies
4. Replace deprecated React APIs
5. Test routes, forms, components
6. Document changes
7. QA and code review

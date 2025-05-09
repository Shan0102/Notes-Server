
```
Bcrypt
├─ package.json
├─ src
│  ├─ API
│  │  ├─ app.ts
│  │  ├─ controllers
│  │  │  ├─ notesController.ts
│  │  │  └─ usersController.ts
│  │  ├─ middleware
│  │  │  └─ authMiddleware.ts
│  │  ├─ routers
│  │  │  └─ usersRouter.ts
│  │  ├─ server.ts
│  │  └─ utils
│  │     ├─ bcrypt.ts
│  │     ├─ createError.ts
│  │     ├─ createUserObj.ts
│  │     ├─ errorHandlers.ts
│  │     ├─ jwt.ts
│  │     ├─ notesValidation.ts
│  │     └─ usersValidation.ts
│  ├─ DB
│  │  ├─ notesTable.ts
│  │  ├─ usersTable.ts
│  │  └─ utils
│  │     ├─ pool.ts
│  │     └─ tryCatch.ts
│  └─ types
│     ├─ express.d.ts
│     └─ index.ts
└─ tsconfig.json

```
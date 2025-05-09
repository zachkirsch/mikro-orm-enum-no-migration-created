# MikroORM repro for `migrator.createMigration()` not creating a migration in postgres when enum value is removed

Github issue:

To run the (failing) test:

```
npm install
npm run test
```

You can see the failing test here: [src/removeEnumValueAndCreateMigration.test.ts](src/removeEnumValueAndCreateMigration.test.ts#L53-L62).

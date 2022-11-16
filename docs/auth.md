# 用户、角色、菜单、API 业务设计

## 数据模型

```prisma
model User {
    id        Int @id @default(autoincrement())
    createdAt DateTime @default(now())
    providerUserId   String
    name String
    avatarUrl String?
    provider String
    providerId String
}

model UserOnRole {
    userId Int
    roleId Int

    @@id([userId, roleId])
}

model Menu {
    id Int @id @default(autoincrement())
    parentId Int?
    label String
    path String
    sort Int @default(0)
    level Int @default(1)
    Menu            Menu?  @relation("MenuToMenu_parentId", fields: [parentId], references: [id])
    other_Menu          Menu[] @relation("MenuToMenu_parentId")
    roles MenuOnRole[]
}

model MenuOnRole {
    menuId Int
    menu Menu @relation(fields: [menuId], references: [id])
    roleId Int

    @@id([menuId, roleId])
}

model MenuOnAPI {
    menuId Int
    apiPath Int

    @@id([menuId, apiPath])
}
```

## Operations

1. 分页查询用户

```graphql
query GetUserList(
  $take: Int = 10
  $skip: Int = 0
  $orderBy: [local_UserOrderByWithRelationInput]
  $query: local_UserWhereInput
) {
  data: local_findManyUser(skip: $skip, take: $take, where: { AND: $query }, orderBy: $orderBy) {
    id
    name
    createdAt
    avatarUrl
    provider
  }
  total: local_aggregateUser(where: { AND: $query }) @transform(get: "_count.id") {
    _count {
      id
    }
  }
}
```

2. 查询所有角色
   调用 fireboom api

3. 查询所有菜单

```graphql
query GetAllMenus {
  data: local_findManyMenu {
    id
    label
    path
    sort
    parentId
  }
}
```

4. 查询所有 API
   调 fireboom api

5. 查用户的角色列表
  1. 查用户ids

  ```grahpql
  query GetUserRoleIds($userId: Int!) {
    data: local_findManyUserOnRole(where: {userId: {equals: $userId}}) {
      userId
      roleId
    }
  }
  ```

  2. 调用 fireboom api，传 roleIds

6. 用户关联角色
  1. 删除用户所有角色

  ```graphql
  mutation DeleteUserRoles($userId: Int!) {
    data: local_deleteManyUserOnRole(where: { userId: { equals: $userId } }) {
      count
    }
  }
  ```

  2. 批量添加用户的角色

  ```graphql
  mutation CreateUserRoles($data: [local_UserOnRoleCreateManyInput]!) {
    data: local_createManyUserOnRole(data: $data) {
      count
    }
  }
  ```

7. 查询角色所拥有的菜单

```graphql
query GetRoleMenus($roleId: Int!) {
  local_findManyMenuOnRole(where: {roleId: {equals: $roleId}}) {
    menu: Menu {
      sort
      path
      parentId
      level
      label
      id
    }
  }
}
```

8. 给角色关联菜单
  1. 删除角色的所有菜单
  ```graphql
  mutation DeleteRoleMenus($roleId: Int!) {
    data: local_deleteManyMenuOnRole(where: { roleId: { equals: $roleId } }) {
      count
    }
  }

  ```
  2. 批量添加角色的菜单

  ```graphql
  mutation CreateRoleMenus($data: [local_MenuOnRoleCreateManyInput]!) {
    data: local_createManyMenuOnRole(data: $data) {
      count
    }
  }
  ```

9. 角色查API列表
  调 fireboom api

10. 角色关联多个API
  调 fireboom api
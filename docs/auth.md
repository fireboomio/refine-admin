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
  Role Role[]
}

model Role {
  id        Int @id @default(autoincrement())
  code String
  desc String?
  User User[]
  Menu Menu[]
}

model Menu {
  id Int @id @default(autoincrement())
  parentId Int?
  label String
  path String
  icon String?
  sort Int @default(0)
  level Int @default(1)
  Menu            Menu?  @relation("MenuToMenu_parentId", fields: [parentId], references: [id])
  other_Menu          Menu[] @relation("MenuToMenu_parentId")
  Role Role[]
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
    providerId
    providerUserId
  }
  total: local_aggregateUser(where: { AND: $query }) @transform(get: "_count.id") {
    _count {
      id
    }
  }
}
```

2. 查询所有角色
query GetRoleList {
  data: local_findManyRole {
    id
    code
    desc
  }
}

3. 查询所有菜单

```graphql
query GetMenuList {
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

```grahpql
query GetUserRoles($userId: Int!) {
  local_findFirstUser(where: {id: {equals: $userId}}) {
    Role {
      code
      desc
      id
    }
  }
}
```

6. 用户关联角色
  1. 删除用户所有角色，目前只能先查然后通过循环调用

  ```graphql
  mutation DeleteUserRoles($userId: Int!, $roleId: Int!) {
    local_updateOneUser(where: {id: $userId}, data: {Role: {disconnect: {id: $roleId}}}) {
      id
    }
  }
  ```

  2. 批量添加用户的角色，目前只能循环调用

  ```graphql
  mutation CreateUserRoles($userId: Int!, $create: local_RoleCreateWithoutUserInput) {
    local_updateOneUser(data: {Role: {create: $create}}, where: {id: $userId}) {
      id
    }
  }
  ```

7. 查询角色所拥有的菜单

```graphql
query GetRoleMenus($roleId: Int!) {
  local_findFirstRole(where: {id: {equals: $roleId}}) {
    Menu {
      sort
      path
      parentId
      level
      label
      id
      icon
    }
  }
}
```

8. 给角色关联菜单
  1. 删除角色的所有菜单，目前只能循环删除
  ```graphql
  mutation DeleteRoleMenus($roleId: Int!, $menuId: Int!) {
    local_updateOneRole(where: {id: $roleId}, data: {Menu: {disconnect: {id: $menuId}}}) {
      id
    }
  }

  ```
  2. 批量添加角色的菜单

  ```graphql
  mutation CreateRoleMenus($roleId: Int!, $create: local_MenuCreateWithoutRoleInput) {
    local_updateOneRole(data: {Menu: {create: $create}}, where: {id: $roleId}) {
      id
    }
  }
  ```

9. 角色查API列表
  调 fireboom api

10. 角色关联多个API
  调 fireboom api

11. 同步用户
  1. 查询用户是否存在

  ```graphql
  query GetOneUser($provider: String!, $providerId: String!, $providerUserId: String!) {
    data: local_findFirstUser(
      where: { AND: { provider: {equals: $provider}, providerId: {equals: $providerId}, providerUserId: {equals: $providerUserId}}}
    ) {
      name
      id
    }
  }
  ```

  2. 如果用户不存在，则插入用户

  ```graphql
  mutation CreateOneUser($data: local_UserCreateInput!) {
    local_createOneUser(data: $data) {
      id
    }
  }
  ```

  3. 如果用户存在，则获取用户角色、菜单

  ```graphql
  query GetUserRoleMenu($userId: Int!, $roleId: Int! @internal) {
    data: local_findFirstUserOnRole(where: {userId: {equals: $userId}}) {
      roleId @export(as: "roleId")
      menus: _join @transform(get: "local_findManyMenuOnRole.data") {
        local_findManyMenuOnRole(where: {roleId: {equals: $roleId}}) {
          data: Menu {
            id
            label
            level
            parentId
            path
            sort
          }
        }
      }
    }
  }
  ```
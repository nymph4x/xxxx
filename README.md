## Leaderboard 页面说明

本页面展示一个福币排行榜，用户可以在排行榜上查看自己和其他用户的福币分数以及头像。以下是本项目的页面、云函数和数据库配置的详细说明。

### 项目结构

- **`pages/leaderboard/leaderboard.vue`**：排行榜页面的前端代码。
- **`cloudfunctions/getLeaderboard/index.js`**：获取排行榜数据的云函数。
- **`cloudfunctions/updateUserScore/index.js`**：用于更新用户分数的云函数。
- **`cloudfunctions/getAndUpdateAvatarUrl/index.js`**：用于获取并更新用户头像 URL 的云函数。
- **`database/users` 和 `database/leaderboard`**：两个数据库集合，分别用于存储用户信息和排行榜数据。

---

### 1. Leaderboard 页面 (`leaderboard.vue`)

#### 代码说明

`leaderboard.vue` 是用于显示排行榜页面的 Vue 组件。它调用 `getLeaderboard` 云函数，获取包含用户名、头像和福币分数的排行榜数据，并显示在页面上。

#### 主要逻辑

- 在 `created` 钩子中，页面加载时调用 `fetchLeaderboardData` 方法获取排行榜数据。
- 使用 `v-for` 循环渲染每个用户的排名、头像、昵称和分数。
- 如果用户的头像 URL 无法直接使用 `fileID` 显示，将通过 `getAndUpdateAvatarUrl` 云函数生成一个临时 URL，并将其更新到 `users` 集合中。

---

### 2. 云函数说明

#### 2.1 `getLeaderboard` 云函数

**文件位置**：`cloudfunctions/getLeaderboard/index.js`

**功能**：从 `leaderboard` 集合中获取排行榜数据，并结合 `users` 集合中的用户头像和昵称，返回前 10 名用户的数据。

**主要逻辑**：
- 从 `leaderboard` 集合按分数降序获取前 10 名用户的记录。
- 对每个用户，获取其 `nickname` 和 `avatarUrl`。如果 `avatarUrl` 是 `fileID`，则调用 `fetchAvatarUrl` 函数将其转换为临时 URL。
- 如果请求包含 `user_id`，则查找当前用户的排名并返回。

**返回数据结构**：
- `users`：包含前 10 名用户的 `rank`、`nickname`、`avatarUrl` 和 `score`。
- `currentUser`：包含当前用户的 `rank` 和 `score`。

#### 2.2 `updateUserScore` 云函数

**文件位置**：`cloudfunctions/updateUserScore/index.js`

**功能**：用于更新或添加用户的福币分数。

**主要逻辑**：
- 接收 `user_id` 和 `scoreChange` 作为参数。
- 查找 `leaderboard` 集合中是否存在该用户记录。
  - 如果存在，则更新分数。
  - 如果不存在，则新增记录。
- 更新分数后返回成功信息。

**返回数据结构**：
- `code`：操作状态码。
- `msg`：操作结果信息。

#### 2.3 `getAndUpdateAvatarUrl` 云函数

**文件位置**：`cloudfunctions/getAndUpdateAvatarUrl/index.js`

**功能**：获取并更新用户头像的 URL。（此函数主要是为了个人进行测试，无法获得多个用户信息，所以自己创建信息，从本地上传图片到云存储作为用户头像，获得一个唯一的 `fileID`， 通过此函数将 `fileID`转换为`avatarUrl`，以便在页面上显示出头像。后续可以选择删除）

**主要逻辑**：
- 接收 `user_id` 作为参数，获取 `users` 集合中的用户记录。
- 检查 `avatarUrl` 是否是 `fileID`（不是完整的 URL）。
  - 如果是 `fileID`，则调用 `uniCloud.getTempFileURL` 生成临时 URL。
  - 将生成的临时 URL 更新到 `avatarUrl` 字段中。
- 返回更新后的头像 URL。

**返回数据结构**：
- `avatarUrl`：用户头像的临时 URL。
- `code` 和 `msg`：操作状态码和结果信息。

---

### 3. 数据库结构

#### 3.1 `users` 集合

`users` 集合用于存储用户的基本信息，包括以下字段：

- `_id`：系统生成的唯一标识符。
- `account`：用户账户名。
- `nickname`：用户昵称。
- `avatarUrl`：用户头像的 `fileID` 或临时 URL（由 `getAndUpdateAvatarUrl` 云函数更新）。
- `createdAt`：用户注册时间。
- `updatedAt`：用户信息最后更新时间。等

#### 3.2 `leaderboard` 集合

`leaderboard` 集合用于存储排行榜数据，包括以下字段：

- `_id`：系统生成的唯一标识符。
- `user_id`：关联 `users` 集合中的用户 ID。
- `score`：用户的福币分数。
- `updatedAt`：分数的最后更新时间。

**在登陆和注册页面获取用户ID并存储到本地，后续调用用户ID实现`leaderboard` 集合和`users` 集合关联，绑定同一用户。**


### 4. 使用说明

#### 4.1 设置云环境和数据库

1. 在 `uniCloud` 中创建数据库集合 `users` 和 `leaderboard`。
2. 确保数据库集合结构符合上述说明。
3. 将`getLeaderboard`、`updateUserScore` 和 `getAndUpdateAvatarUrl` 云函数部署到云环境。

#### 4.2 测试和运行

1. **用户注册**：创建用户记录，填写 `nickname` 和 `avatarUrl`（存储为 `fileID`）。
2. **更新用户分数**：调用 `updateUserScore` 云函数，更新或新增用户的福币分数。
3. **显示排行榜**：在 `leaderboard.vue` 页面中，调用 `getLeaderboard` 云函数获取排行榜数据并显示。
4. **头像 URL 更新**：若头像显示异常，检查 `getAndUpdateAvatarUrl` 云函数是否正确生成并更新 `avatarUrl`。




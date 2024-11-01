# 完善注册资料页面 (profileComplete.vue)

## 描述
完善注册资料页面用于在新用户注册后引导其补充必要的个人信息（如昵称或头像）。该页面通过云函数将用户的补充信息更新到数据库，从而完善用户档案，使其体验更加完整。

## 页面结构与功能
1. **用户资料输入框**：
   - **昵称输入框**：用户输入个人昵称，用于展示在应用内的排行榜和任务记录等界面。
   - **头像上传**：用户可以选择上传头像，提升个人页面的个性化效果。

2. **按钮**：
   - **完成按钮**：点击后提交用户资料，触发云函数更新数据库。

## 页面交互逻辑
1. **提交个人资料**：用户填写昵称和上传头像后，点击“完成”按钮触发 `completeProfile` 方法：
   - 调用 `completeProfile` 云函数，将用户的昵称和头像等信息保存至数据库。
   - 资料更新成功后，页面跳转至应用主界面或福币排行榜，以完成新用户的初始设置流程。

2. **返回欢迎页面**：若用户不想立即补充个人资料，可以返回欢迎页面或直接退出注册流程。

## 相关云函数

### completeProfile 云函数
用于保存用户的个人资料，包括昵称和头像等信息。
- **输入**：
  - `user_id`：用户 ID，用于标识当前用户。
  - `nickname`：用户的昵称。
  - `avatar`：用户的头像（可选）。
- **输出**：
  - 返回更新后的用户信息；若更新失败则返回错误信息。
- **逻辑**：
  - 使用 `user_id` 检索 `users` 集合中的用户记录，并更新其昵称和头像。
  - 成功更新后返回确认信息，以便前端确认更新结果。

## 注意事项
- **必填信息验证**：确保用户至少填写昵称，避免后续展示时出现空白昵称。
- **头像上传**：若用户未上传头像，系统应提供默认头像。
- **数据同步**：资料更新后，确保页面刷新并在各处同步显示最新的用户信息。

## 小结
完善个人资料页面主要为新用户提供一个快速补充档案的入口。通过调用 `completeProfile` 云函数将数据同步至数据库，确保用户信息完整，使用户获得更个性化的体验。

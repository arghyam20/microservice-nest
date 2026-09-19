# API Inventory

This inventory reflects controller routes present in the maintained monolith under `src/`. Existing routes are intentionally preserved during microservice extraction.

## Auth

- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/refresh-token`
- `GET /auth/logout`

## User

- `GET /user/profile-details`
- `POST /user/update`
- `POST /user/change-password`
- `POST /user/update-settings`

## Admin

- `GET /admin/profile-details`
- `POST /admin/update`
- `POST /admin/change-password`
- `GET /admin/dashboard`

## Admin User

- `POST /admin/user/getall`
- `POST /admin/user/save`
- `GET /admin/user/get/:id`
- `POST /admin/user/update`
- `POST /admin/user/status-change`
- `GET /admin/user/delete/:id`
- `POST /admin/user/listing`

## Admin Role

- `POST /admin/role/save`
- `GET /admin/role/get/:id`
- `POST /admin/role/update`
- `POST /admin/role/status-change`
- `GET /admin/role/delete/:id`
- `POST /admin/role/getall`

## Admin Access

- `POST /admin/access/getall`
- `POST /admin/access/save`
- `GET /admin/access/get/:id`
- `POST /admin/access/update`
- `POST /admin/access/status-change`
- `GET /admin/access/delete/:id`
- `GET /admin/access/all-list`

## Category

- `GET /category/list`
- `POST /admin/category/getall`
- `POST /admin/category/save`
- `GET /admin/category/get/:id`
- `POST /admin/category/update`
- `POST /admin/category/status-change`
- `GET /admin/category/delete/:id`
- `GET /admin/category/list`

## CMS

- `POST /admin/cms/getall`
- `GET /admin/cms/get/:id`
- `POST /admin/cms/update`
- `POST /admin/cms/status-change`

## Media

- `POST /media/upload-single-file`
- `POST /media/upload-multiple-file`
- `POST /media/delete`
- `POST /admin/media/upload-single-file`
- `POST /admin/media/upload-multiple-file`
- `POST /admin/media/delete`

## Notification

- `POST /notification/getall`
- `POST /notification/mark-as-read`
- `GET /notification/delete/:id`
- `GET /notification/delete-all`
- `GET /notification/unread-count`
- `POST /admin/notification/getall`
- `POST /admin/notification/mark-as-read`
- `GET /admin/notification/delete/:id`

## Settings

- `GET /admin/setting/get`
- `POST /admin/setting/update`

## Contact Us

- `POST /admin/contact-us/getall`
- `GET /admin/contact-us/get/:id`
- `GET /admin/contact-us/delete/:id`
- `POST /admin/contact-us/send-reply`

## Service Health Endpoints

Every service shell under `apps/` exposes:

- `GET /health`
- Swagger at `/api/docs`

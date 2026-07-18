-- Promotes an existing registered user to the Admin role.
-- Usage: register the account normally through the app first (POST
-- /api/auth/register or the /register page), then run this script against
-- the insan database, replacing the email below with that account's email.
--
--   psql -U postgres -h localhost -d insan -f database/make-admin.sql
--
-- UserRole enum (backend/Insan.Domain/Enums/UserRole.cs): Visitor=0, User=1,
-- Moderator=2, Admin=3.

UPDATE "Users"
SET "Role" = 3
WHERE "Email" = 'admin@example.com';

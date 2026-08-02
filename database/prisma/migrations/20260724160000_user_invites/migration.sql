-- Invite-only provisioning — pending users accept via signed token link

CREATE TABLE "identity"."user_invites" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "token_hash" TEXT NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "used_at" TIMESTAMP(3),
  "invited_by_id" UUID,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "user_invites_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "user_invites_user_id_idx" ON "identity"."user_invites"("user_id");
CREATE INDEX "user_invites_token_hash_idx" ON "identity"."user_invites"("token_hash");

ALTER TABLE "identity"."user_invites"
  ADD CONSTRAINT "user_invites_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "identity"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

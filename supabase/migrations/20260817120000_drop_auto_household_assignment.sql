-- Every new auth user was auto-joined to the one hardcoded household, so any account
-- that came into existence got full read/write on the household's data. Only the two
-- real accounts ever used it. Membership is now granted deliberately; a user with no
-- household_members row sees nothing, because current_household_id() returns null and
-- every policy compares household_id against it.
drop trigger on_auth_user_created on auth.users;
drop function public.assign_to_household();

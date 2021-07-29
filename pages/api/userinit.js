import {db} from '../../db.js';
// import {supabase} from '../../utils/supabase.js';

export default async (_, res) => {
  await db.task(async t => {
    // const { data, error } = await supabase
    //   .storage
    //   .deleteBucket('avatars')

    // console.log("data>>> ", data)

    await t.none('DROP TABLE IF EXISTS profiles');

    await t.none(`
      create table profiles (
        id uuid references auth.users not null,
        updated_at timestamp with time zone,
        username text unique,
        avatar_url text,
        website text,

        primary key (id),
        unique(username),
        constraint username_length check (char_length(username) >= 3)
      )
    `)

    await t.none(`alter table profiles enable row level security;`)

    await t.none(`create policy "Public profiles are viewable by everyone."
      on profiles for select
      using ( true )`)

    // await t.none(`create policy "Users can insert their own profile."
    //   on profiles for insert
    //   with check ( auth.uid() = id )`)

    // await t.none(`create policy "Users can update own profile."
    //   on profiles for update
    //   using ( auth.uid() = id );`)

    // -- Set up Realtime!
    await t.none(`begin;
      drop publication if exists supabase_realtime;
      create publication supabase_realtime;
    commit;
    alter publication supabase_realtime add table profiles;`)

    // -- Set up Storage!
    await t.none(`insert into storage.buckets (id, name)
    values ('avatars', 'avatars');`)

    await t.none(`create policy "Avatar images are publicly accessible."
      on storage.objects for select
      using ( bucket_id = 'avatars' );`)

    await t.none(`create policy "Anyone can upload an avatar."
      on storage.objects for insert
      with check ( bucket_id = 'avatars' )`)
  })

  res.send('ok');
}


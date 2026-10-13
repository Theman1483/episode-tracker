import { revalidatePath } from "next/cache";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { episodes } from "@/db/schema";

export const instant = false;

async function addEpisode(formData: FormData) {
  "use server";

  const title = String(formData.get("title") ?? "").trim();
  const guest = String(formData.get("guest") ?? "").trim();
  const youtubeUrl = String(formData.get("youtube_url") ?? "").trim();
  const publishedOn = String(formData.get("published_on") ?? "").trim();

  if (!title) {
    return;
  }

  await db.insert(episodes).values({
    title,
    guest: guest || null,
    youtube_url: youtubeUrl || null,
    published_on: publishedOn || null,
  });

  revalidatePath("/");
}

export default async function Home() {
  const allEpisodes = await db
    .select()
    .from(episodes)
    .orderBy(desc(episodes.id));

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-12">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Episode tracker</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Add an episode and see everything stored in the database.
        </p>
      </header>

      <section>
        <h2 className="mb-4 text-xl font-medium">Add episode</h2>
        <form action={addEpisode} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            Title
            <input
              name="title"
              type="text"
              required
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Guest
            <input
              name="guest"
              type="text"
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            YouTube URL
            <input
              name="youtube_url"
              type="url"
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Date
            <input
              name="published_on"
              type="date"
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
          <button
            type="submit"
            className="mt-2 rounded-md bg-zinc-900 px-4 py-2 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            Add episode
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-medium">All episodes</h2>
        {allEpisodes.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">No episodes yet.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {allEpisodes.map((episode) => (
              <li
                key={episode.id}
                className="rounded-md border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <h3 className="font-medium">{episode.title}</h3>
                {episode.guest ? (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Guest: {episode.guest}
                  </p>
                ) : null}
                {episode.published_on ? (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {episode.published_on}
                  </p>
                ) : null}
                {episode.youtube_url ? (
                  <a
                    href={episode.youtube_url}
                    className="text-sm underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Watch on YouTube
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

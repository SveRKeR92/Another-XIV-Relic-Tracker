import { Github, MessageCircle, Twitch } from "lucide-react";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1>
          Welcome to another FFXIV Relic Weapon Tracker !
        </h1>
        <p>
          I mostly wanted to create an alternative to the many different relic weapon trackers out there, one that can regroup the relics for all expansions in one place.
        </p>
          No login required, everything is stored in your browser local storage, you won&apos;t lose your data unless you clear your browser data.
        <p>
          You can find me on Github / Discord, feel free to reach out if you have any questions or suggestions.
        </p>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a 
          href="https://github.com/SveRKeR92" 
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        >
          <Github/> My Github
        </a>
        <a
          href="https://discord.com/users/321982838151053312"
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        >
          <MessageCircle/> My Discord
        </a>
        <a
          href="https://www.twitch.tv/sverker__"
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        >
          <Twitch/> I stream sometimes !
        </a>
      </footer>
    </div>
  );
}

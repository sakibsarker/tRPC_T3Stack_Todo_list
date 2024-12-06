import Link from "next/link";

import { LatestPost } from "@/app/_components/post";
import TodoList from "./_components/TodoList";

export default async function Home() {
  return (
    <div className="items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      {/* <div className="flex items-center justify-center gap-12 px-4 py-16">
        <LatestPost />
      </div> */}
      <TodoList />
    </div>
  );
}

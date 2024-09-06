export default function Home() {
  return (
    <main className="flex items-center justify-center h-screen p-5 bg-gray-100 sm:bg-red-100 md:bg-green-100 lg:bg-cyan-100 xl:bg-orange-100 2xl:bg-purple-100 dark:bg-gray-700">
      <div className="flex flex-col w-full max-w-screen-sm gap-2 p-5 bg-white shadow-lg md:flex-row rounded-3xl dark:bg-gray-500">
        <input type="text" className="w-full h-12 pl-5 transition-shadow bg-gray-200 rounded-full outline-none placeholder:drop-shadow ring ring-transparent focus:ring-orange-500 focus:ring-offset-2" placeholder="Search here..." />
        <button className="py-2 font-medium text-white transition-transform bg-black bg-opacity-50 rounded-full outline-none active:scale-90 md:px-10">Search</button>
      </div>
    </main>
  );
}

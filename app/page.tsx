export default function Home() {
  return (
    <main className="flex items-center justify-center h-screen p-5 bg-gray-100 sm:bg-red-100 md:bg-green-100 lg:bg-cyan-100 xl:bg-orange-100 2xl:bg-purple-100 dark:bg-gray-700">
      <div className="flex flex-col gap-3 w-full max-w-screen-sm p-5 bg-white shadow-lg rounded-3xl ">
        {["Nico","Me","You","ban",""].map((person,index)=>
        <div key={index} className="flex items-center gap-5 group">
          <div className="size-7 bg-blue-400 rounded-sexy-name "/>
          <span className="text-lg font-medium group-hover:text-red-500 group-focus-within:">{person}</span>
          <div className="size-6 animate-none bg-red-500 text-white flex items-center justify-center rounded-full
          relative">
            <span className="z-10">{index}</span>
            <div className="size-6 bg-red-500 rounded-full absolute animate-ping"/>
          </div>
        </div>
        )}
        <div>
          <input type="text"/>
        </div>
      </div>
    </main>
  );
}
